import './App.css'
import { Descriptions } from "antd";
import { NftMetaAttributes } from './lib/Types';
import { mapAttrToDescriptionProps } from './workers/WonTonNftTools';
import { useMemo } from 'react';

export function NftAttributes ( { attributes }: {attributes: NftMetaAttributes[]}) {    
  const items = useMemo(() => mapAttrToDescriptionProps(attributes), [attributes]);  
  return (
    <Descriptions
      bordered
      size='small'
      title={<div className={'nft-description-title'}>NFT Attributes</div>}
      items={items}
      styles={{
        label: { color: 'white', fontFamily: 'BebasNeue, Arial, serif' },
        content: { color: 'silver' },
    }}/>
  );
}