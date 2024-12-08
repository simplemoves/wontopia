import { Col, Divider, Row } from "antd";
import { useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { Address } from "@ton/core";
import { NftCollections } from "./NftCollections";
import { Wontopia } from "./Wontopia";
import { CCaption } from "./Typography";
import { Wallet } from "./Wallet";
import { Universes } from "./Universes";

export const Game = ({ walletAddress }: { walletAddress: Address }) => {
  const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);

  return (
    <>
      <Wontopia />    
      <Row wrap={false} className='caption'>
        <Col flex={'auto'} className='wallet-connected'>
          Connected to the wallet
        </Col>
        <Col>
          <Wallet walletAddress={walletAddress} />          
        </Col>
      </Row>  

      <Divider variant="dotted" style={{ borderColor: 'gray' }}>
            <CCaption>Choose The Universe</CCaption>
      </Divider>

      <Universes onUniversesChange={setUniverses}/>

      <NftCollections walletAddress={walletAddress} universes={universes} />
    </>
  );
}