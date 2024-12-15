import { Address, Sender, SenderArguments } from "@ton/core";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { tonAddress } from "../lib/TonUtils";
import { useEffect, useState } from "react";

export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    walletAddress: Address | undefined,
} {
    const [ tonConnectUI ] = useTonConnectUI();
    const wallet = useTonAddress();
    const [ walletAddress, setWalletAddress ] = useState(tonAddress(wallet));

    useEffect(() => {
        setWalletAddress(tonAddress(wallet));
    }, [ wallet ])

    return {
        sender: {
            send: async (args: SenderArguments) => {
                await tonConnectUI.sendTransaction({
                                                 messages: [
                                                     {
                                                         address: args.to.toString(),
                                                         amount: args.value.toString(),
                                                         payload: args.body?.toBoc().toString("base64"),
                                                     },
                                                 ],
                                                 validUntil: Date.now() + 5 * 60 * 1000,
                                             });
            },
        },
        connected: tonConnectUI.connected,
        walletAddress,
    }
}