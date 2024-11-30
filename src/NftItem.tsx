import { Image } from "antd";
import { useCallback, useMemo, useState } from "react";
import { Nft } from "./lib/Types";
import { useNftItemContract } from "./hooks/useNftItemContract";
import { Address } from "@ton/core";
import { NftItemPreview } from "./NftItemPreview";

export function NftItem({ nft, isNew }: { nft: Nft, isNew: boolean }) {
    const contract = useNftItemContract(Address.parse(nft.nft_address))
    const [previewVisible, setPreviewVisible] = useState(false);
    const closePreview = useCallback(() => { setPreviewVisible(false); }, [setPreviewVisible]);

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
                imageRender: () => (<NftItemPreview nft={nft} sendBetNft={contract.sendBetNft} sendBurnNft={contract.sendBurn} closePreview={closePreview}/>),
                toolbarRender: () => null,
            }}
        />
    );
}