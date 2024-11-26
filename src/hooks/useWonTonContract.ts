import { Address, toNano } from "@ton/core";
import { useCallback, useMemo } from "react";
import { useTonConnect } from "./useTonConnect.ts";
import { WonTonContract } from "../wrappers/WonTonContract.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";

export function useWonTonContract(wontonAddress: Address) {
    const contract = useMemo<WonTonContract>(() => WonTonContract.createFromAddress(wontonAddress), [ wontonAddress ]);
    const { sender } = useTonConnect();

    const openContract = useCallback(async (contract: WonTonContract) => {
        const client = await wonTonClientProvider.wonTonClient();
        return client.open(contract);
    }, [])

    const sendBet = useCallback<() => Promise<void>>(async () => {
        // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
        return tryNTimes(async () => {
            const openedContract = await openContract(contract);
            const queryId = new Date().getTime();
            return await openedContract.sendBet(sender, { queryId, value: toNano("1.0"), provided_wonton_power: 0 });
        }, 3, 100);
    }, [ contract, sender ]);

    return {
        contract,
        sendBet,
    };
}