import './NftCollection.css'
import { useMemo } from "react";
import { NftItems } from "./NftItems";
import { CollectionType, Nft } from "./lib/Types.ts";

export function NftCollection({ walletAddressStr, nfts, isNftsRequestInProgress, cType }: { walletAddressStr: string, nfts: Nft[], isNftsRequestInProgress: boolean, cType: CollectionType }) {
    const sorted = useMemo(() => nfts.sort((nft1, nft2) => nft1.nft_index - nft2.nft_index), [nfts])

    if (sorted.length === 0) {
        if (isNftsRequestInProgress) {
            return (
                <div className="empty-nft-collection">Checking NFT's list...</div>
            );
        } else {
            const phrase = cType === 'WIN' ? ". Let's win some!" : "";
            return (
                <div className="empty-nft-collection">No NFT's here yet{phrase}</div>
            );
        }
    }

    return (
        <NftItems walletAddressStr={walletAddressStr} nfts={sorted} />
    )
}