import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CollectionType, GameState, Nft, NftStore, StoreRegistrySchema, Stores, StoresSchema } from "../lib/Types";

const emptyStores= {
    gameState: {
      active: false,
    },
};

export const useWontopiaStore = create<NftStore>()(
    devtools(
        persist(
            (set, get) => ({
                storesRegistry: {},
                store: (walletAddressStr) => {
                    const currentStoresRegistry = { ...get().storesRegistry };
                    let stores: Stores = currentStoresRegistry[walletAddressStr];
                    if (!stores) {
                        stores = emptyStores
                        set({ storesRegistry: { ...currentStoresRegistry,  [walletAddressStr]: stores }});
                    }

                    return StoresSchema.parse(stores)
                },
                startGame: (walletAddressStr): GameState => {
                  const store = get().store(walletAddressStr);
                  const gameState = { ...store.gameState, active: true, startedAt: new Date() }
                  set({ storesRegistry: { ...get().storesRegistry, [walletAddressStr]: { gameState: gameState } }})
                  return gameState;
                },
                stopGame: (walletAddressStr): GameState => {
                  const store = get().store(walletAddressStr);
                  const gameState = { ...store.gameState, active: false, startedAt: undefined }
                  set({ storesRegistry: { ...get().storesRegistry, [walletAddressStr]: { gameState: gameState } }})
                  return gameState;
                },
                getGameState: (walletAddressStr): GameState => {
                  return get().store(walletAddressStr).gameState;
                },
                clearStorage: () => { set({ storesRegistry: { } }) },
                storageIsEmpty: () => !(Object.keys(get().storesRegistry).length > 0)
            }),
            {
                name: `nfts-storage`,
                migrate: (persistedState, version) => {
                  if (!persistedState) return { storesRegistry: {} };
                  try {
                    return StoreRegistrySchema.parse(persistedState);
                  } catch (error) {
                    console.error('⚠️ Persisted state invalid:', error);
                    return { storesRegistry: {} }; // Fallback to safe state
                  }
                },
            },
        ),
    ),
);

export const createNftIndex = (cType: CollectionType, wontonPower: number, nftIndex: number) => `${cType}:${wontonPower}:${nftIndex}`;
export const createNftIndexFrom = (nft?: Nft) => `${nft?.collection_type}:${nft?.wonton_power}:${nft?.nft_index}`;
export const equalNfts = (nft1?: Nft, nft2?: Nft) => createNftIndexFrom(nft1) === createNftIndexFrom(nft2);