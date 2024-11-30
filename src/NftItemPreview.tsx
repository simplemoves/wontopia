import './App.css';
import { Card, Descriptions, Flex, Image, Space } from "antd";
import { Nft } from './lib/Types';
import { PlayButton } from './PlayButton';
import { BurnButton } from './BurnButton';
import { NftAttributes } from './NftAttributes';
import { NftCaption } from './Typography';
import { useMemo } from 'react';
import { mapNftToDescriptionProps } from './workers/WonTonNftTools';

export function NftItemPreview({ nft, sendBetNft, sendBurnNft, closePreview }: { nft: Nft, sendBetNft: () => Promise<void>, sendBurnNft: () => Promise<void>, closePreview: () => void }) {
    const items = useMemo(() => mapNftToDescriptionProps(nft), [nft]);

    return (
        <Card hoverable bordered={false} className={"nft-preview"}
            extra={ <NftCaption>{nft.nft_meta?.name}</NftCaption> }>
            <Space size={'small'}>
                { nft.collection_type === 'WIN' ? (<PlayButton sendBet={sendBetNft}/>) : null }
                <BurnButton sendBurn={sendBurnNft} closePreview={closePreview} />
            </Space>

            <Flex gap={'small'} vertical>
                <center>
                    <Image
                        src={nft.nft_meta?.image}
                        width={"15rem"}
                        preview={false}/>
                </center>
                <Descriptions
                    bordered
                    size='small'
                    title=<div className={'nft-description-title'}>NFT Info</div>
                    items={items}
                    contentStyle={{ color: 'silver' }}
                    labelStyle={{ color: 'white', fontFamily: 'BebasNeue, Arial, serif' }}/>            
                {nft.nft_meta?.attributes && (<NftAttributes attributes={nft.nft_meta.attributes}/>)}
            </Flex>
        </Card>
    );
}