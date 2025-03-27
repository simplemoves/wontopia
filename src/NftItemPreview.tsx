import './App.css';
import { Card, Descriptions, Flex, Image } from "antd";
import { Nft } from './lib/Types';
import { BurnButton } from './BurnButton';
import { useCallback, useMemo } from 'react';
import { mapNftToDescriptionProps } from './workers/WonTonNftTools';
import { useNftItemContract } from './hooks/useNftItemContract';
import { Address } from '@ton/core';
import { useWontopiaStore } from "./store/WontopiaStore.ts";

export function NftItemPreview({ nft, setPreviewVisible, walletAddressStr }: {
        nft: Nft,
        setPreviewVisible: (previeVisible: boolean) => void,
        walletAddressStr: string
    }) {
    const { sendBurn }  = useNftItemContract(Address.parse(nft.nft_address))
    const markNftBurned = useWontopiaStore(walletAddressStr, nft.wonton_power)((state) => state.markNftAsBurned);
    const sendBurnNft = useCallback(async () => {
        setPreviewVisible(false);
        const sent = await sendBurn();
        if (sent) {
          markNftBurned(nft.nft_address);
        }
    }, [sendBurn, markNftBurned, nft])

    const items = useMemo(() => mapNftToDescriptionProps(nft), [nft]);

    return (
        <Card hoverable variant={"outlined"} className={"nft-preview"} styles={{ body: { paddingTop: "10px" }}}>
            <Flex gap={'small'} vertical>
                {/* <NftCaption>{nft.nft_meta?.name}</NftCaption> */}
                <center>
                    <Image
                        src={nft.nft_meta?.image}
                        width={"20rem"}
                        preview={false}/>
                    <Flex vertical={false} justify='center' gap={'small'} >
                        <BurnButton disabled={nft.state.type!=='NFT'} sendBurn={sendBurnNft} />
                    </Flex>
                </center>

                <Descriptions
                    bordered
                    size='small'
                    title={<div className='nft-description-title'>NFT Info</div>}
                    items={items}
                    styles={{
                      content: { color: 'silver' },
                      label: { color: 'white', fontFamily: 'BebasNeue, Arial, serif' }
                    }}/>
                {/* {nft.nft_meta?.attributes && (<NftAttributes attributes={nft.nft_meta.attributes}/>)} */}
            </Flex>
        </Card>
    );
}