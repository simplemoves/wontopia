import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, Nft, NftStore, StoresSchema } from "../lib/Types";
import { Address } from "@ton/core";

const emptyStore= {
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
                burnedNfts: {},
                nfts: {},
                running: false,

                getGameStateStorage: (wontonPower) => {
                  return StoresSchema.parse(get().statesRegistry[wontonPower] || emptyStore);
                },
                startGame: (wontonPower): GameState => {
                  const store = get().getGameStateStorage(wontonPower);
                  const gameState = { ...store.gameState, active: true, startedAt: new Date() }
                  set((state) => ({ statesRegistry: { ...state.statesRegistry, [wontonPower]: { gameState: gameState } }}));
                  return gameState;
                },
                stopGame: (wontonPower): GameState => {
                  const store = get().getGameStateStorage(wontonPower);
                  const gameState = { ...store.gameState, active: false, startedAt: undefined }
                  set((state) => ({ statesRegistry: { ...state.statesRegistry, [wontonPower]: { gameState: gameState } }}))
                  return gameState;
                },
                getGameState: (wontonPower): GameState => {
                  return get().getGameStateStorage(wontonPower).gameState;
                },
                markNftAsBurned: (nft: Nft) => {
                  set((state) => ({ burnedNfts: { ...state.burnedNfts, [nft.nft_address]: true }}));
                },
                addNft: (wontonPower, newNft: Nft) => {
                  const powerHistory = get().nfts[wontonPower] ?? {};
                  powerHistory[newNft.nft_address] = newNft;
                  set({ nfts: { ... get().nfts, [wontonPower]: powerHistory }});
                },
                getNfts: (wontonPower): Nft[] => Object.values(get().nfts[wontonPower] ?? {}),
                setRunning: (running: boolean) => set({ running }),
                isRunning: () => get().running,
                clearStorage: () => { set({ statesRegistry: {}, burnedNfts: {}, nfts: {}, running: false }) },
                storageIsEmpty: () => Object.keys(get().statesRegistry).length === 0
                                      && Object.keys(get().burnedNfts).length === 0
                                      && Object.keys(get().nfts).length === 0
            }),
            {
                name: walletAddressStr,
            },
        ),
    ),
);

