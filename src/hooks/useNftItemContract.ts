import { Address, toNano } from "@ton/core";
import { useCallback, useMemo } from "react";
import { useTonConnect } from "./useTonConnect.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { WonTonNftItemContract } from "../wrappers/WonTonNftItemContract.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";

export function useNftItemContract(nftItem: Address) {
    const contract = useMemo<WonTonNftItemContract>(() => WonTonNftItemContract.createFromAddress(nftItem), [ nftItem ]);
    const { sender } = useTonConnect();

    const openContract = useCallback(async (contract: WonTonNftItemContract) => {
        const client = await wonTonClientProvider.wonTonClient();
        return client.open(contract);
    }, [])

    const sendBurn = useCallback<() => Promise<boolean>>(async (): Promise<boolean> => {
        const client = await wonTonClientProvider.wonTonClient();
        const openedContract = client.open(contract);
        const success = await tryNTimes(async () => {
            const queryId = new Date().getTime();
            return await openedContract.sendBurn(sender, { queryId, value: toNano("0.05") });
        }, 3, 100);

        return success ?? false;
    }, [ contract, sender, openContract ]);

    return {
        sendBurn,
    };
}