import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { useWonTonContract } from "./hooks/useWonTonContract";
import { BEUniverses } from "./lib/Types";
import { UniversesDescription } from "./UniversesDescription";
import { PlayButton } from "./PlayButton";

export const Universes = ({ onUniversesChange }: { onUniversesChange: (universes: BEUniverses) => void }) => {
  const [ wontonPower, setWontonPower ] = useState(0);
  const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);

  useEffect(() => {
    setUniverses(globalUniversesHolder.universesHolder[wontonPower]);
    onUniversesChange(globalUniversesHolder.universesHolder[wontonPower]);
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

  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);  
  
  return (      
    <>
      <Row wrap={false} className='universes-row'>        
        <Col>
          <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: [ '0' ], onClick }} overlayClassName="custom-dropdown">
            <Button color="default" variant="solid" >
              <Space>
                <div className="connected" style={{paddingTop: '3px'}}>Universe {universes.wonTonPower}</div>
                <DownOutlined style={{ color: '#B40000' }}/>
              </Space>
            </Button>
          </Dropdown>
        </Col>
        <Col>
          &nbsp;
          <Button color="default" variant="solid" shape='circle' onClick={onOpen} icon={<QuestionCircleOutlined />} style={{ color: '#B40000' }}/>
        </Col>
        <Col flex={'auto'}>&nbsp;</Col>
        <Col>
          { wontonPower === 0 ? (<PlayButton disabled={wontonPower !== 0} sendBet={contract.sendBet} />) : null }
        </Col>
      </Row>
      <UniversesDescription isOpen={open}  onClose={onClose}/>
    </>
  );
}

