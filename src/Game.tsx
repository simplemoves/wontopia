import { ApiOutlined, DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Flex, MenuProps, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { PlayButton } from "./PlayButton";
import { useWonTonContract } from "./hooks/useWonTonContract";
import { Address } from "@ton/core";
import { NftCollections } from "./NftCollections";
import { Wontopia } from "./Wontopia";
import { Typography } from 'antd';
import { testOnly } from "./store/NftsStore";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { UniversesDescription } from "./UniversesDescription";
import { CCaption } from "./Typography";
const { Paragraph } = Typography;

export const Game = ({ ready, walletAddress }: { ready: boolean, walletAddress: Address }) => {
  const [ wontonPower, setWontonPower ] = useState(0);
  const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);

  useEffect(() => {
    setUniverses(globalUniversesHolder.universesHolder[wontonPower]);
  }, [ wontonPower ]);

  const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
    setWontonPower(+key);
    console.log(`Setting new universe. wontonPower: ${key}, address: ${globalUniversesHolder.universesHolder[+key].wonTon.toString()}`);
  }, []);
  
  const contract = useWonTonContract(universes.wonTon);

  const items: MenuProps["items"] = useMemo(() => {
      return Object.values(globalUniversesHolder.universesHolder).map(universes => {
          return {
              key: universes.wonTonPower.toString(),
              label: `Universe ${universes.wonTonPower}`,
          }
      });
  }, []);

  const [ tonConnectUI ] = useTonConnectUI();
  const disconnectWallet = useCallback(() => {
    console.log("closing the ");
    tonConnectUI.disconnect();
  }, [tonConnectUI]);

  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <>
      <UniversesDescription isOpen={open}  onClose={onClose}/>      
      <Flex gap='small' align='start' vertical>
        <Wontopia />

        <Flex vertical={false} gap='large' align='center' className="game">
            <div className='connected'>Connected to the wallet</div>   
            <Button color="default" variant="solid" shape='round' icon={<ApiOutlined />} onClick={disconnectWallet} style={{ color: 'gray'}}>
              Disconnect
            </Button>         
        </Flex>
        <Paragraph copyable className="address">{walletAddress.toString({testOnly})}</Paragraph>
        <Divider variant="dotted" style={{ borderColor: 'silver' }}>
          <CCaption>Chose universe</CCaption>
        </Divider>

        <Flex vertical={false} gap="small" align='flex-start'>
          <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: [ '0' ], onClick }} overlayClassName="custom-dropdown">
            <Button color="default" variant="solid" >
              <Space>
                <div className="connected" style={{paddingTop: '3px'}}>Universe {universes.wonTonPower}</div>
                <DownOutlined style={{ color: '#E60000' }}/>
              </Space>
            </Button>
          </Dropdown>          
          <Button color="default" variant="solid" shape='circle' onClick={onOpen} icon={<QuestionCircleOutlined />}  style={{ color: '#E60000' }}/>
          { wontonPower === 0 ? (<PlayButton disabled={wontonPower !== 0} sendBet={contract.sendBet} />) : null }

        </Flex>

        {ready && walletAddress ? (
          <NftCollections walletAddress={walletAddress} universes={universes} />
        ) : null }
      </Flex>
    </>
  );
}