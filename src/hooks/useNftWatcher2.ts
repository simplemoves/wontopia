import { useCallback, useState } from "react";
import { Address } from "@ton/core";
import { useNftsStore } from "../store/NftsStore.ts";
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { BEUniverses } from "../lib/Types.ts";

export function useNftWatcher2(walletAddress: Address | undefined, universes: BEUniverses) {
    const nftStore = useNftsStore();
    const [ running, setRunning ] = useState(false);

    const handleUpdate = useCallback(() => {
        const poll = async () => {
            if (walletAddress) {
                setRunning(() => true);
                try {
                    console.log(`${new Date().getTime()} | Polling nfts... ${running}`);
                    await nftStore.pollNft(walletAddress, universes);
                    console.log(`${new Date().getTime()} | Finished polling nfts, and updating owners...`);
                    setRunning(() => false);
                } catch (error) {
                    console.error(`${new Date().getTime()} | Polling nfts failed with error: ${getErrorMessage(error)}`);
                    setRunning(() => false);
                }
            } else {
                console.log("No wallet address provided yet");
            }                
        }

        if (running) {
            console.log(`${new Date().getTime()} | Polling nfts is in progress...`);
            return;
        }

        poll();
    }, [ walletAddress, universes, nftStore, running, setRunning ]);

    return {
        handleUpdate,
        running
    }
}
