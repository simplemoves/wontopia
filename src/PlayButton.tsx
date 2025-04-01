import './PlayButton.css';
import { Button } from "antd";
import { BEUniverses } from "./lib/Types.ts";
import { useCallback } from "react";
import { useWontopiaPlay } from "./hooks/useWontopiaPlay.ts";
import { useTonConnect } from "./hooks/useTonConnect.ts";

export function PlayButton({ universes, walletAddressStr }: { universes: BEUniverses, walletAddressStr: string }) {
    const { sender } = useTonConnect();
    const { stateDescription, stateClassName, subscriptionPaused, sendBet } = useWontopiaPlay(universes, walletAddressStr);
    const onClickHandler = useCallback(() => { sendBet(sender, universes.wonTon).catch(console.error); }, [sendBet, sender, universes.wonTon]);

    // console.log(`PlayButton. stateDescription: ${stateDescription}, stateClassName: ${stateClassName}, subscriptionPaused: ${subscriptionPaused}, sendBet: ${sendBet}`);

    if (!subscriptionPaused) {
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