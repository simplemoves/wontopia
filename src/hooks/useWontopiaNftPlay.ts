import { toNano } from "@ton/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTonConnect } from "./useTonConnect.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";
import { activePlayStates, BEUniverses, Nft, PlayStateEventsHolder, UNKNOWN } from "../lib/Types.ts";
import { useSubscription } from "urql";
import { playStateSubscriptionResultHandler, playStatusSubscriptionQuery } from "../lib/WontopiaGraphQL.ts";
import { useWontopiaStore } from "../store/WontopiaStore.ts";
import { useNftWatcher } from "./useNftWatcher.ts";
import { WonTonNftItemContract } from "../wrappers/WonTonNftItemContract.ts";

export function useWontopiaNftPlay(nft: Nft|undefined, universes: BEUniverses, walletAddressStr: string) {
    const { startGame, stopGame, getGameState, markNftAsBet } = useWontopiaStore(walletAddressStr)();
    const { handleUpdate } = useNftWatcher(walletAddressStr, universes);
    const { sender } = useTonConnect();
    const nftContract = useMemo(() => { return nft ? WonTonNftItemContract.createFromAddressStr(nft.nft_address) : undefined }, [ nft?.nft_address ]);

    const [ playState, setPlayState ] = useState<PlayStateEventsHolder | undefined>();
    const [ requested, setRequested ] = useState<boolean>(false);
    const [ paused, setPaused ] = useState<boolean>(false);
    const [ startedAt, setStartedAt ] = useState(getGameState(universes.wonTonPower).startedAt ?? new Date())

    // Run every time universes, walletAddress parameters change, to get the current play state of the wallet
    useEffect(() => {
        setPlayState(undefined);
        setPaused(false);
        setRequested(false);
        handleUpdate()
    }, [ universes, walletAddressStr ]);

    const handlePlayStateSubscriptionResult = useCallback(playStateSubscriptionResultHandler, []);
    const [ { data } ] = useSubscription({
        query: playStatusSubscriptionQuery,
        variables: {
            walletAddressStr: walletAddressStr,
            power: universes.wonTonPower,
            startedAt: startedAt.toISOString(),
        },
        pause: paused,
    }, handlePlayStateSubscriptionResult);

    useEffect(() => {
        if (data) {
            setPlayState(data);
        }
    }, [ data, setPlayState ]);

    useEffect(() => {
        if (playState?.last_event.state == UNKNOWN && !requested) {
            setPaused(true);
            return;
        }

        if (!playState) {
            return;
        }

        if ((playState?.last_event.state == "WIN" || playState?.last_event.state == "LOOSE") && requested) {
            handleUpdate()
        }

        const needToPause = !activePlayStates[playState.last_event.state];
        setPaused(needToPause);
        if (needToPause) {
            setRequested(false);
        }
    }, [ playState, requested, setPaused, setRequested ]);

    useEffect(() => {
        if (paused) {
            stopGame(universes.wonTonPower)
        }
    }, [ paused, universes.wonTonPower, stopGame ]);

    const sendNftBet = useCallback(async () => {
        if (nftContract && nft) {
            // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
            const client = await wonTonClientProvider.wonTonClient();
            const openedContract = client.open(nftContract);
            const success = await tryNTimes(async () => {
                const queryId = new Date().getTime();
                return await openedContract.sendBetNft(sender, { queryId, value: toNano("0.05") })
            }, 3, 100);
            const isRequested = success ?? false;
            setRequested(isRequested);
            setPaused(!isRequested);
            setPlayState(undefined);
            if (isRequested) {
                const { startedAt } = startGame(universes.wonTonPower);
                setStartedAt(startedAt ?? new Date());
                markNftAsBet(nft);
            } else {
                stopGame(universes.wonTonPower);
                setStartedAt(new Date());
            }
        } else {
            console.error("Nft Contract is not ready...");
        }
    }, [ nft, nftContract, sender, universes.wonTonPower, setRequested, setPaused, startGame, stopGame, setStartedAt, markNftAsBet ]);

    return {
        sendNftBet,
        playState,
        paused,
        startedAt,
    };
}