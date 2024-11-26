import { DownOutlined } from "@ant-design/icons";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Dropdown, Flex, MenuProps, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { PlayButton } from "./PlayButton";
import { useWonTonContract } from "./hooks/useWonTonContract";

export const Game = () => {
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

  return (
    <Flex gap='small' align='start' vertical>
            <Flex vertical={false} gap='middle' justify='space-between' className='caption'>
        <div className='main-title'>WONTOPIA</div>
        <div className='version'>v0.1.0</div>
      </Flex>

      <Flex vertical={false} gap='middle' justify='space-between' align='flex-end' className="game">
          <div className='letsdoit'>Connected to the wallet</div>
          <TonConnectButton/>
      </Flex>

      {wontonPower ===0 ? (
        <>
          <p className="game-disclaimer">
            We are ready to play.
          </p>
          <PlayButton sendBet={contract.sendBet} />
        </> )
        : null
      }

      <Flex vertical={false} gap="middle" align='flex-start' className='zhopa2'>
          <Space>
              <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: [ '0' ], onClick }} trigger={[ 'click' ]}>
                  <a onClick={(e) => e.preventDefault()}>
                      <Space>
                          Universes
                          <DownOutlined/>
                      </Space>
                  </a>
              </Dropdown>
          </Space>
      </Flex>
    </Flex>
  );
}