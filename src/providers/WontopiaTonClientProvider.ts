import { getErrorMessage } from "../lib/ErrorHandler";
import { RateLimiter, tryNTimes } from "../lib/PromisUtils";
import { CollectionType, mapResponseToNft, Nft, NftItemResponse, NftItemsResponse, NftMeta } from "../lib/Types";
import axios from "axios";

const rateLimiterObj = new RateLimiter(2000);

export const wonTonHttpClient = async () => {
    return {
        getNftItems: async (cType: CollectionType, ownerStr: string, collectionStr: string, wontonPower: number): Promise<Nft[]> => {
            await rateLimiterObj.limit();
            return await readNfts(cType, ownerStr, collectionStr, wontonPower);
        }
    }
};

const readNfts = async (cType: CollectionType, 
        ownerStr: string,
        collectionStr: string,
        wontonPower: number) => {
    const innerRead = async (limit: number = 30, offset: number = 0, result: Nft[] = []): Promise<Nft[]> => {
        const newNfts = await tryNTimes(async () => requestNftsList(ownerStr, collectionStr, limit, offset), 5, 500);
        
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

const requestNftsList = async (owner: string, collection: string, limit: number = 20, offset: number = 0): Promise<NftItemResponse[] | undefined> => {
    const response = await axios.get<NftItemsResponse>("https://toncenter.com/api/v3/nft/items", {
        params: {
            owner_address: owner,
            collection_address: collection,
            limit: limit,
            offset: offset
        }
    });

    if (response.status != 200) {
        console.error("Error getting NFT Items");
        return;        
    }

    return response.data.nft_items;
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