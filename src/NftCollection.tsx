import { useMemo } from "react";
import { CollectionType, Nft } from "./lib/Types";
import { NftItems } from "./NftItems";

export function NftCollection({ walletAddressStr, cType, nfts, wontonPower }: { walletAddressStr: string, cType: CollectionType, nfts: Nft[], wontonPower: number | undefined }) {
    const sorted = useMemo(() => nfts.sort((nft1, nft2) => nft1.nft_index - nft2.nft_index), [nfts])

    return (
        <NftItems walletAddressStr={walletAddressStr} nfts={sorted} />
    )
}