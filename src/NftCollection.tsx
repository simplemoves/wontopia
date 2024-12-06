import { useMemo } from "react";
import { CollectionType, collectionTypeCaptions, Nft } from "./lib/Types";
import { NftItems } from "./NftItems";
import { Col, Row } from "antd";
import { CCaption } from "./Typography";

export function NftCollection({ walletAddressStr, cType, nfts }: { walletAddressStr: string, cType: CollectionType, nfts: Nft[] }) {
    const caption = useMemo(() => collectionTypeCaptions[cType], [cType]) 
    const sorted = useMemo(() => nfts.sort((nft1, nft2) => nft1.nft_index - nft2.nft_index), [nfts])

    return (
        <>
            <Row justify="center" wrap={false}>
                <Col><CCaption>{caption}</CCaption></Col>
            </Row>

            <NftItems walletAddressStr={walletAddressStr} nfts={sorted}/>
        </>     
    )
}