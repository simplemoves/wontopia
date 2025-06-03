import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
import { useCallback, useMemo, useState } from "react";
import { globalUniversesHolder, universesItems } from "./store/GlobalUniversesHolder";
import { BEUniverses, GameStateLog } from "./lib/Types";
import { UniversesDescription } from "./UniversesDescription";
import { PlayTon } from "./PlayTon.tsx";
import { PlayNft } from "./PlayNft";
import { useWontopiaStore } from "./store/WontopiaStore.ts";

type UniversesProps = {
    walletAddressStr: string,
    gameStateLog: GameStateLog,
    onUniversesChange: (universes: BEUniverses) => void,
    startGame: () => void,
}

export const Universes = ({ walletAddressStr, onUniversesChange, gameStateLog, startGame }: UniversesProps) => {
    const [ power, setPower ] = useState(0);
    const universes = useMemo(() => globalUniversesHolder.universesHolder[power], [ power ])
    const isGameTakingTooLong = useWontopiaStore(walletAddressStr, power)(s => s.isGameTakingTooLong);

    const onClick: MenuProps['onClick'] = useCallback(({ key }: { key: string }) => {
        const newWontonPower = +key;
        setPower(prevPower => {
            if (prevPower !== newWontonPower) {
                onUniversesChange(globalUniversesHolder.universesHolder[newWontonPower]);
                console.log(`Setting new universe. wontonPower: ${key}, address: ${globalUniversesHolder.universesHolder[newWontonPower].wonTon.toString()}`);
                return newWontonPower;
            } else {
                return prevPower
            }
        });

    }, [ setPower, onUniversesChange ]);

    const [ open, setOpen ] = useState(false);
    const onClose = useCallback(() => { setOpen(false); }, [ setOpen ]);
    const onOpen = useCallback(() => { setOpen(true); }, [ setOpen ]);

    return (
        <>
            <Row wrap={false} className="universes-row">
                <Col>
                    <Dropdown menu={{ items: universesItems, selectable: true, defaultSelectedKeys: [ '0' ], onClick }} overlayClassName="custom-dropdown">
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
                     <PlayTon universes={universes} gameStateLog={gameStateLog} walletAddressStr={walletAddressStr} startGame={startGame}/> :
                     <PlayNft key={`${walletAddressStr}-${universes.wonTonPower}`} universes={universes} gameStateLog={gameStateLog} walletAddressStr={walletAddressStr} startGame={startGame}/>
                    }
                </Col>
            </Row>
            <Row wrap={false} className="universes-row">
                <Col flex={'auto'}>
                    {gameStateLog.after.state == "WIN" ? (<div className="sub-status-win">You Won last play. Congratulations!!!</div>) : null}
                    {gameStateLog.after.state == "LOOSE" ? (<div className="sub-status-loose">You Loose last play. Cheer up!!!</div>) : null}
                    {gameStateLog.after.gameIsStarted && isGameTakingTooLong ? (<div className="sub-status-generic">It can take much longer than expected, as your <b>Game</b> depends on other player[s]...</div>) : null}
                </Col>
            </Row>
            <UniversesDescription isOpen={open} onClose={onClose}/>
        </>
    );
}

