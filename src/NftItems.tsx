import { useNftsStore } from "./store/NftsStore";
import { useMemo } from "react";
import { NftItem } from "./NftItem";
import { Nft } from "./lib/Types";
import { Col, Row } from "antd";

export function NftItems({ walletAddressStr, nfts }: { walletAddressStr: string, nfts: Nft[] }) {
    const nftStore = useNftsStore();
    // const newNft = useMemo(() => nftStore.newNft(walletAddressStr, cType), [nftStore, walletAddressStr, cType])
    // isNew={equalNfts(nftl, newNft)}
    const markNft = useMemo(() => {
        return {
            forBurn: (nft: Nft) => nftStore.markNftForBurn(walletAddressStr, nft),
            forBet: (nft: Nft) => nftStore.markNftForBet(walletAddressStr, nft)
    }}, [nftStore, walletAddressStr]);

    const result = [];
    for (let i = 0; i < nfts.length; i += 2) {
        const chunk = nfts.slice(i, i + 2);
        
        const cols = [];
        for (const nft of chunk) {
            cols.push(<NftItem nft={nft} key={nft.nft_index} isNew={false} markNft={markNft}/>);
        }

        result.push(
            <Row justify="center" wrap={true} key={i}>
                <Col>
                    {cols}
                </Col>
            </Row>            
        )
    }

    return result;
}