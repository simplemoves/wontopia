import './PlayButton.css';
import { Button } from "antd";
import { BEUniverses, GameStateLog } from "./lib/Types.ts";
import { useCallback } from "react";
import { useWontopiaPlay } from "./hooks/useWontopiaPlay.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";

type PlayButtonProps = {
    universes: BEUniverses,
    walletAddressStr: string,
    gameStateLog: GameStateLog,
    startGame: () => void,
}

export function PlayTon({ universes, walletAddressStr, gameStateLog, startGame }: PlayButtonProps) {
    const { sender } = useTonConnect();
    const { stateDescription, stateClassName, sendBet } = useWontopiaPlay(universes, gameStateLog, walletAddressStr);
    const onClickHandler = useCallback(async () => {
        const success = await sendBet(sender, universes.wonTon).catch(console.error);
        if (success) {
            startGame()
        }
    }, [sendBet, sender, universes.wonTon]);

    if (gameStateLog.after.gameIsStarted) {
        return <div className={stateClassName}><div className="content">{stateDescription}</div></div>
    }

    return <Button
        color="default"
        variant="solid"
        shape="round"
        onClick={onClickHandler}
        style={{ color: 'var(--primary-color)' }}
        className="play-button">
        Let's Play!
    </Button>
}