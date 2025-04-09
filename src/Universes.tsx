import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { BEUniverses } from "./lib/Types";
import { UniversesDescription } from "./UniversesDescription";
import { PlayButton } from "./PlayButton";
import { PlayNft } from "./PlayNft";
import { useWontopiaStore } from "./store/WontopiaStore.ts";
// import { printJson } from "./lib/ErrorHandler.ts";

export const Universes = ({ walletAddressStr, onUniversesChange }: { walletAddressStr: string, onUniversesChange: (universes: BEUniverses) => void }) => {
    const [ wontonPower, setWontonPower ] = useState(0);
    const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);
    const state = useWontopiaStore(walletAddressStr, wontonPower)(s => s.state);
    const isGameTakingTooLong = useWontopiaStore(walletAddressStr, wontonPower)(s => s.isGameTakingTooLong);
    const playersToWait = useWontopiaStore(walletAddressStr, wontonPower)(s => s.playersToWait);
    // console.log(`Game: ${printJson(game)}`);

    useEffect(() => {
        setUniverses(globalUniversesHolder.universesHolder[wontonPower]);
        onUniversesChange(globalUniversesHolder.universesHolder[wontonPower]);
    }, [ wontonPower, onUniversesChange, setUniverses ]);

    const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
        const newWontonPower = +key;
        if (wontonPower !== newWontonPower) {
            setWontonPower(newWontonPower);
            console.log(`Setting new universe. wontonPower: ${key}, address: ${globalUniversesHolder.universesHolder[newWontonPower].wonTon.toString()}`);
        }
    }, [ wontonPower, setWontonPower ]);

    const items: MenuProps["items"] = useMemo(() => {
        return Object.values(globalUniversesHolder.universesHolder).map(universes => {
            return {
                key: universes.wonTonPower.toString(),
                label: `Universe ${universes.wonTonPower}`,
            }
        });
    }, []);

    const [ open, setOpen ] = useState(false);
    const onClose = useCallback(() => {
        setOpen(false);
    }, [ setOpen ]);

    const onOpen = useCallback(() => {
        setOpen(true);
    }, [ setOpen ]);

    return (
        <>
            <Row wrap={false} className="universes-row">
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
                    <Button color="default" variant="solid" shape="circle" onClick={onOpen} icon={<QuestionCircleOutlined/>} style={{ color: 'gray' }}/>
                </Col>
                <Col flex={'auto'}>&nbsp;</Col>
                <Col>
                    {universes.wonTonPower === 0 ?
                     (<PlayButton universes={universes} walletAddressStr={walletAddressStr}/>) :
                     (<PlayNft key={`${walletAddressStr}-${universes.wonTonPower}`} universes={universes} walletAddressStr={walletAddressStr}/>)
                    }
                </Col>
            </Row>
            <Row wrap={false} className="universes-row">
                <Col flex={'auto'}>
                    {isGameTakingTooLong ? (<div className="sub-status-generic">It can take much longer than expected, as your <b>Game</b> depends on {playersToWait} other player[s]...</div>) : null}
                    {state == "WIN" ? (<div className="sub-status-win">You Won last play. Congratulations!!!</div>) : null}
                    {state == "LOOSE" ? (<div className="sub-status-loose">You Loose last play. Cheer up!!!</div>) : null}
                </Col>
            </Row>
            <UniversesDescription isOpen={open} onClose={onClose}/>
        </>
    );
}

