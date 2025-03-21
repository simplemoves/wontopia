import './PlayNft.css'
import { BEUniverses, Nft, playStateDescriptions } from "./lib/Types.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Image, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useWontopiaStore } from "./store/WontopiaStore.ts";
import { NftItemPreview } from "./NftItemPreview.tsx";
import { useGameStore } from "./store/GameStore.ts";
import { useWontopiaNftPlay } from "./hooks/useWontopiaNftPlay.ts";

const DEFAULT_TITLE = "Select Nft";

export const PlayNft = ({ universes, walletAddressStr }: { universes: BEUniverses, walletAddressStr: string }) => {
    const { getFilteredNfts, nfts } = useWontopiaStore(walletAddressStr)();
    const winNfts = useMemo(() => getFilteredNfts(universes.wonTonPower - 1, 'WIN'), [ universes.wonTonPower, nfts, getFilteredNfts ]);
    const [ nft, setNft ] = useState<Nft | undefined>();
    const [ title, setTitle ] = useState(DEFAULT_TITLE);
    const { sendNftBet, playState, paused } = useWontopiaNftPlay(nft, universes, walletAddressStr);
    const { setDelayed, setPaused, setPlayersToWait, setState } = useGameStore(walletAddressStr, universes.wonTonPower)();
    const [statusDescription, className] = useMemo(() => playStateDescriptions(playState?.last_event.state), [playState?.last_event.state])

    useEffect(() => {
        let isDelayed = false;
        if (!paused) {
            const prev = playState?.last_event.stateChangedAt.getTime();
            isDelayed = !!(prev && ((Date.now() - prev) > 1000 * 25));
        }

        setPaused(paused);
        setDelayed(isDelayed);
        setPlayersToWait(playState?.players_to_wait ?? 3);
        setState(playState?.last_event.state ?? 'UNKNOWN');
    }, [playState, paused, setDelayed, setPaused, setPlayersToWait]);


    const handleItemClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
        const nft = winNfts.find(nft => nft.nft_index.toString() === key);
        setNft(nft);
        setTitle(nft ? `NFT #${nft.nft_index}` : DEFAULT_TITLE);
    }, [ winNfts, setNft, setTitle ]);

    const items: MenuProps["items"] = useMemo(() => {
        return Object.values(winNfts).map(nft => {
            return {
                key: nft.nft_index.toString(),
                label: `Nft #${nft.nft_index}`,
            }
        });
    }, [ winNfts ]);

    const menuProps = {
        items,
        selectable: true,
        onClick: handleItemClick,
    };

    const [ previewVisible, setPreviewVisible ] = useState(false);

    if (!paused) {
        return <div className={className}>{statusDescription}</div>
    }

    if (winNfts.length < 1) {
        return <div className='no-nfts'>No NFTs to Play</div>
    }

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
                            <Button color="default" variant="solid" onClick={sendNftBet} disabled={!nft} className="play-nft-button">Play</Button>
                        </>
                    ) : null}
                </Space>
            </div>
        </div>
    );
}