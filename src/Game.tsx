import { ApiOutlined, DownOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
// import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, Dropdown, Flex, MenuProps, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { PlayButton } from "./PlayButton";
import { useWonTonContract } from "./hooks/useWonTonContract";
import { useNftWatcher } from "./hooks/useNftWatcher";
import { Address } from "@ton/core";
import { NftCollections } from "./NftCollections";
import { Wontopia } from "./Wontopia";
import { Typography } from 'antd';
import { testOnly } from "./store/NftsStore";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { UniversesDescription } from "./UniversesDescription";
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

  const { handleUpdate, running } = useNftWatcher(walletAddress);

  const [ tonConnectUI ] = useTonConnectUI();
  const disconnectWallet = useCallback(() => {
    console.log("closing the ");
    tonConnectUI.disconnect();
  }, [close]);

  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <Flex gap='small' align='start' vertical>
      <Wontopia />

      <Flex vertical={false} gap='small' justify='space-between' align='center' className="game">
          <div className='connected'>Connected to the wallet</div>            
          <Button color="default" variant="solid" onClick={disconnectWallet}>Disconect<ApiOutlined /></Button>
          {/* <TonConnectButton/> */}
      </Flex>
      <Paragraph copyable className="address">{walletAddress.toString({testOnly})}</Paragraph>

      <Flex vertical={false} gap="middle" align='flex-start' className='zhopa2'>
          <Space>
            <Dropdown.Button
              icon={<DownOutlined />}
              loading={running}
              menu={{ items, selectable: true, defaultSelectedKeys: [ '0' ], onClick }}
              onClick={handleUpdate}>
              Refresh Universes
            </Dropdown.Button>
            <Button onClick={onOpen}><QuestionCircleOutlined /></Button>
          </Space>
      </Flex>
      <UniversesDescription isOpen={open}  onClose={onClose}/>

      { wontonPower === 0 ? (
        <>
          <p className="game-disclaimer">
            We are ready to play.
          </p>
          <PlayButton sendBet={contract.sendBet} />
        </> )
        : null
      }

      {ready && walletAddress ? (
        <NftCollections walletAddress={walletAddress} wontonPower={wontonPower} />
      ) : null }
    </Flex>
  );
}