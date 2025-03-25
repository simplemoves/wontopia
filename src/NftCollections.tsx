import { useCallback, useMemo, useState } from "react";
import { Col, Divider, Row, Spin, Tabs, TabsProps } from "antd";
import { NftCollection } from "./NftCollection";
import { CCaption } from "./Typography";
import { ReloadOutlined } from "@ant-design/icons";
import { useNftWatcher } from "./hooks/useNftWatcher.ts";
import { BEUniverses, CollectionType, collectionTypeCaptions, Nft } from "./lib/Types";

export function NftCollections({ walletAddressStr, universes }: { walletAddressStr: string, universes: BEUniverses }) {
  const { handleUpdate, isRunning, nfts } = useNftWatcher(walletAddressStr, universes);
  const [ activeKey, setActiveKey ] = useState("1");
  const onTabChange = useCallback((activeKey: string) => { setActiveKey(activeKey) }, [setActiveKey]);
  const getCaption = useCallback((forKey: string, cType: CollectionType) => {
    const captionText = collectionTypeCaptions[cType];
    const className = activeKey === forKey ? "collection-caption" : "collection-caption-inactive";
    return <span className={className}>{captionText}</span>
  }, [ activeKey ])

  const filteredWinNfts = useMemo(() => {
      return Object.values(filterNfts(nfts, 'WIN'));
    }, [ nfts, walletAddressStr, universes ]);

    const filteredLooseNfts = useMemo(() => {
      return Object.values(filterNfts(nfts, 'LOOSE'));
    }, [ nfts, walletAddressStr, universes ]);

    const items: TabsProps['items'] = [
      {
        key: '1',
        label: getCaption('1', 'WIN'),
        children: (
            <Row style={{ width: '100%' }} wrap={false} justify="center">
              <Col style={{ minWidth: '100%' }}><NftCollection walletAddressStr={walletAddressStr} nfts={filteredWinNfts} /></Col>
            </Row>
        ),
      },
      {
        key: '2',
        label: getCaption('2', 'LOOSE'),
        children: (
            <Row style={{ width: '100%' }} wrap={false} justify="center">
              <Col style={{ minWidth: '100%' }}><NftCollection  walletAddressStr={walletAddressStr} nfts={filteredLooseNfts} /></Col>
            </Row>
        ),
      },
    ];

    return (
        <>
            <Divider variant="dotted" style={{ borderColor: 'gray' }}>
                <CCaption>Your NFT Collections&nbsp;&nbsp;{isRunning(universes.wonTonPower) ?
                    <Spin indicator={<ReloadOutlined spin style={{ color: 'gray', fontSize: '5vw' }} />} style={{ width: '5vw', height: '5vw' }} /> :
                    <ReloadOutlined style={{ color: 'gray', width: '5vw', height: '5vw' }} onClick={handleUpdate} />}
                </CCaption>
            </Divider>
            { filteredWinNfts.length > 0 && activeKey === '1' ? (
                <div className="sub-status">You can play this NFT(s) in the next universe #{universes.wonTonPower + 1}</div>
            ): null }
            <Tabs defaultActiveKey="1" items={items} centered onChange={onTabChange} />
            {/*<Row style={{ width: '100%' }} wrap={false} justify="center">*/}
            {/*    <Col span={12}><NftCollection walletAddressStr={walletAddressStr} cType={'WIN'} nfts={filteredWinNfts} wontonPower={universes.wonTonPower + 1} /></Col>*/}
            {/*    <Col span={12}><NftCollection  walletAddressStr={walletAddressStr} cType={'LOOSE'} nfts={filteredLooseNfts} wontonPower={universes.wonTonPower + 1} /></Col>*/}
            {/*</Row>*/}
        </>
    );
}

const filterNfts = (nfts: Nft[] | undefined, cType: CollectionType): Nft[] => {
  const response: Nft[] = [];
  if (!nfts) {
    return response;
  }

  for (const nft of nfts) {
    if (nft.collection_type === cType) {
      response.push(nft);
    }
  }

  return response;
}