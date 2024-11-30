import { Address } from "@ton/core";
import { testOnly, useNftsStore } from "./store/NftsStore";
import { useMemo } from "react";
import { Col, Divider, Row, Spin } from "antd";
import { NftCollection } from "./NftCollection";
import { CCaption } from "./Typography";
import { useNftWatcher } from "./hooks/useNftWatcher";
import { ReloadOutlined } from "@ant-design/icons";

export function NftCollections({ walletAddress, wontonPower }: { walletAddress: Address, wontonPower: number }) {
    const nftStore = useNftsStore();
    const walletAddressStr = useMemo(() => walletAddress.toString({ testOnly }), [ walletAddress ])
    const filteredWinNfts = useMemo(() => {
        return Object.values(nftStore.filteredNfts(walletAddressStr, 'WIN', wontonPower + 1));
    }, [ nftStore, walletAddressStr, wontonPower ]);

    const filteredLooseNfts = useMemo(() => {
        return Object.values(nftStore.filteredNfts(walletAddressStr, 'LOOSE', wontonPower + 1));
    }, [ nftStore, walletAddressStr, wontonPower ]);

    const { handleUpdate, running } = useNftWatcher(walletAddress);

    return (
        <>
            <Divider variant="dotted" style={{ borderColor: 'silver' }}>
                <CCaption>Received NFTs {running ? <Spin indicator={<ReloadOutlined spin />} style={{ color: 'silver' }} size="large" /> : <ReloadOutlined style={{ color: 'silver' }} onClick={handleUpdate} />}</CCaption>
            </Divider>
            <Row style={{ width: '100%' }} wrap={false} justify="center">
                <Col span={12}><NftCollection walletAddressStr={walletAddressStr} cType={'WIN'} nfts={filteredWinNfts}/></Col>
                <Col span={12}><NftCollection  walletAddressStr={walletAddressStr} cType={'LOOSE'} nfts={filteredLooseNfts}/></Col>
            </Row>
        </>
    );
}