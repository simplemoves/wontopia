import { Image } from "antd";
import { useCallback, useMemo, useState } from "react";
import { Nft } from "./lib/Types";
import { NftItemPreview } from "./NftItemPreview";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder.ts";

export function NftItem({ nft, walletAddressStr }:{ nft: Nft, walletAddressStr: string }) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const imageUrl = useMemo(() => nft.nft_meta?.image, [ nft ]);
    const canPlay = useCallback(() => {
      return !!nft.wonton_power && !!globalUniversesHolder.universesHolder[nft.wonton_power];
    }, [nft.wonton_power]);
    const isNew = false;

  const markNft = useMemo(() => {
    return {
      forBurn: (nft: Nft) => {console.log(`Mark NFT for Burn not implemented: ${nft}`);},
      forBet: (nft: Nft) => {console.log(`Mark NFT for Bet not implemented: ${nft}`);},
    }}, [walletAddressStr]);

    return (
        <Image
            rootClassName={isNew ? "new-nft" : ""}
            width={"5rem"}
            src={imageUrl}
            preview={{
                visible: previewVisible,
                onVisibleChange: (vis: boolean) => setPreviewVisible(vis),
                destroyOnClose: false,
                imageRender: () => (<NftItemPreview nft={nft} markNft={markNft} setPreviewVisible={setPreviewVisible} canPlay={canPlay}/>),
                toolbarRender: () => null,
            }}
        />
    );
}