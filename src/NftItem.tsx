import { Image, Skeleton } from "antd";
import { useMemo, useState } from "react";
import { Nft } from "./lib/Types";
import { NftItemPreview } from "./NftItemPreview";

export function NftItem({ nft, walletAddressStr }:{ nft: Nft, walletAddressStr: string }) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const imageUrl = useMemo(() => nft.nft_meta?.image, [ nft ]);
    const isNew = false;

    return (
        <Image
            rootClassName={isNew ? "new-nft" : ""}
            width={"5rem"}
            height={"5rem"}
            src={imageUrl}
            placeholder={<Skeleton.Image active={true} style={{ width: "5rem", height: "5rem" }} />}
            preview={{
                visible: previewVisible,
                onVisibleChange: (vis: boolean) => setPreviewVisible(vis),
                destroyOnClose: false,
                imageRender: () => (<NftItemPreview nft={nft} setPreviewVisible={setPreviewVisible} walletAddressStr={walletAddressStr} />),
                toolbarRender: () => null,
            }}
        />
    );
}