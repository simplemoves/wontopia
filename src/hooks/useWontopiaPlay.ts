import { Address, toNano } from "@ton/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTonConnect } from "./useTonConnect.ts";
import { WonTonContract } from "../wrappers/WonTonContract.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";
import { activePlayStates, BEUniverses, PlayStateEventsHolder, UNKNOWN } from "../lib/Types.ts";
import { useSubscription } from "urql";
import { playStateSubscriptionResultHandler, playStatusSubscriptionQuery } from "../lib/WontopiaGraphQL.ts";
import { testOnly } from "../lib/Constants.ts";
import { useWontopiaStore } from "../store/WontopiaStore.ts";

export function useWontopiaPlay(universes: BEUniverses, walletAddress: Address) {
  console.log(`useWontopiaPlay updated`);
  const { startGame, stopGame, getGameState } = useWontopiaStore();
  const { sender } = useTonConnect();
  const walletAddressStr = useMemo(() => { return walletAddress.toString({ testOnly }) }, [walletAddress])
  const wContract = useMemo(() => { return WonTonContract.createFromAddress(universes.wonTon) }, [ universes.wonTon ]);

  const [ playState, setPlayState ] = useState<PlayStateEventsHolder|undefined>();
  const [ requested, setRequested ] = useState<boolean>(false);
  const [ paused, setPaused ] = useState<boolean>(false);
  const [ startedAt, setStartedAt ] = useState(getGameState(walletAddressStr).startedAt ?? new Date())

  console.log(`Started at stored: ${getGameState(walletAddressStr).startedAt}`);
  console.log(`Started at stored type: ${typeof  getGameState(walletAddressStr).startedAt}`);
  console.log(`Started at: ${startedAt}`);
  // Run every time universes, walletAddress parameters change, to get the current play state of the wallet
  useEffect(() => {
    setPlayState(undefined);
    setPaused(false);
    setRequested(false);
  }, [universes, walletAddress]);

  const handlePlayStateSubscriptionResult = useCallback(playStateSubscriptionResultHandler, []);
  const [{data}] = useSubscription({
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
  }, [data, setPlayState]);

  useEffect(() => {
    if (playState?.last_event.state == UNKNOWN && !requested) {
      setPaused(true);
      return;
    }

    if (!playState) {
      return;
    }

    const needToPause = !activePlayStates[playState.last_event.state];
    setPaused(needToPause);
    if (needToPause) {
      setRequested(false);
    }
  }, [playState, requested, setPaused, setRequested]);

  useEffect(() => {
    if (paused) {
      stopGame(walletAddressStr)
    }
  }, [paused, walletAddressStr, stopGame]);

  const sendBet = useCallback(async () => {
    // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
    const client = await wonTonClientProvider.wonTonClient();
    const openedContract = client.open(wContract);
    const success = await tryNTimes(async () => {
      const queryId = new Date().getTime();
      return await openedContract.sendBet(sender, { queryId, value: toNano("1.0"), provided_wonton_power: 0 })
    }, 3, 100);
    const isRequested = success ?? false;
    setRequested(isRequested);
    setPaused(!isRequested);
    setPlayState(undefined);
    if (isRequested) {
      const { startedAt } = startGame(walletAddressStr);
      setStartedAt(startedAt ?? new Date());
    } else {
      stopGame(walletAddressStr);
      setStartedAt(new Date());
    }
  }, [ wContract, sender, walletAddressStr, setRequested, setPaused, startGame, stopGame, setStartedAt ]);

  return {
    sendBet,
    playState,
    paused,
    startedAt
  };
}