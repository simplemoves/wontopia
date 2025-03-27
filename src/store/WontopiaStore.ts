import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Nft, NftsResult, NftStore, NftsVariables, PlayState, PlayStateEventNftSchema, PlayStateEventSchema, PlayStateEventsHolder } from "../lib/Types";
import { v4 as uuidv4 } from "uuid";
import { nftsQuery } from "../lib/WontopiaGraphQL.ts";
import { testOnly } from "../lib/Constants.ts";
import { fetchMeta } from "../providers/WontopiaTonClientProvider.ts";
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { graphQLClient } from "../lib/graphQLClient.ts";

const stores: Record<string, UseBoundStore<StoreApi<NftStore>>> = {}

export const useWontopiaStore = (walletAddressStr: string, power: number) => {
    const name = `${walletAddressStr}_power${power}`
    stores[name] ??= createWontopiaStore(walletAddressStr, power, name); // insert on absent key
    return stores[name];
}

const createWontopiaStore = (walletAddress: string, power: number, name: string) => create<NftStore>()(
    devtools(
        persist(
            (set, get) => ({
                walletAddress,
                power,
                nfts: {},

                isNftsRequestInProgress: false,

                running: false,
                state: 'UNKNOWN',
                playersToWait: 3,
                startedAt: undefined,
                stateChangedAt: undefined,

                getGameState: (): PlayState => get().state,
                startGame: () => { set({ running: true, startedAt: new Date().toISOString() }); },
                stopGame: () => { set({ running: false, startedAt: undefined, state: 'UNKNOWN', playersToWait: 3, stateChangedAt: undefined }); },
                isGameRunning: () => get().running,

                setNftState: (nft_address, newState) => {
                    const nft = get().nfts[nft_address];
                    if (nft) {
                        set({ nfts: {... get().nfts, [nft_address]: { ... nft, state: { type: newState, updated_at: new Date().toISOString() } } }});
                    }
                },
                markNftAsBurned: (nft_address) => { get().setNftState(nft_address, 'NFT_BURN_REQUEST') },
                markNftAsBet: (nft_address) => { get().setNftState(nft_address, 'NFT_BET_REQUEST') },
                addNft: (newNft: Nft) => { set({ nfts: { ... get().nfts, [newNft.nft_address]: newNft }}); },
                getNfts: (): Nft[] => Object.values(get().nfts ?? []).filter(nft => nft.state.type === 'NFT'),
                getFilteredNfts: (cType): Nft[] => get().getNfts().filter(nft => nft.collection_type === cType),

                clearStorage: () => { set({ nfts: {}, running: false, state: 'UNKNOWN', playersToWait: 3, startedAt: undefined,  stateChangedAt: undefined }) },
                storageIsEmpty: () => Object.keys(get().nfts).length === 0,
                gameStateHandler: (prevEventHolder, newResult): PlayStateEventsHolder => {
                    console.log(`new result: ${JSON.stringify(newResult)}`);
                    const newEventHolder = {
                        event: { ... PlayStateEventSchema.parse(newResult.playState), id: uuidv4().toString() },
                        players_to_wait: newResult.playState.playersToWait ?? 3,
                        // started_at: prevEventHolder?.event ? prevEventHolder.started_at : new Date(),
                    }

                    let stateChangedAt = get().stateChangedAt
                    if (newEventHolder.event.state !== prevEventHolder?.event.state || newEventHolder.players_to_wait !== prevEventHolder?.players_to_wait) {
                        stateChangedAt = new Date().toISOString();
                    }

                    check when state is inactive

                    set({ state: newEventHolder.event.state, playersToWait: newEventHolder.players_to_wait, stateChangedAt: stateChangedAt })

                    return newEventHolder;
                },
                startNftsRequest: () => {
                    set({ isNftsRequestInProgress: true });
                },
                stopNftsRequest: () => {
                    set({ isNftsRequestInProgress: false });
                },
                handleUpdate: () => {
                    if (get().isNftsRequestInProgress) {
                        console.debug(`${new Date().getTime()} | Requesting nfts is in progress...`);
                        return;
                    }

                    requestNfts(get).catch((err) => {
                        console.error(err);
                    });
                }
            }),
            { name, },
        ),
    ),
);


const requestNfts = async (get: () => NftStore) => {
    get().startNftsRequest();
    try {
        console.debug(`${new Date().getTime()} | Requesting nfts... isNftsRequestInProgress: ${get().isNftsRequestInProgress}`);
        const result = await graphQLClient.query<NftsResult, NftsVariables>(
            nftsQuery,
            {
                walletAddressStr: get().walletAddress,
                power: get().power + 1,
                statuses: [ "MINTED" ],
            }).toPromise();

        console.debug(`${new Date().getTime()} | Finished requesting nfts...`);
        if (result.error) {
            console.error(`With error: ${result.error}`);
        } else {
            const nfts = result.data?.nfts || [];
            for (const nft of nfts) {
                const parsedNft = PlayStateEventNftSchema.parse(nft);
                const repoName = testOnly ? "wontopia-nft-testnet" : "wontopia-nft";
                const nftMeta = await fetchMeta(`https://simplemoves.github.io/${repoName}/${parsedNft.collectionType}/${parsedNft.power}${parsedNft.metaUrl}`);
                get().addNft({
                    state: {
                        type: 'NFT',
                        updated_at: new Date().toISOString(),
                    },
                    nft_address: parsedNft.address,
                    owner_address: parsedNft.ownerAddress,
                    nft_index: parsedNft.index,
                    collection_type: parsedNft.collectionType,
                    wonton_power: parsedNft.power,
                    created_at: parsedNft.mintedAt.toISOString(),
                    nft_meta: nftMeta,
                });
            }
        }
    } catch (error) {
        console.error(`${new Date().getTime()} | Requesting nfts failed with error: ${getErrorMessage(error)}`);
    }
    get().stopNftsRequest();
}