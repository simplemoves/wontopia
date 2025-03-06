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

export function useWontopiaPlay(universes: BEUniverses, walletAddress: Address) {
  const wContract = useMemo(() => { return WonTonContract.createFromAddress(universes.wonTon) }, [ universes.wonTon ]);

  const { sender } = useTonConnect();
  const [ playState, setPlayState ] = useState<PlayStateEventsHolder|undefined>();
  const [ requested, setRequested ] = useState<boolean>(false);
  const [ paused, setPaused ] = useState<boolean>(false);

  const handlePlayStateSubscriptionResult = useCallback(playStateSubscriptionResultHandler, []);
  const [{data}] = useSubscription({
    query: playStatusSubscriptionQuery,
    variables: {
      walletAddressStr: walletAddress.toString({ testOnly: testOnly }),
      power: universes.wonTonPower,
      startedAt: Date.now(),
    },
    pause: paused,
  }, handlePlayStateSubscriptionResult);

  useEffect(() => {
    if (data?.last_event?.state) {
      const newPlayState = data?.last_event?.state;
      setPlayState(data);
      const needToPause = !activePlayStates[newPlayState];
      setPaused(needToPause);

      if (needToPause) {
        setRequested(false);
      }
    }
  }, [data, setPaused, setRequested, setPlayState]);

  useEffect(() => {
    if (playState?.last_event.state == UNKNOWN && !requested) {
      setPaused(true);
      return;
    }

  }, [playState, requested]);

  // Run every time universes, walletAddress parameters change, to get the current play state of the wallet
  useEffect(() => {
    setPlayState(undefined);
    setPaused(false);
    setRequested(false);
  }, [ universes, walletAddress, setPlayState, setPaused, setRequested ]);

  const sendBet = useCallback(async () => {
    // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
    setRequested(false);
    const client = await wonTonClientProvider.wonTonClient();
    const openedContract = client.open(wContract);
    const success = await tryNTimes(async () => {
      const queryId = new Date().getTime();
      return await openedContract.sendBet(sender, { queryId, value: toNano("1.0"), provided_wonton_power: 0 })
    }, 3, 100);
    const isRequested = success ?? false;
    setRequested(isRequested);
    setPaused(!isRequested);
  }, [ wContract, sender, setRequested, setPaused ]);

  return {
    sendBet,
    playState,
    paused,
  };
}