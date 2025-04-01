import { useCallback, useState } from "react";
import { Col, Divider, Row, Spin, Tabs, TabsProps } from "antd";
import { NftCollection } from "./NftCollection";
import { CCaption } from "./Typography";
import { ReloadOutlined } from "@ant-design/icons";
import { BEUniverses, CollectionType, collectionTypeCaptions } from "./lib/Types";
import { useWontopiaStore } from "./store/WontopiaStore.ts";

export function NftCollections({ walletAddressStr, universes }: { walletAddressStr: string, universes: BEUniverses }) {
    const handleUpdate = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.handleUpdate);
    const isNftsRequestInProgress = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.isNftsRequestInProgress);
    const winNfts = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.winNfts);
    const looseNfts = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.looseNfts);

    const [ activeKey, setActiveKey ] = useState("1");
    const onTabChange = useCallback((activeKey: string) => { setActiveKey(activeKey) }, [ setActiveKey ]);
    const getCaption = useCallback((forKey: string, cType: CollectionType) => {
        const captionText = collectionTypeCaptions[cType];
        const className = activeKey === forKey ? "collection-caption" : "collection-caption-inactive";
        return <span className={className}>{captionText}</span>
    }, [ activeKey ])

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: getCaption('1', 'WIN'),
            children: (
                <Row style={{ width: '100%' }} wrap={false} justify="center">
                    <Col style={{ minWidth: '100%' }}><NftCollection walletAddressStr={walletAddressStr} nfts={Object.values(winNfts)} isNftsRequestInProgress={isNftsRequestInProgress} cType='WIN'/></Col>
                </Row>
            ),
        },
        {
            key: '2',
            label: getCaption('2', 'LOOSE'),
            children: (
                <Row style={{ width: '100%' }} wrap={false} justify="center">
                    <Col style={{ minWidth: '100%' }}><NftCollection walletAddressStr={walletAddressStr} nfts={Object.values(looseNfts)} isNftsRequestInProgress={isNftsRequestInProgress} cType='LOOSE'/></Col>
                </Row>
            ),
        },
    ];

    return (
        <>
            <Divider variant="dotted" style={{ borderColor: 'gray' }}>
                <CCaption>Your NFT Collections&nbsp;&nbsp;{isNftsRequestInProgress ?
                                                           <Spin indicator={<ReloadOutlined spin style={{ color: 'gray', fontSize: '5vw' }}/>} style={{ width: '5vw', height: '5vw' }}/> :
                                                           <ReloadOutlined style={{ color: 'gray', width: '5vw', height: '5vw' }} onClick={handleUpdate}/>}
                </CCaption>
            </Divider>
            {Object.keys(winNfts).length > 0 && activeKey === '1' ? (
                <div className="sub-status">You can play this NFT(s) in the next universe #{universes.wonTonPower + 1}</div>
            ) : null}
            <Tabs defaultActiveKey="1" items={items} centered onChange={onTabChange}/>
            {/*<Row style={{ width: '100%' }} wrap={false} justify="center">*/}
            {/*    <Col span={12}><NftCollection walletAddressStr={walletAddressStr} cType={'WIN'} nfts={filteredWinNfts} wontonPower={universes.wonTonPower + 1} /></Col>*/}
            {/*    <Col span={12}><NftCollection  walletAddressStr={walletAddressStr} cType={'LOOSE'} nfts={filteredLooseNfts} wontonPower={universes.wonTonPower + 1} /></Col>*/}
            {/*</Row>*/}
        </>
    );
}
