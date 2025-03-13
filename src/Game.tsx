import { Col, Divider, Row } from "antd";
import { useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { Address } from "@ton/core";
import { NftCollections } from "./NftCollections";
import { Wontopia } from "./Wontopia";
import { CCaption } from "./Typography";
import { Wallet } from "./Wallet";
import { Universes } from "./Universes";
import { testOnly } from "./lib/Constants.ts";

export const Game = ({ walletAddress }: { walletAddress: Address }) => {
  const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);
  const walletAddressStr = useMemo(() => walletAddress.toString({testOnly}), [walletAddress]);

  return (
      <>
        <Wontopia/>
        <Row wrap={false} className='caption'>
          <Col flex={'auto'} className='wallet-connected'>
            <div className='container1'>
              <div className='upper-row'>Connected to the wallet</div>
              <div className='down-row'>{walletAddressStr}</div>
            </div>
          </Col>
          <Col>
            <Wallet walletAddress={walletAddress}/>
          </Col>
        </Row>

        <Divider variant="dotted" style={{ borderColor: 'gray' }}>
          <CCaption>Choose The Universe</CCaption>
        </Divider>

        <Universes walletAddressStr={walletAddressStr} onUniversesChange={setUniverses}/>

        <NftCollections walletAddressStr={walletAddressStr} universes={universes}/>
      </>
  );
}