import { Address } from "@ton/core";
import { useMemo } from "react";
import { Col, Divider, Row, Spin } from "antd";
import { NftCollection } from "./NftCollection";
import { CCaption } from "./Typography";
import { ReloadOutlined } from "@ant-design/icons";
import { useNftWatcher } from "./hooks/useNftWatcher.ts";
import { BEUniverses, CollectionType, NftsHistory } from "./lib/Types";
import { testOnly } from "./lib/Constants.ts";

export function NftCollections({ walletAddress, universes }: { walletAddress: Address, universes: BEUniverses }) {
    const walletAddressStr = useMemo(() => walletAddress.toString({ testOnly }), [ walletAddress ])
    // const { handleUpdate, running } = useNftWatcher(walletAddress);
    const { handleUpdate, running, nfts } = useNftWatcher(walletAddress, universes);

    const filteredWinNfts = useMemo(() => {
      return Object.values(filterNfts(nfts, 'WIN'));
    }, [ nfts ]);

    const filteredLooseNfts = useMemo(() => {
      return Object.values(filterNfts(nfts, 'LOOSE'));
    }, [ nfts ]);

    return (
        <>
            <Divider variant="dotted" style={{ borderColor: 'gray' }}>
                <CCaption>Received NFTs&nbsp;&nbsp;{running ?
                    <Spin indicator={<ReloadOutlined spin />} style={{ color: 'gray' }} size="large" /> :
                    <ReloadOutlined style={{ color: 'gray' }} onClick={handleUpdate} />}
                </CCaption>
            </Divider>
            <Row style={{ width: '100%' }} wrap={false} justify="center">
                <Col span={12}><NftCollection walletAddressStr={walletAddressStr} cType={'WIN'} nfts={filteredWinNfts} wontonPower={universes.wonTonPower + 1} /></Col>
                <Col span={12}><NftCollection  walletAddressStr={walletAddressStr} cType={'LOOSE'} nfts={filteredLooseNfts} wontonPower={universes.wonTonPower + 1} /></Col>
            </Row>
        </>
    );
}

const filterNfts = (nfts: NftsHistory | undefined, cType: CollectionType): NftsHistory => {
  const response: NftsHistory = {};
  if (!nfts) {
    return response;
  }

  for (const [key, nft] of Object.entries(nfts)) {
    if (nft.collection_type === cType) {
      response[key] = nft;
    }
  }

  return response;
}