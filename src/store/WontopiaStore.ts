import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { activePlayStates, Nft, NftsResult, NftStore, NftsVariables, PlayStateEventNftSchema } from "../lib/Types";
import { nftsQuery } from "../lib/WontopiaGraphQL.ts";
import { testOnly } from "../lib/Constants.ts";
import { fetchMeta } from "../providers/WontopiaTonClientProvider.ts";
import { getErrorMessage, printJson } from "../lib/ErrorHandler.ts";
import { graphQLClient } from "../lib/graphQLClient.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { tryNTimes, wait } from "../lib/PromisUtils.ts";
import { toNano } from "@ton/core";
import { WonTonContract } from "../wrappers/WonTonContract.ts";
import { WonTonNftItemContract } from "../wrappers/WonTonNftItemContract.ts";

const stores: Record<string, UseBoundStore<StoreApi<NftStore>>> = {}

export const useWontopiaStore = (walletAddressStr: string, wonTonPower: number) => {
    const name = `${walletAddressStr}_power${wonTonPower}`
    let store = stores[name];
    if (!store) {
        store = createWontopiaStore(walletAddressStr, wonTonPower, name);
        stores[name] = store;
    }
    return store;
}

const createWontopiaStore = (
    walletAddress: string,
    power: number,
    name: string) => create<NftStore>()(
    devtools(
        persist(
            (set, get) => ({
                walletAddress,
                power,
                nfts: {},
                winNfts: {},
                looseNfts: {},

                isNftsRequestInProgress: false,

                gameIsRunning: false,
                isGameTakingTooLong: false,
                state: 'UNKNOWN',
                startedAt: undefined,
                stateChangedAt: undefined,

                startGame: () => {
                    console.log(`Start game for universe: ${get().power}`);
                    set({ gameIsRunning: true, startedAt: new Date().toISOString(), isGameTakingTooLong: false, state: 'UNKNOWN' });
                    gameTakesTooLongCheck(25000, get, set);
                    console.log(`Game started for universe: ${get().power}, gameIsRunning: ${get().gameIsRunning}`);
                },
                continueGame: () => {
                    console.log(`Continue game for universe: ${get().power}`);
                    set({ gameIsRunning: true });
                    gameTakesTooLongCheck(25000, get, set);
                },
                stopGame: () => {
                    set({
                        gameIsRunning: false,
                        isGameTakingTooLong: false,
                        stateChangedAt: undefined,
                    });
                },
                setNftState: (nft_address, newState) => {
                    const nft = get().nfts[nft_address];
                    if (nft) {
                        const nfts = get().nfts;
                        const { [nft_address]: _removed1, ...winNfts } = get().winNfts;
                        const { [nft_address]: _removed2, ...looseNfts } = get().looseNfts;
                        set({
                            nfts: nfts[nft_address]
                                  ? { ... nfts, [nft_address]: { ... nft, state: { type: newState, updated_at: new Date().toISOString() } } }
                                  : nfts,
                            winNfts: winNfts,
                            looseNfts: looseNfts,
                        });
                    }
                },
                markNftAsBurned: (nft_address) => {
                    get().setNftState(nft_address, 'NFT_BURN_REQUEST')
                },
                markNftAsBet: (nft_address) => { if (nft_address) { get().setNftState(nft_address, 'NFT_BET_REQUEST') } },
                addNft: (newNft: Nft) => {
                    console.log(`Add nft: ${newNft.wonton_power}/${newNft.nft_index} for address: ${get().walletAddress} and universe: ${get().power}`);
                    const { nfts, winNfts, looseNfts } = get();
                    set({
                        nfts: { ... nfts, [newNft.nft_address]: newNft },
                        winNfts: newNft.collection_type === 'WIN' ? { ... winNfts, [newNft.nft_address]: newNft } : winNfts,
                        looseNfts: newNft.collection_type === 'LOOSE' ? { ... looseNfts, [newNft.nft_address]: newNft } : looseNfts,
                    });
                },
                // getFilteredNfts: (cType): Nft[] => Object.values(get().nfts).filter(nft => nft.state.type === 'NFT' && nft.collection_type === cType),
                // getWinNfts: () => get().getFilteredNfts('WIN'),
                // getLooseNfts: () => get().getFilteredNfts('LOOSE'),

                clearStorage: () => { set({ nfts: {}, gameIsRunning: false, state: 'UNKNOWN', startedAt: undefined, stateChangedAt: undefined }) },
                storageIsEmpty: () => Object.keys(get().nfts).length === 0,
                gameStateHandler: (playStateEvent) => {
                    if (playStateEvent.power != get().power) {
                        console.error(`Result received for the wrong universe: ${printJson(playStateEvent)}`);
                        return;
                    }
                    // console.log(`new result: ${JSON.stringify(newResult)}`);
                    // console.log(`error: ${error}`);
                    set({ state: playStateEvent.state, stateChangedAt: playStateEvent.stateChangedAt.toISOString() })

                    // If game played, need to run NFTs update
                    if (get().state == "WIN" || get().state == "LOOSE") {
                        console.log("Running NFTs list update request")
                        get().handleUpdate()
                    }

                    if (activePlayStates[get().state]) {
                        // get().continueGame()
                        set({ gameIsRunning: true });
                        return;
                    } else {
                        // If terminated state reported we need to stop game
                        set({ gameIsRunning: false });
                        return
                    }
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
                },
                sendBet: async (sender, wContractAddress): Promise<boolean> => {
                    // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
                    const wContract = WonTonContract.createFromAddress(wContractAddress)
                    const client = await wonTonClientProvider.wonTonClient();
                    const openedContract = client.open(wContract);
                    const success = await tryNTimes(async () => {
                        const queryId = new Date().getTime();
                        return await openedContract.sendBet(sender, { queryId, value: toNano("1.0"), provided_wonton_power: 0 })
                    }, 3, 100);

                    if (success) {
                        get().startGame();
                        return true;
                    }

                    return false;
                },
                sendBetNft: async (sender, nftAddress) => {
                    // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
                    if (!nftAddress) {
                        console.error(`sendBetTft nftAddress is undefined`);
                        return false;
                    }
                    const tonNftItemContract = WonTonNftItemContract.createFromAddressStr(nftAddress);
                    const client = await wonTonClientProvider.wonTonClient();
                    const openedContract = client.open(tonNftItemContract);
                    const success = await tryNTimes(async () => {
                        const queryId = new Date().getTime();
                        return await openedContract.sendBetNft(sender, { queryId, value: toNano("0.05") })
                    }, 3, 100);
                    console.log(`sendBetNft result: ${success}`);

                    if (success) {
                        console.log(`Start game`);
                        get().startGame();

                        return true;
                    }

                    return false;
                },
                sendBurn: async (sender, nftAddress) => {
                    // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
                    const tonNftItemContract = WonTonNftItemContract.createFromAddressStr(nftAddress);
                    const client = await wonTonClientProvider.wonTonClient();
                    const openedContract = client.open(tonNftItemContract);
                    const success = await tryNTimes(async () => {
                        const queryId = new Date().getTime();
                        return await openedContract.sendBurn(sender, { queryId, value: toNano("0.05") })
                    }, 3, 100);

                    if (success) {
                        get().markNftAsBurned(nftAddress)
                    }
                },
            }),
            { name },
        ),
    ),
);

const gameTakesTooLongCheck = async (waitAmountMs: number, get: () => NftStore, set: StoreApi<NftStore>['setState']) => {
    const sleepTimeout = 200
    const cyclesToWait = waitAmountMs / sleepTimeout;
    let waitCycles = 0;
    while (get().gameIsRunning && !get().isGameTakingTooLong) {
        await wait(sleepTimeout);
        if (++waitCycles > cyclesToWait) {
            set({ isGameTakingTooLong: true });
        }
    }
}

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
            console.debug(`${new Date().getTime()} | Finished processing ${nfts.length} nfts...`);
        }
    } catch (error) {
        console.error(`${new Date().getTime()} | Requesting nfts failed with error: ${getErrorMessage(error)}`);
    }
    get().stopNftsRequest();
}