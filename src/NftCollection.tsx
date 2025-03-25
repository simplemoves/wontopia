import { useMemo } from "react";
import { NftItems } from "./NftItems";
import { Nft } from "./lib/Types.ts";

export function NftCollection({ walletAddressStr, nfts }: { walletAddressStr: string, nfts: Nft[] }) {
    const sorted = useMemo(() => nfts.sort((nft1, nft2) => nft1.nft_index - nft2.nft_index), [nfts])

    return (
        <NftItems walletAddressStr={walletAddressStr} nfts={sorted} />
    )
}