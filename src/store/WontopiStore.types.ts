import { Address, Sender } from "@ton/core";
import { Nft, NftsHistory, PlayState, SetNftType, UserGameEvent } from "../lib/Types.ts";

export type NftStore = {
    walletAddress: string,
    power: number,
    nfts: NftsHistory,
    winNfts: NftsHistory,
    looseNfts: NftsHistory,

    isNftsRequestInProgress: boolean,

    gameIsRunning: boolean,
    isGameTakingTooLong: boolean,
    state: PlayState,
    startedAt?: string | undefined,
    stateChangedAt?: string | undefined,

    startGame: () => void,
    continueGame: () => void,
    stopGame: () => void,

    setNftState: (nft_address: string, newState: SetNftType) => void,
    markNftAsBurned: (nft_address: string) => void,
    markNftAsBet: (nft_address: string | undefined) => void,
    addNft: (nft: Nft) => void,

    clearStorage: () => void,
    storageIsEmpty: () => boolean,

    gameStateHandler: (event: UserGameEvent) => void,

    startNftsRequest: () => void,
    stopNftsRequest: () => void,

    handleUpdate: (postpone?: number) => void,

    sendBet: (sender: Sender, wallet: Address) => Promise<boolean>,
    sendBurn: (sender: Sender, walletStr: string) => Promise<void>,
    sendBetNft: (sender: Sender, walletStr: string | undefined) => Promise<boolean>,
}