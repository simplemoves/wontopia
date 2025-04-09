import './PlayNft.css'
import { BEUniverses, Nft } from "./lib/Types.ts";
import { useCallback, useMemo, useState } from "react";
import { Button, Dropdown, Image, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useWontopiaStore } from "./store/WontopiaStore.ts";
import { NftItemPreview } from "./NftItemPreview.tsx";
import { useTonConnect } from "./hooks/useTonConnect.ts";
import { useWontopiaPlay } from "./hooks/useWontopiaPlay.ts";

const DEFAULT_TITLE = "Select Nft";

export const PlayNft = ({ universes, walletAddressStr }: { universes: BEUniverses, walletAddressStr: string }) => {
    console.log(`PlayNft for ${walletAddressStr} and Universe: ${universes.wonTonPower}`);
    const { sender } = useTonConnect();
    const { stateDescription, stateClassName, subscriptionPaused, sendBetNft } = useWontopiaPlay(universes, walletAddressStr);
    const winNfts = useWontopiaStore(walletAddressStr, universes.wonTonPower - 1)(s => s.winNfts);
    const markNftAsBet = useWontopiaStore(walletAddressStr, universes.wonTonPower - 1)(s => s.markNftAsBet);
    const [ nft, setNft ] = useState<Nft | undefined>();
    const [ title, setTitle ] = useState(DEFAULT_TITLE);
    const [ previewVisible, setPreviewVisible ] = useState(false);

    // useEffect(() => {
    //     console.log(`Install PlayNft`);
    //     setNft(undefined);
    //     setTitle(DEFAULT_TITLE);
    // }, [walletAddressStr, universes.wonTonPower]);

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
        }
    }, [ sender, nft?.nft_address, sendBetNft, markNftAsBet, setNft, setTitle ]);

    if (!subscriptionPaused) {
        return <div className={stateClassName}><div className="content">{stateDescription}</div></div>
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