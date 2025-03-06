import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CollectionType, Nft, NftsHistory, NftStore, SimpleTransactionHistory, PROCESSED, FOUND, Stores, BEUniverses } from "../lib/Types";
import { Address } from "@ton/core";
import { checkNftOwner, digForNewNfts, requestNfts } from '../workers/WonTonNftTools';
import { testOnly } from "../lib/Constants.ts";

const new_nft_time_span = 30 * 60 * 1000;
const emptyStores= {
    nfts: {},
    transactions: {}
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

                    return stores
                },
                transactions: (walletAddressStr: string): SimpleTransactionHistory => {
                    return get().store(walletAddressStr).transactions;
                },
                newNft: (walletAddress, cType): Nft | undefined => {
                    const newNftMaybe =  get().store(walletAddress).newNft;
                    return newNftMaybe?.collection_type === cType ? newNftMaybe : undefined;
                },
                isTransactionProcessed: (walletAddressStr, txHash): boolean => {
                    return get().store(walletAddressStr).transactions[txHash]?.state === PROCESSED;
                },
                addTransaction: (walletAddressStr, newTransaction) => {
                    const store = get().store(walletAddressStr);
                    set({ storesRegistry: {
                            ...get().storesRegistry,
                            [walletAddressStr]: {
                                nfts: store.nfts,
                                transactions: { ...store.transactions, [newTransaction.hash]: newTransaction },
                            },
                        }})
                },
                doesNftExists: (walletAddressStr, collectionInfo, nftIndex) => {
                    const store = get().store(walletAddressStr);
                    const key: string = createNftIndex(collectionInfo.cType, collectionInfo.wonTonPower, nftIndex)
                    return key in store.nfts;
                },
                addNft: (walletAddressStr, newNft) => {
                    const store = get().store(walletAddressStr);
                    const key: string = createNftIndex(newNft.collection_type, newNft.wonton_power, newNft.nft_index)
                    const existNft = store.nfts[key];
                    const now = new Date().getTime();
                    if (existNft &&
                        existNft.state.type === 'NFT_BURN_REQUEST' &&
                        (now - +existNft.state.updated_at) < 1000 * 30) {
                        return;
                    }

                    set({
                        storesRegistry: {
                            ...get().storesRegistry,
                            [walletAddressStr]: {
                                nfts: { ...store.nfts, [key]: newNft },
                                transactions: store.transactions,
                                newNft: checkNewNft(newNft)
                            },
                        },
                    });
                },
                addNfts: (walletAddressStr, newNfts) => {
                    const store = get().store(walletAddressStr);
                    const newNftsMap: NftsHistory = {}
                    newNfts.forEach( (nft) => {
                        const key: string = createNftIndex(nft.collection_type, nft.wonton_power, nft.nft_index);
                        newNftsMap[key] = nft;
                    });

                    set({
                        storesRegistry: {
                            ...get().storesRegistry,
                            [walletAddressStr]: {
                                nfts: { ...store.nfts, ...newNftsMap },
                                transactions: store.transactions,
                                newNft: store.newNft
                            },
                        },
                    });
                },
                deleteNft: (walletAddressStr, nftKey) => {
                    const store = get().store(walletAddressStr);
                    const newNfts = { ...store.nfts };
                    delete newNfts[nftKey];
                    set({
                        storesRegistry: {
                            ...get().storesRegistry,
                            [walletAddressStr]: {
                                nfts: newNfts,
                                transactions: store.transactions,
                                newNft: store.newNft
                            },
                        },
                    });
                },
                markTransactionAsProcessed: (walletAddressStr, txHash) => {
                    const store = get().store(walletAddressStr);
                    const updatedTransaction = store.transactions[txHash];
                    if (updatedTransaction) {
                        set({
                            storesRegistry: {
                                ... get().storesRegistry,
                                [walletAddressStr]: {
                                    nfts: store.nfts,
                                    transactions: { ... store.transactions, [txHash]: { ...updatedTransaction, state: PROCESSED } },
                                },
                            }
                        })
                    }
                },
                markNftAsNotMyNft: (walletAddressStr, nftKey, newOwner) => {
                    const store = get().store(walletAddressStr);
                    const updatedNft = store.nfts[nftKey];
                    if (updatedNft) {
                        set({
                            storesRegistry: {
                                ... get().storesRegistry,
                                [walletAddressStr]: {
                                    nfts: { 
                                        ... store.nfts,
                                        [nftKey]: { 
                                            ...updatedNft,
                                            state: {
                                                type: 'NON_MY_NFT',
                                                updated_at: new Date().getTime().toString()
                                            },
                                            owner_address: newOwner?.toString({testOnly})
                                        }
                                    },
                                    transactions: store.transactions
                                },
                            }
                        })
                    }
                },                
                markNftForBurn: (walletAddressStr, nft) => {
                    const store = get().store(walletAddressStr);
                    const key: string = createNftIndex(nft.collection_type, nft.wonton_power, nft.nft_index)
                    const updatedNft = store.nfts[key];
                    if (updatedNft) {
                        set({
                            storesRegistry: {
                                ... get().storesRegistry,
                                [walletAddressStr]: {
                                    nfts: { 
                                        ... store.nfts,
                                        [key]: { 
                                            ...updatedNft,
                                            state: {
                                                type: 'NFT_BURN_REQUEST',
                                                updated_at: new Date().getTime().toString()
                                            }
                                        }
                                    },
                                    transactions: store.transactions
                                },
                            }
                        })
                    }
                },
                markNftForBet: (walletAddressStr, nft) => {
                    const store = get().store(walletAddressStr);
                    const key: string = createNftIndex(nft.collection_type, nft.wonton_power, nft.nft_index)
                    const updatedNft = store.nfts[key];
                    if (updatedNft) {
                        set({
                            storesRegistry: {
                                ... get().storesRegistry,
                                [walletAddressStr]: {
                                    nfts: { 
                                        ... store.nfts,
                                        [key]: { 
                                            ...updatedNft,
                                            state: {
                                                type: 'NFT_BET_REQUEST',
                                                updated_at: new Date().getTime().toString()
                                            }
                                        }
                                    },
                                    transactions: store.transactions
                                },
                            }
                        })
                    }
                },
                anyNotProcessedTransactions: (walletAddressStr) => {
                    return Object.values(get().store(walletAddressStr).transactions).some((nft)=> nft.state === FOUND);
                },
                filteredNfts: (walletAddressStr, cType, wontonPower) => {
                    const store = get().store(walletAddressStr);
                    const response: NftsHistory = {};
                    for (const [key, nft] of Object.entries(store.nfts)) {
                        if (nft.collection_type === cType && 
                            (nft.state.type === 'NFT' || 
                            nft.state.type === 'NFT_BURN_REQUEST') && 
                            nft.wonton_power == wontonPower) {
                            response[key] = nft;
                        }
                    }
                    return response;
                },
                poll: async (walletAddress: Address): Promise<void> => {
                    const walletAddressStr = walletAddress.toString({testOnly});
                    console.log(`Poling Universes...`)
                    await digForNewNfts(walletAddress, walletAddressStr, get);
                },
                pollNft: async (walletAddress: Address, universes: BEUniverses): Promise<void> => {
                    console.log(`Poling Universes...`)
                    await requestNfts(walletAddress, universes, get);
                },
                updateNftOwner: async (walletAddress: Address): Promise<void> => {
                    const walletAddressStr = walletAddress.toString({testOnly});
                    for (const [nftKey, nft] of Object.entries(get().store(walletAddressStr).nfts)) {
                        // console.log(printJson(nft.nft_address));
                        const ownershipState = await checkNftOwner(Address.parse(nft.nft_address), walletAddress);
                        if (!ownershipState.ownershipApproved) {
                            if (!ownershipState.owner) {
                                console.log(`Remove deleted nft: ${nftKey}`);
                                get().deleteNft(walletAddressStr, nftKey);
                            } else {
                                console.log(`Unlink transferred nft: ${nftKey}`);
                                get().markNftAsNotMyNft(walletAddressStr, nftKey, ownershipState.owner);
                            }
                        }
                    }
                },
                clearStorage: () => { set({ storesRegistry: { } }) },
                storageIsEmpty: () => !(Object.keys(get().storesRegistry).length > 0)
            }),
            {
                name: `nfts-storage`,
            },
        ),
    ),
);

export const createNftIndex = (cType: CollectionType, wontonPower: number, nftIndex: number) => `${cType}:${wontonPower}:${nftIndex}`;

export const createNftIndexFrom = (nft?: Nft) => `${nft?.collection_type}:${nft?.wonton_power}:${nft?.nft_index}`;
export const equalNfts = (nft1?: Nft, nft2?: Nft) => createNftIndexFrom(nft1) === createNftIndexFrom(nft2);

export const checkNewNft = (newNft: Nft): Nft | undefined => {
    const nftDate = +newNft.created_at;
    const now = new Date().getTime();
    const diff = now - nftDate;

    return diff < new_nft_time_span ? newNft : undefined;
}