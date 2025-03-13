import { NftItem } from "./NftItem";
import { Nft } from "./lib/Types";
import { Col, Row } from "antd";

export function NftItems({ walletAddressStr, nfts }: { walletAddressStr: string, nfts: Nft[] }) {
    const chunkSize = 4;
    const result = [];
    for (let i = 0; i < nfts.length; i += chunkSize) {
        const chunk = nfts.slice(i, i + chunkSize);
        const cols = [];
        for (const nft of chunk) {
            cols.push(<NftItem nft={nft} key={nft.nft_index} walletAddressStr={walletAddressStr} />);
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