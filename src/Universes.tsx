import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { useWontopiaPlay } from "./hooks/useWontopiaPlay.ts";
import { BEUniverses, playStateDescriptions } from "./lib/Types";
import { UniversesDescription } from "./UniversesDescription";
import { PlayButton } from "./PlayButton";
import { Address } from "@ton/core";

export const Universes = ({ walletAddress, onUniversesChange }: { walletAddress: Address, onUniversesChange: (universes: BEUniverses) => void }) => {
  const [ wontonPower, setWontonPower ] = useState(0);
  const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);
  const { sendBet, playState, paused } = useWontopiaPlay(universes, walletAddress);

  useEffect(() => {
    setUniverses(globalUniversesHolder.universesHolder[wontonPower]);
    onUniversesChange(globalUniversesHolder.universesHolder[wontonPower]);
  }, [ wontonPower, onUniversesChange ]);

  const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
    const newWontonPower = +key;
    if (wontonPower !== newWontonPower) {
      setWontonPower(newWontonPower);
      console.log(`Setting new universe. wontonPower: ${key}, address: ${globalUniversesHolder.universesHolder[newWontonPower].wonTon.toString()}`);
    }
  }, [wontonPower, setWontonPower]);

  const items: MenuProps["items"] = useMemo(() => {
      return Object.values(globalUniversesHolder.universesHolder).map(universes => {
          return {
              key: universes.wonTonPower.toString(),
              label: `Universe ${universes.wonTonPower}`,
          }
      });
  }, []);

  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const rottenPlay = useMemo(() => {
    if (paused) return false;
    const now = Date.now();
    const prev = playState?.started_at?.getTime();
    return !!(prev && ((now - prev) > 1000 * 60));
  }, [playState, paused])

  return (
      <>
        <Row wrap={false} className='universes-row'>
          <Col>
            <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: [ '0' ], onClick }} overlayClassName="custom-dropdown">
              <Button color="default" variant="solid">
                <Space>
                  <div className="universe-dropdown" style={{ paddingTop: '3px' }}>Universe {universes.wonTonPower}</div>
                  <DownOutlined style={{ color: 'gray' }}/>
                </Space>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            &nbsp;
            <Button color="default" variant="solid" shape='circle' onClick={onOpen} icon={<QuestionCircleOutlined/>} style={{ color: 'gray' }}/>
          </Col>
          <Col flex={'auto'}>&nbsp;</Col>
          <Col>
            {wontonPower === 0 ? (<PlayButton disabled={wontonPower !== 0 || !paused} sendBet={sendBet} playState={playState}/>) : null}
          </Col>
        </Row>
        <Row wrap={false} className='universes-row'>
          <Col  flex={'auto'}>
            {wontonPower === 0 && rottenPlay ? (<div className="subStatus">It can take much longer than expected, as your <b>Game</b> depends on {playState?.players_to_wait} other player[s]...</div>) : null}
          </Col>
        </Row>
        <UniversesDescription isOpen={open} onClose={onClose}/>
      </>
  );
}

