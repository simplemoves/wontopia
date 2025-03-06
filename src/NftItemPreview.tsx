import './App.css';
import { Card, Descriptions, Flex, Image } from "antd";
import { Nft } from './lib/Types';
import { PlayButton } from './PlayButton';
import { BurnButton } from './BurnButton';
import { useCallback, useMemo } from 'react';
import { mapNftToDescriptionProps } from './workers/WonTonNftTools';
import { useNftItemContract } from './hooks/useNftItemContract';
import { Address } from '@ton/core';

export function NftItemPreview({ nft, markNft, setPreviewVisible, canPlay }: {
        nft: Nft,
        setPreviewVisible: (previeVisible: boolean) => void,
        markNft: {
            forBurn: (nft: Nft) => void,
            forBet: (nft: Nft) => void
        },
        canPlay: () => boolean,
    }) {
    const contract = useNftItemContract(Address.parse(nft.nft_address))    

    const sendBurnNft = useCallback(async () => {
        setPreviewVisible(false);
        const sent = await contract.sendBurn();
        if (sent) {            
            markNft.forBurn(nft);
        }
    }, [contract.sendBurn, markNft, nft])

    const sendBetNft = useCallback(async () => {
        setPreviewVisible(false);
        const sent = await contract.sendBetNft();
        if (sent) {            
            markNft.forBet(nft);
        }
    }, [contract.sendBurn, markNft, nft])
    const items = useMemo(() => mapNftToDescriptionProps(nft), [nft]);

    return (
        <Card hoverable variant={"outlined"} className={"nft-preview"} styles={{ body: { paddingTop: "10px" }}}>
            <Flex gap={'small'} vertical>
                {/* <NftCaption>{nft.nft_meta?.name}</NftCaption> */}
                <center>
                    <Image
                        src={nft.nft_meta?.image}
                        width={"15rem"}
                        preview={false}/>
                    <Flex vertical={false} justify='center' gap={'small'} >                
                        { nft.collection_type === 'WIN' ? (<PlayButton disabled={nft.state.type!=='NFT' || !canPlay() } sendBet={sendBetNft}/>) : null }
                        <BurnButton disabled={nft.state.type!=='NFT'} sendBurn={sendBurnNft} />
                    </Flex>
                </center>

                <Descriptions
                    bordered
                    size='small'
                    title={<div className='nft-description-title'>NFT Info</div>}
                    items={items}
                    contentStyle={{ color: 'silver' }}
                    labelStyle={{ color: 'white', fontFamily: 'BebasNeue, Arial, serif' }}/>            
                {/* {nft.nft_meta?.attributes && (<NftAttributes attributes={nft.nft_meta.attributes}/>)} */}
            </Flex>
        </Card>
    );
}