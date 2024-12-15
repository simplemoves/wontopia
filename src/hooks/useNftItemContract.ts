import { Address, toNano } from "@ton/core";
import { useCallback, useMemo } from "react";
import { useTonConnect } from "./useTonConnect.ts";
import { wonTonClientProvider } from "../providers/WonTonClientProvider.ts";
import { WonTonNftItemContract } from "../wrappers/WonTonNftItemContract.ts";
import { tryNTimes } from "../lib/PromisUtils.ts";
import { NftItemData } from "../lib/Types.ts";

export function useNftItemContract(nftItem: Address) {
    const contract = useMemo<WonTonNftItemContract>(() => WonTonNftItemContract.createFromAddress(nftItem), [ nftItem ]);
    const { sender } = useTonConnect();

    const openContract = useCallback(async (contract: WonTonNftItemContract) => {
        const client = await wonTonClientProvider.wonTonClient();
        return client.open(contract);
    }, [])

    const sendBetNft = useCallback<() => Promise<boolean|undefined>>(async () => {
        // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
        return tryNTimes(async () => {
            const openedContract = await openContract(contract);
            const queryId = new Date().getTime();
            return await openedContract
                .sendBetNft(sender, { queryId, value: toNano("0.05") })
                .then(() => true);
        }, 3, 100);
    }, [ contract, sender, openContract ]);

    const sendBurn = useCallback<() => Promise<boolean|undefined>>(async () => {
        // console.log(`calling sendBet for contract ${contract?.address.toString({ testOnly })}`);
        return tryNTimes(async () => {
            const openedContract = await openContract(contract);
            const queryId = new Date().getTime();
            return await openedContract
                .sendBurn(sender, { queryId, value: toNano("0.05") })
                .then(() => true);
        }, 3, 100);
    }, [ contract, sender, openContract ]);

    const getNftData = useCallback<() => Promise<NftItemData | undefined>>(async () => {
        // console.log(`calling getData for contract ${contract?.address.toString({ testOnly })}`);
        return tryNTimes(async () => {
            const openedContract = await openContract(contract);
            return await openedContract.getNftData();
        }, 3, 100);
    }, [ contract, openContract ]);

    return {
        contract,
        sendBetNft,
        sendBurn,
        getNftData,
    };
}