import './PlayButton.css';
import { Button } from "antd";
import { BEUniverses, playStateDescriptions } from "./lib/Types.ts";
import { useEffect, useMemo } from "react";
import { useWontopiaPlay } from "./hooks/useWontopiaPlay.ts";
import { useGameStore } from "./store/GameStore.ts";

export function PlayButton({ universes, walletAddressStr }: { universes: BEUniverses, walletAddressStr: string }) {
    const { sendBet, playState, paused } = useWontopiaPlay(universes, walletAddressStr);
    const [ statusDescription, className ] = useMemo(() => playStateDescriptions(playState?.event.state), [ playState?.event.state ])
    const { setDelayed, setPaused, setPlayersToWait, setState } = useGameStore(walletAddressStr, universes.wonTonPower)();

    useEffect(() => {
        let isDelayed = false;
        if (!paused) {
            const prev = playState?.event.stateChangedAt.getTime();
            isDelayed = !!(prev && ((Date.now() - prev) > 1000 * 25));
        }

        setPaused(paused);
        setDelayed(isDelayed);
        setPlayersToWait(playState?.players_to_wait ?? 3);
        setState(playState?.event.state ?? 'UNKNOWN');
    }, [ playState, paused, setDelayed, setPaused, setPlayersToWait, setState ]);

    if (!paused) {
        return <div className={className}><div className="content">{statusDescription}</div></div>
    }

    return <Button
        color="default"
        variant="solid"
        shape="round"
        onClick={sendBet}
        style={{ color: 'var(--primary-color)' }}
        className="play-button">
        Let's Play!
    </Button>
}