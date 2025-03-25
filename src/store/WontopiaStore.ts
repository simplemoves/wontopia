import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, Nft, NftStore, StoresSchema } from "../lib/Types";
import { Address } from "@ton/core";

const emptyStore = {
    gameState: {
        active: false,
    },
};

const stores: Record<string, UseBoundStore<StoreApi<NftStore>>> = {}

export const useWontopiaStore = (walletAddressStr: string) => {
    let store = stores[walletAddressStr];
    if (!store) {
        store = createWontopiaStore(walletAddressStr);
        stores[walletAddressStr] = store;
    }

    return store;
}

const createWontopiaStore = (walletAddressStr: string) => create<NftStore>()(
    devtools(
        persist(
            (set, get) => ({
                walletAddress: Address.parse(walletAddressStr),
                statesRegistry: {},
                nfts: {},
                running: {},

                getGameStateStorage: (wontonPower) => {
                    const store = get().statesRegistry[wontonPower] || emptyStore;
                    if (store.gameState.startedAt instanceof Date) {
                        return store;
                    }
                    return StoresSchema.parse(store);
                },
                startGame: (wontonPower): GameState => {
                    const store = get().getGameStateStorage(wontonPower);
                    const gameState = { ... store.gameState, active: true, startedAt: new Date() }
                    set((state) => ({ statesRegistry: { ... state.statesRegistry, [wontonPower]: { gameState: gameState } } }));
                    return gameState;
                },
                stopGame: (wontonPower): GameState => {
                    const store = get().getGameStateStorage(wontonPower);
                    const gameState = { ... store.gameState, active: false, startedAt: undefined }
                    set((state) => ({ statesRegistry: { ... state.statesRegistry, [wontonPower]: { gameState: gameState } } }))
                    return gameState;
                },
                getGameState: (wontonPower): GameState => {
                    return get().getGameStateStorage(wontonPower).gameState;
                },
                setNftState: (nft, newState) => {
                    const powerHistory = get().nfts[nft.wonton_power - 1];
                    if (powerHistory) {
                        const storedNft = powerHistory[nft.nft_address]
                        if (storedNft) {
                            const updatedNft = { ... storedNft, state: newState};
                            set({ nfts: { ... get().nfts, [nft.wonton_power - 1]: { ... powerHistory, [nft.nft_address]: updatedNft } } });
                        }
                    }
                },
                markNftAsBurned: (nft) => { get().setNftState(nft, { type: 'NFT_BURN_REQUEST', updated_at: new Date().toISOString()}) },
                markNftAsBet: (nft) => { get().setNftState(nft, { type: 'NFT_BET_REQUEST', updated_at: new Date().toISOString()}) },
                addNft: (wontonPower, newNft: Nft) => {
                    const powerHistory = get().nfts[wontonPower] ?? {};
                    powerHistory[newNft.nft_address] = newNft;
                    set({ nfts: { ... get().nfts, [wontonPower]: powerHistory } });
                },
                getNfts: (wontonPower): Nft[] => Object.values(get().nfts[wontonPower] ?? {}).filter(nft => nft.state.type === 'NFT'),
                getFilteredNfts: (wontonPower, cType): Nft[] => {
                    return get().getNfts(wontonPower).filter(nft => nft.collection_type === cType);
                },
                setRunning: (wontonPower, isRunning) => set({ ... get().running, [wontonPower]: isRunning }),
                isRunning: (wontonPower) => get().running[wontonPower] ?? false,
                clearStorage: () => { set({ statesRegistry: {}, nfts: {}, running: {} }) },
                storageIsEmpty: () => Object.keys(get().statesRegistry).length === 0
                                      && Object.keys(get().nfts).length === 0
                                      && Object.keys(get().running).length === 0,
            }),
            {
                name: walletAddressStr,
            },
        ),
    ),
);

