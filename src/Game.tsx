import { Col, Divider, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { globalUniversesHolder } from "./store/GlobalUniversesHolder";
import { Address } from "@ton/core";
import { NftCollections } from "./NftCollections";
import { Wontopia } from "./Wontopia";
import { CCaption } from "./Typography";
import { Wallet } from "./Wallet";
import { Universes } from "./Universes";
import { initialUserStates, testOnly } from "./lib/Constants.ts";
import { useSubscription } from "urql";
import { playStatusSubscriptionQuery } from "./lib/WontopiaGraphQL.ts";
import { activePlayStates, GameStateLog, playStateDescriptions, UserGameEvent } from "./lib/Types.ts";
import { useWontopiaStore } from "./store/WontopiaStore.ts";

type GameProps = {
    walletAddress: Address
}

export const Game = ({ walletAddress }: GameProps) => {
    const [ universes, setUniverses ] = useState(globalUniversesHolder.universesHolder[0]);
    const [ gameStateLogs, setGameStateLogs ] = useState<Record<number, GameStateLog>>(initialUserStates);
    const walletAddressStr = useMemo(() => walletAddress.toString({ testOnly }), [ walletAddress ]);

    useSubscription({
        query: playStatusSubscriptionQuery,
        variables: {
            walletAddressStr: walletAddressStr,
        },
    }, (_, newData) => {
        if (newData?.playState) {
            const playState: UserGameEvent = newData.playState;
            // If game played, need to run NFTs update
            const gameLog = gameStateLogs[playState.power];
            const newGameLog = {
                before: { ...gameLog.after},
                after: { state: playState.state, stateChangedAt: playState.stateChangedAt, gameIsStarted: activePlayStates[playState.state] }
            }

            setGameStateLogs(prev => ({ ... prev, [newData.playState.power]: newGameLog }));
        }
        return newData
    });

    const gameStateLog = useMemo(() => gameStateLogs[universes.wonTonPower], [ universes.wonTonPower, gameStateLogs ])
    const handleUpdate = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.handleUpdate);
    const playStateDescription = useMemo(() => playStateDescriptions(gameStateLog.after.state), [ gameStateLog.after.state ]);

    useEffect(() => {
        if (gameStateLog.before.state !== gameStateLog.after.state && (gameStateLog.after.state === 'WIN' || gameStateLog.after.state === 'LOOSE') ) {
            // NFT Request with postpone for 10 seconds
            handleUpdate(10000);
        }
    }, [ gameStateLog, handleUpdate ] );

    const startGame = useCallback(() => {
        const gameLog = gameStateLogs[universes.wonTonPower];
        const newGameLog: GameStateLog = {
            before: { ...gameLog.after },
            after: { state: 'REQUESTED', stateChangedAt: new Date(), gameIsStarted: true }
        }

        setGameStateLogs(prev => ({ ...prev, [universes.wonTonPower]: newGameLog }));
    }, [universes.wonTonPower, setGameStateLogs, gameStateLogs]);

    return (
        <>
            <Wontopia/>
            <Row wrap={false} className="caption">
                <Col flex={'auto'} className="wallet-connected">
                    <div className="wallet-connected-container">
                        <div className="wallet-connected-upper-row">Connected to the wallet</div>
                        <div className="wallet-connected-down-row">{walletAddressStr}</div>
                    </div>
                </Col>
                <Col>
                    <Wallet walletAddressStr={walletAddressStr}/>
                </Col>
            </Row>

            <Divider variant="dotted" style={{ borderColor: 'gray' }}>
                <CCaption>Choose The Universe</CCaption>
            </Divider>

            <Universes
                walletAddressStr={walletAddressStr}
                gameState={gameStateLog.after.state}
                isGameStarted={gameStateLog.after.gameIsStarted}
                playStateDescription={playStateDescription}
                onUniversesChange={setUniverses}
                startGame={startGame}/>

            <NftCollections walletAddressStr={walletAddressStr} universes={universes}/>
        </>
    );
}