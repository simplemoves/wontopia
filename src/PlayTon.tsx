import './PlayButton.css';
import { Button } from "antd";
import { BEUniverses, PlayStateDescription } from "./lib/Types.ts";
import { useCallback } from "react";
import { useTonConnect } from "./hooks/useTonConnect.ts";
import { useWontopiaStore } from "./store/WontopiaStore.ts";

type PlayButtonProps = {
    universes: BEUniverses,
    walletAddressStr: string,
    isGameStarted: boolean,
    playStateDescription: PlayStateDescription,
    startGame: () => void,
}

export function PlayTon({ universes, walletAddressStr, isGameStarted, playStateDescription, startGame }: PlayButtonProps) {
    const { sender } = useTonConnect();
    const sendBet = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBet);
    const onClickHandler = useCallback(async () => {
        const success = await sendBet(sender, universes.wonTon).catch(console.error);
        if (success) {
            startGame()
        }
    }, [sendBet, sender, universes.wonTon, startGame]);

    if (isGameStarted) {
        return <div className={playStateDescription.className}><div className="content">{playStateDescription.description}</div></div>
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