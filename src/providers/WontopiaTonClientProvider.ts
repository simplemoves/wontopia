import { getErrorMessage } from "../lib/ErrorHandler";
import { RateLimiter, tryNTimes } from "../lib/PromisUtils";
import { requesAddressInformation, requestNftItems } from "../lib/ToncenterApi";
import { CollectionType, mapResponseToNft, Nft, NftMeta } from "../lib/Types";
import axios from "axios";

const rateLimiterObj = new RateLimiter(2000);

export const wonTonHttpClient = () => {
    return {
        getNftItems: async (cType: CollectionType, ownerStr: string, collectionStr: string, wontonPower: number): Promise<Nft[]> => {
            await rateLimiterObj.limit();
            return await readNfts(cType, ownerStr, collectionStr, wontonPower);
        },
        isNftActive: async (nftAddrStr: string): Promise<boolean> => {
            await rateLimiterObj.limit();
            return await isNftActive(nftAddrStr);
        }
    }
};

const readNfts = async (cType: CollectionType, 
        ownerStr: string,
        collectionStr: string,
        wontonPower: number) => {
    const innerRead = async (limit: number = 30, offset: number = 0, result: Nft[] = []): Promise<Nft[]> => {
        const newNfts = await tryNTimes(async () => requestNftItems(ownerStr, collectionStr, limit, offset), 5, 500);
        
        console.log(`Received ${newNfts?.length} nfts`);
        if (!newNfts) { return result; }

        const hitBottom = newNfts.length == 0 || newNfts.length < limit;

        for (const newNft of newNfts) {
            const nftMeta = await fetchMeta(newNft.content.uri);
            if (nftMeta) {
                const nft: Nft = mapResponseToNft(newNft, cType, wontonPower, nftMeta);
                result.push(nft);
            }
        }

        if (hitBottom) { return result; }
        
        return await innerRead(limit, limit + offset, result);
    }

    return await innerRead();
}

const fetchMeta = async (uri: string): Promise<NftMeta | undefined> => {
    try {
        const response = await axios.get<NftMeta>(uri);
        return response.data;
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`Error fetching meta: ${uri}, error: ${msg}`);
        return undefined;
    }
}

const isNftActive = async (nftAddrStr: string): Promise<boolean> => {
    const nftStatus = await tryNTimes(async () => requesAddressInformation(nftAddrStr), 5, 500);
    return nftStatus?.status === 'active';
}