import './App.css';
import { Card, Descriptions, Flex, Image, Skeleton } from "antd";
import { Nft } from './lib/Types';
import { BurnButton } from './BurnButton';
import { useCallback, useMemo } from 'react';
import { mapNftToDescriptionProps } from './workers/WonTonNftTools';
import { useWontopiaStore } from "./store/WontopiaStore.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";

export function NftItemPreview({ nft, setPreviewVisible, walletAddressStr }: {
        nft: Nft,
        setPreviewVisible: (previeVisible: boolean) => void,
        walletAddressStr: string
    }) {
    const { sender } = useTonConnect();
    const sendBurn = useWontopiaStore(walletAddressStr, nft.wonton_power - 1)(s => s.sendBurn);
    const sendBurnNft = useCallback(async () => {
        setPreviewVisible(false);
        await sendBurn(sender, nft.nft_address);
    }, [ sendBurn, sender, nft.nft_address, setPreviewVisible ])

    const items = useMemo(() => mapNftToDescriptionProps(nft), [nft]);

    return (
        <Card hoverable variant={"outlined"} className={"nft-preview"} styles={{ body: { paddingTop: "10px" }}}>
            <Flex gap={'small'} vertical>
                {/* <NftCaption>{nft.nft_meta?.name}</NftCaption> */}
                <center>
                    <Image
                        src={nft.nft_meta?.image}
                        width={"20rem"}
                        height={"20rem"}
                        placeholder={<Skeleton.Image active={true} style={{ width: "20rem", height: "20rem" }} />}
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