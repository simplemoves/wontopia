import { equalNfts, useNftsStore } from "./store/NftsStore";
import { useMemo } from "react";
import { NftItem } from "./NftItem";
import { CollectionType, Nft } from "./lib/Types";
import { Col, Row } from "antd";

export function NftItems({ walletAddressStr, cType, nfts }: { walletAddressStr: string, cType: CollectionType, nfts: Nft[] }) {
    const nftStore = useNftsStore();
    const newNft = useMemo(() => nftStore.newNft(walletAddressStr, cType), [nftStore, walletAddressStr, cType])

    const result = [];
    for (let i = 0; i < nfts.length; i += 2) {
        const chunk = nfts.slice(i, i + 2);
        const nftl = chunk[0];
        const nftr = chunk[1];
        result.push(
            <Row justify="center" wrap={true}>
                <Col>
                    <NftItem nft={nftl} key={nftl.nft_index} isNew={equalNfts(nftl, newNft)}/>
                    {nftr ? <NftItem nft={nftr} key={nftr.nft_index} isNew={equalNfts(nftr, newNft)}/> : null }
                </Col>
            </Row>            
        )
    }

    return result;
}