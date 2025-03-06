import { Transaction } from "@ton/ton";
import { Address } from '@ton/core'
import { BEUniverses, CollectionInfo, collectionTypeCaptions, FeGetNftData, FOUND, GetNftData, isNft, isNftData, NFT, Nft, NftMeta, NftMetaAttributes, NftStore, NonNft, NOT_NFT } from "../lib/Types";
import { isTonAddress, possiblyNftTransfer } from "../lib/TonUtils";
import axios from "axios";
import { globalUniversesHolder } from "../store/GlobalUniversesHolder.ts";
import { createNftIndex } from "../store/WontopiaStore.ts";
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";
import { DescriptionsProps } from "antd";
import { wonTonHttpClient } from "../providers/WontopiaTonClientProvider.ts";
import { testOnly } from "../lib/Constants.ts";

const client = wonTonHttpClient();

export const digForNewNfts = async (walletAddress: Address,
    walletAddressStr: string,
    get: () => NftStore) => {
    try {
        await readTransactions(walletAddress, walletAddressStr, get);
    } catch (ex) {
        const error = getErrorMessage(ex)
        console.error(error)
    }
}

export const requestNfts = async (walletAddress: Address,
    universes: BEUniverses,
    get: () => NftStore) => {
    try {
        await readNfts(walletAddress, universes, get);
    } catch (ex) {
        const error = getErrorMessage(ex)
        console.error(error)
    }
}

const readNfts = async (walletAddress: Address,
    universes: BEUniverses,
    get: () => NftStore) => {

    const ownerStr = walletAddress.toString({testOnly});
    const wontonPower = universes.wonTonPower + 1;
    
    const winNfts = await client.getNftItems('WIN', ownerStr, universes.winUniverse.collection.toRawString(), wontonPower);
    await processNfts(ownerStr, winNfts, get);
    const looseNfts = await client.getNftItems('LOOSE', ownerStr, universes.looseUniverse.collection.toRawString(), wontonPower);
    await processNfts(ownerStr, looseNfts, get);
}

const processNfts = async (ownerStr: string, nfts: Nft[], get: () => NftStore) => {
    for (const nft of nfts) {
        const isActive = await client.isNftActive(nft.nft_address);
        if (!isActive) {
            const key: string = createNftIndex(nft.collection_type, nft.wonton_power, nft.nft_index);
            get().deleteNft(ownerStr, key);
        } else {
            get().addNft(ownerStr, nft);
        }
    }

}

const readTransactions = async (walletAddress: Address,
    walletAddressStr: string,
    get: () => NftStore) => {
    const haveNotProcessed = get().anyNotProcessedTransactions(walletAddressStr);

    const innerRead = async (hash?: string, lt?: string, limit: number = 30) => {
        const newTransactions = await tryRequestTransactionList(walletAddress, hash, lt, limit);
        console.log(`Received ${newTransactions?.length} transactions`);
        if (!newTransactions) { return; }

        const hitBottom = newTransactions.length == 0 || newTransactions.length < limit;
        const processResult = await processTransactions(walletAddress, walletAddressStr, newTransactions, haveNotProcessed, get);
        if ((hitBottom || processResult.hitBottom) && !haveNotProcessed) { return; }
        return await innerRead(processResult.lastHash, processResult.lastLt);
    }

    await innerRead();
}

const processTransactions = async (walletAddress: Address,
    walletAddressStr: string,
    receivedTransactions: Transaction[],
    haveNotProcessed: boolean,
    get: () => NftStore) => {
    let hitBottom: boolean = false;
    let lastHash: string | undefined;
    let lastLt: string | undefined;

    for (const tx of receivedTransactions) {
        const txHash = tx.hash().toString("base64");
        lastHash = txHash;
        lastLt = tx.lt.toString();

        if (!get().isTransactionProcessed(walletAddressStr, txHash)) {
            get().addTransaction(walletAddressStr, { hash: txHash, lt: tx.lt, now: tx.now, state: FOUND });
            // console.log(`Found unprocessed transaction: ${txHash}, tx.now: ${new Date(tx.now * 1000).toISOString()}`);
            const success = await handleWalletInTxs(walletAddress, walletAddressStr, tx, get);
            if (success) {
                get().markTransactionAsProcessed(walletAddressStr, txHash);
            }
        } else if (!haveNotProcessed) {
            hitBottom = true;
            break;
        }
    }

    return { lastHash, lastLt, hitBottom };
}

const requestTransactionList = async (walletAddress: Address, hash?: string, lt?: string, limit: number = 20) => {
    const tonClient = await wonTonClientProvider.wonTonClient();
    return await tonClient.getTransactions(walletAddress, { limit: limit, archival: true, inclusive: false, lt, hash });
}

const handleWalletInTxs = async (walletAddress: Address,
    walletAddressStr: string,
    tx: Transaction,
    get: () => NftStore): Promise<boolean> => {
    const inMsg = tx.inMessage;
    const nftAddress = inMsg?.info.src;
    if (isTonAddress(nftAddress) && possiblyNftTransfer(inMsg)) {
        // console.log(`Possibly NFT found: ${nftAddress}`);
        const nftData = await tryGetNftData(nftAddress);
        if (!nftData) {
            console.log(`No nft data loaded`);
            return false;
        }

        if(!isNftData(nftData.getNftData)) {
            return true;
        }

        const nft = await handleTx(nftAddress, walletAddress, walletAddressStr, tx, nftData.getNftData, get);
        if (!nft) {
            console.log(`No nft meta data loaded`);
            return false;
        }

        if (isNft(nft)) {
            get().addNft(walletAddressStr, nft);
        }
    }

    return true;
}

const handleTx = async (
    nftAddress: Address,
    walletAddress: Address,
    walletAddressStr: string,
    tx: Transaction,
    nftData: GetNftData,
    get: () => NftStore): Promise<Nft | NonNft | undefined> => {

    // console.log(`wallet address: ${walletAddressStr}`);
    // console.log(`nftData.owner: ${nftData.owner.toString({ testOnly })}`);
    // console.log(`nftData.collection: ${nftData.collection.toString({ testOnly })}`);
    if (walletAddress.equals(nftData.owner)) {
        const collectionInfo = globalUniversesHolder.collections[nftData.collection.toRawString()];
        if (collectionInfo) {
            if (!get().doesNftExists(walletAddressStr, collectionInfo, nftData.index)) {
                console.log(`wontonPower: ${collectionInfo.wonTonPower} | Found new ${collectionInfo.cType} NFT Transaction for #: ${nftData.index}`);
                const nft_meta = await fetchMeta(collectionInfo, nftData.index);
                return nft_meta ? {
                    state: {
                        type: NFT,
                        updated_at: new Date().getTime().toString()
                    },
                    nft_address: nftAddress.toRawString(),
                    owner_address: nftData.owner.toRawString(),
                    nft_index: nftData.index,
                    collection_type: collectionInfo.cType,
                    wonton_power: collectionInfo.wonTonPower,
                    nft_meta,
                    created_at: (tx.now * 1000).toString(),
                }
                : NOT_NFT;
            }
        }
    }

    return NOT_NFT;
}

const fetchMeta = async (cInfo: CollectionInfo, nftIndex: number): Promise<NftMeta | undefined> => {
    try {
        const response = await axios.get(`https://simplemoves.github.io/wontopia-nft/${cInfo.cType}/${cInfo.wonTonPower}/meta-${nftIndex}.json`);
        return response.data;
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`Error fetching meta. cType: ${cInfo.cType}, wonTonPower: ${cInfo.wonTonPower}, index: ${nftIndex}, error: ${msg}`);
        return undefined;
    }
}

export const checkNftOwner = async (nftAddress: Address, walletAddress: Address) => {
    // console.log(`ownerAddress: ${printJson(this.walletAddress)}`);
    // console.log(`Nft address: ${printJson(nftAddress)}`);
    // console.log(`Nft address is address: ${Address.isAddress(nftAddress)}`);
    // console.log(printJson(nftAddress));
    const nft = await getNftData(nftAddress);
    const nftDefined: boolean = !!nft;
    // console.log(`Nft's owner address: ${nftAddress?.toString({ testOnly })}`);
    // console.log(`Wallet address: ${this.walletAddress?.toString({ testOnly })}`);
    // console.log(`this.walletAddress.equals(nft.owner): ${this.walletAddress.equals(nft.owner)}`);
    const ownershipApproved = !nftDefined || (isNftData(nft?.getNftData) && walletAddress.equals(nft?.getNftData.owner));
    return {
        ownershipApproved,
        owner: ownershipApproved ? walletAddress : nft?.getNftData?.owner,
    };
}

const getNftData = async (nftAddress: Address): Promise<FeGetNftData | undefined> => {
    console.log(`Getting NFT data for address: ${nftAddress.toString({testOnly})}`);
    const tonClient = await wonTonClientProvider.wonTonClient();

    try {
        const { stack, exit_code } = await tonClient.runMethodWithError(nftAddress, "get_nft_data");
        console.log(`Got NFT data for address: ${nftAddress.toString({ testOnly })}, exit_code: ${exit_code}`);
        if (exit_code != 0) {
            console.log(`Get NFT data with address: ${nftAddress.toString({ testOnly })} failed with error: ${exit_code}`);
            console.log(`NFT with address: ${nftAddress.toString({ testOnly })} probably removed`);
            return {};
        }
        const inited = stack.readBoolean();
        console.log(`Inited: ${inited}`);
        const index = stack.readNumber();
        console.log(`Index: ${index}`);
        const collection = stack.readAddress();
        console.log(`Collection: ${collection.toString({testOnly})}`);
        const owner = stack.readAddress();

        return {
            getNftData: {
                inited,
                index,
                collection,
                owner,
            }
        };
    } catch (error) {
        console.error(getErrorMessage(error))
    }
}

const tryRequestTransactionList = async (walletAddress: Address, hash?: string, lt?: string, limit: number = 20) =>
    tryNTimes(async () => requestTransactionList(walletAddress, hash, lt, limit), 5, 500);

const tryGetNftData = async (nftAddress: Address) =>
    tryNTimes(() => getNftData(nftAddress), 5, 500);

export const mapNftToDescriptionProps = (nft: Nft): DescriptionsProps['items'] => {
    return [
        {
            label: 'Nft Name',
            children: nft.nft_meta?.name,
        },
        {
            label: 'Collection Type',
            children: collectionTypeCaptions[nft.collection_type],
        },
        {
            label: 'Nft Index',
            children: nft.nft_meta?.attributes.find((attr) => attr.trait_type === 'nft_index')?.value,
        },
        // {
        //     label: 'Created At',
        //     children: new Date(+nft.created_at).toISOString(),
        // },
        // {
        //     label: 'Description',
        //     children: nft.nft_meta?.description,
        // },
    ];
}

export const mapAttrToDescriptionProps = (attributes: NftMetaAttributes[]): DescriptionsProps['items'] => {
    return attributes
        .filter((attribute) => attribute.trait_type === 'nft_index')
        .map((attribute) => {
            return {
                label: attribute.trait_type,
                children: attribute.value,
            }        
        });
}