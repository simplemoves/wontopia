import { collectionTypeCaptions, Nft, NftMetaAttributes } from "../lib/Types";
import { DescriptionsProps } from "antd";


export const mapNftToDescriptionProps = (nft: Nft): DescriptionsProps['items'] => {
    return [
        {
            label: 'Nft Name',
            children: nft.nft_meta?.name,
        },
        {
            label: 'Collection Type',
            children: collectionTypeCaptions[nft.collection_type],
        },
        {
            label: 'Nft Index',
            children: nft.nft_meta?.attributes.find((attr) => attr.trait_type === 'nft_index')?.value,
        },
        // {
        //     label: 'Created At',
        //     children: new Date(+nft.created_at).toISOString(),
        // },
        // {
        //     label: 'Description',
        //     children: nft.nft_meta?.description,
        // },
    ];
}

export const mapAttrToDescriptionProps = (attributes: NftMetaAttributes[]): DescriptionsProps['items'] => {
    return attributes
        .filter((attribute) => attribute.trait_type === 'nft_index')
        .map((attribute) => {
            return {
                label: attribute.trait_type,
                children: attribute.value,
            }        
        });
}