import { Address } from "@ton/core";
import { testOnly, useNftsStore } from "./store/NftsStore";
import { useMemo } from "react";
import { Col, Divider, Row, Spin } from "antd";
import { NftCollection } from "./NftCollection";
import { CCaption } from "./Typography";
import { ReloadOutlined } from "@ant-design/icons";
import { useNftWatcher2 } from "./hooks/useNftWatcher2";
import { BEUniverses } from "./lib/Types";

export function NftCollections({ walletAddress, universes }: { walletAddress: Address, universes: BEUniverses }) {
    const nftStore = useNftsStore();
    const walletAddressStr = useMemo(() => walletAddress.toString({ testOnly }), [ walletAddress ])
    const filteredWinNfts = useMemo(() => {
        return Object.values(nftStore.filteredNfts(walletAddressStr, 'WIN', universes.wonTonPower + 1));
    }, [ nftStore, walletAddressStr, universes.wonTonPower ]);

    const filteredLooseNfts = useMemo(() => {
        return Object.values(nftStore.filteredNfts(walletAddressStr, 'LOOSE', universes.wonTonPower + 1));
    }, [ nftStore, walletAddressStr, universes.wonTonPower ]);

    // const { handleUpdate, running } = useNftWatcher(walletAddress);
    const { handleUpdate, running } = useNftWatcher2(walletAddress, universes);

    return (
        <>
            <Divider variant="dotted" style={{ borderColor: 'gray' }}>
                <CCaption>Received NFTs&nbsp;&nbsp;{running ?
                    <Spin indicator={<ReloadOutlined spin />} style={{ color: 'gray' }} size="large" /> :
                    <ReloadOutlined style={{ color: 'gray' }} onClick={handleUpdate} />}
                </CCaption>
            </Divider>
            <Row style={{ width: '100%' }} wrap={false} justify="center">
                <Col span={12}><NftCollection walletAddressStr={walletAddressStr} cType={'WIN'} nfts={filteredWinNfts}/></Col>
                <Col span={12}><NftCollection  walletAddressStr={walletAddressStr} cType={'LOOSE'} nfts={filteredLooseNfts}/></Col>
            </Row>
        </>
    );
}