import { useEffect, useMemo } from "react";
import { BEUniverses, GameStateLog, playStateDescriptions } from "../lib/Types.ts";
import { useWontopiaStore } from "../store/WontopiaStore.ts";

export function useWontopiaPlay(universes: BEUniverses, gameStateLog: GameStateLog, walletAddressStr: string) {
    const handleUpdate = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.handleUpdate);
    const sendBet = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBet);
    const sendBetNft = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBetNft);

    const [ stateDescription, stateClassName ] = useMemo(() => playStateDescriptions(gameStateLog.after.state), [ gameStateLog.after.state ]);

    useEffect(() => {
        if (gameStateLog.before.state !== gameStateLog.after.state && (gameStateLog.after.state === 'WIN' || gameStateLog.after.state === 'LOOSE') ) {
            // NFT Request
            handleUpdate();
        }
    }, [ gameStateLog ]);

    // console.log(`subscriptionPaused: ${subscriptionPaused}`);

    // const [{ data, error}] = useSubscription({
    //     query: playStatusSubscriptionQuery,
    //     variables: {
    //         walletAddressStr: walletAddressStr,
    //         power: universes.wonTonPower,
    //         startedAt: startedAtMemoized,
    //     },
    //     pause: true,
    //     // pause: subscriptionPaused,
    // });
    //
    // useEffect(() => { gameStateHandler(data, error); }, [data, error, gameStateHandler]);

    return {
        sendBet,
        sendBetNft,
        stateDescription,
        stateClassName
    };
}