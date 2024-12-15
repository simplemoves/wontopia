import { Image } from "antd";
import { useMemo, useState } from "react";
import { Nft } from "./lib/Types";
import { NftItemPreview } from "./NftItemPreview";

export function NftItem({ nft, isNew, markNft }:{ nft: Nft, isNew: boolean, markNft: { forBurn: (nft: Nft) => void, forBet: (nft: Nft) => void }}) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const imageUrl = useMemo(() => nft.nft_meta?.image, [ nft ]);

    return (
        <Image
            rootClassName={isNew ? "new-nft" : ""}
            width={"5rem"}
            src={imageUrl}
            preview={{
                visible: previewVisible,
                onVisibleChange: (vis: boolean) => setPreviewVisible(vis),
                destroyOnClose: false,
                imageRender: () => (<NftItemPreview nft={nft} markNft={markNft} setPreviewVisible={setPreviewVisible} />),
                toolbarRender: () => null,
            }}
        />
    );
}