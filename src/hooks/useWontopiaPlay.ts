import { useEffect, useMemo } from "react";
import { BEUniverses, playStateDescriptions } from "../lib/Types.ts";
import { useSubscription } from "urql";
import { playStatusSubscriptionQuery } from "../lib/WontopiaGraphQL.ts";
import { useWontopiaStore } from "../store/WontopiaStore.ts";

export function useWontopiaPlay(universes: BEUniverses, walletAddressStr: string) {
    const startSubscription = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.startSubscription);
    const subscriptionPaused = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.subscriptionPaused);
    const state = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.state);
    const startedAt = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.startedAt);
    const gameStateHandler = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.gameStateHandler);
    const handleUpdate = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.handleUpdate);
    const sendBet = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBet);
    const sendBetNft = useWontopiaStore(walletAddressStr, universes.wonTonPower)(s => s.sendBetNft);

    const [ stateDescription, stateClassName ] = useMemo(() => playStateDescriptions(state), [ state ]);
    const startedAtMemoized = useMemo(() => startedAt ?? new Date().toISOString(), [startedAt]);

    // Run every time universes, walletAddress parameters change, to get the current play state of the wallet
    useEffect(() => {
        console.log(`useWontopiaPlay installed for: ${walletAddressStr}, universe: ${universes.wonTonPower}`);
        startSubscription();
        handleUpdate();
    }, []);

    console.log(`subscriptionPaused: ${subscriptionPaused}`);

    const [{ data, error}] = useSubscription({
        query: playStatusSubscriptionQuery,
        variables: {
            walletAddressStr: walletAddressStr,
            power: universes.wonTonPower,
            startedAt: startedAtMemoized,
        },
        pause: subscriptionPaused,
    });

    useEffect(() => { gameStateHandler(data, error); }, [data, error, gameStateHandler]);

    return {
        sendBet,
        sendBetNft,
        subscriptionPaused,
        stateDescription,
        stateClassName
    };
}