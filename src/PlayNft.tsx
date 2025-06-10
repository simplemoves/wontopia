import './PlayNft.css'
import { BEUniverses, Nft, PlayStateDescription } from "./lib/Types.ts";
import { useCallback, useMemo, useState } from "react";
import { Button, Dropdown, Image, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useWontopiaStore } from "./store/WontopiaStore.ts";
import { NftItemPreview } from "./NftItemPreview.tsx";
import { useTonConnect } from "./hooks/useTonConnect.ts";

const DEFAULT_TITLE = "Select Nft";

type PlayNftProps = {
    universes: BEUniverses,
    walletAddressStr: string,
    isGameStarted: boolean,
    playStateDescription: PlayStateDescription,
    startGame: () => void,
}

export const PlayNft = ({ universes, walletAddressStr, isGameStarted, playStateDescription, startGame }: PlayNftProps) => {
    console.log(`PlayNft for ${walletAddressStr} and Universe: ${universes.wonTonPower}`);
    const { sender } = useTonConnect();
    const sendBetNft = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBetNft);
    const winNfts = useWontopiaStore(walletAddressStr, universes.wonTonPower - 1)(s => s.winNfts);
    const markNftAsBet = useWontopiaStore(walletAddressStr, universes.wonTonPower - 1)(s => s.markNftAsBet);
    const [ nft, setNft ] = useState<Nft | undefined>();
    const [ title, setTitle ] = useState(DEFAULT_TITLE);
    const [ previewVisible, setPreviewVisible ] = useState(false);

    const handleItemClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
        const nft = winNfts[key];
        setNft(nft);
        if (nft) setTitle(`NFT #${nft.nft_index}`);
    }, [ winNfts, setNft, setTitle ]);

    const menuProps = useMemo(() => {
        return {
            items: Object.values(winNfts).map(nft => {
                return {
                    key: nft.nft_address,
                    label: `Nft #${nft.nft_index}`,
                }
            }),
            selectable: true,
            onClick: handleItemClick,
        };
    }, [ winNfts, handleItemClick ]);

    const onClickHandler = useCallback(async () => {
        const success = await sendBetNft(sender, nft?.nft_address).catch(console.error);
        console.log(`sendBetNft result: ${success}`);
        if (success) {
            markNftAsBet(nft?.nft_address);
            setNft(undefined);
            setTitle(DEFAULT_TITLE);
            startGame();
        }
    }, [ sender, nft?.nft_address, sendBetNft, markNftAsBet, setNft, setTitle, startGame ]);

    if (isGameStarted) {
        return <div className={playStateDescription.className}><div className="content">{playStateDescription.description}</div></div>
    }

    if (Object.keys(winNfts).length < 1) {
        return <div className='no-nfts'>No NFTs to Play</div>
    }

    // console.log(`winNfts: ${printJson(winNfts)}`);
    return (
        <div style={{ display: "flex", flexFlow: "column" }}>
            <div style={{ display: "flex", flexFlow: "row" }}>
                <Space>
                    <Dropdown menu={menuProps} overlayClassName="custom-dropdown">
                        <Button color="default" variant="solid">
                            <div className="universe-dropdown" style={{ paddingTop: '3px' }}>{title}</div>
                            <DownOutlined style={{ color: 'gray' }}/>
                        </Button>
                    </Dropdown>
                    {nft ? (
                        <>
                            <Image
                                width={"7vw"}
                                src={nft.nft_meta?.image}
                                preview={{
                                    visible: previewVisible,
                                    onVisibleChange: (vis: boolean) => setPreviewVisible(vis),
                                    destroyOnClose: false,
                                    imageRender: () => (<NftItemPreview nft={nft} setPreviewVisible={setPreviewVisible} walletAddressStr={walletAddressStr}/>),
                                    toolbarRender: () => null,
                                }}/>
                            <Button color="default" variant="solid" onClick={onClickHandler} disabled={!nft} className="play-nft-button">Play</Button>
                        </>
                    ) : null}
                </Space>
            </div>
        </div>
    );
}