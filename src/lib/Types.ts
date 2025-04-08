import { Address, Sender } from '@ton/core';
import { z } from 'zod';
import { CombinedError } from "urql";

export const WIN = "WIN";
export const LOOSE = "LOOSE";
export const CollectionTypeSchema = z.union([
    z.literal(WIN),
    z.literal(LOOSE),
]);

export const UNKNOWN = "UNKNOWN";
export const REQUESTED = "REQUESTED";
export const REJECTED = "REJECTED";
export const IN_PLAY = "IN_PLAY";
export const OUT_PLAY = "OUT_PLAY";
export const ERROR = "ERROR";
export const TIMEOUT = "TIMEOUT";
export const PlayStateSchema = z.union([
    z.literal(UNKNOWN),
    z.literal(REQUESTED),
    z.literal(REJECTED),
    z.literal(IN_PLAY),
    z.literal(OUT_PLAY),
    z.literal(WIN),
    z.literal(LOOSE),
    z.literal(ERROR),
    z.literal(TIMEOUT),
]);

export const NOT_VALIDATED = "NOT_VALIDATED"
export const NOT_INITED = "NOT_INITED"
export const MINTED = "MINTED"
export const BURNED = "BURNED"

export const NftStatusSchema = z.union([
    z.literal(NOT_VALIDATED),
    z.literal(NOT_INITED),
    z.literal(MINTED),
    z.literal(BURNED),
]);

export const NFT = "NFT";
export const NON_NFT = "NON_NFT";
export const NON_MY_NFT = "NON_MY_NFT";
export const NFT_BET_REQUEST = "NFT_BET_REQUEST";
export const NFT_BURN_REQUEST = "NFT_BURN_REQUEST";
export const SetNftTypeSchema = z.union([
    z.literal(NFT_BET_REQUEST),
    z.literal(NFT_BURN_REQUEST),
])
export const NftTypeSchema = z.union([
    z.literal(NFT),
    z.literal(NON_NFT),
    z.literal(NON_MY_NFT),
    z.literal(NFT_BET_REQUEST),
    z.literal(NFT_BURN_REQUEST),
]);

export const FOUND = "FOUND";
export const PROCESSED = "PROCESSED";
export const TransactionHistoryItemStateSchema = z.union([
    z.literal(FOUND),
    z.literal(PROCESSED),
]);

export const NONEXIST = "nonexist";
export const UNINITIALIZED = "uninitialized";
export const ACTIVE = "active";
export const FROZEN = "frozen";
export const SmartContractStatusSchema = z.union([
    z.literal(NONEXIST),
    z.literal(UNINITIALIZED),
    z.literal(ACTIVE),
    z.literal(FROZEN),
]);

export const NftStateSchema = z.object({
    type: NftTypeSchema,
    updated_at: z.string().date(),
});

export const NonNftSchema = z.object({
    state: NftStateSchema,
});

export const NftMetaAttributesSchama = z.object({
    trait_type: z.string(),
    value: z.string(),
});

export const NftMetaSchema = z.object({
    name: z.string(),
    image: z.string().url(),
    description: z.string(),
    attributes: z.array(NftMetaAttributesSchama),
});

export const NftSchema = z.object({
    state: NftStateSchema,
    nft_address: z.string().min(1),
    owner_address: z.string().min(1),
    nft_index: z.number().min(0),
    collection_type: CollectionTypeSchema,
    wonton_power: z.number().min(0),
    created_at: z.string().datetime(),
    nft_meta: NftMetaSchema.optional(),
});

export const GetNftDataSchema = z.object({
    inited: z.boolean(),
    index: z.number().min(1),
    collection: z.custom<Address>(),
    owner: z.custom<Address>(),
});

export const FeGetNftDataSchema = z.object({
    getNftData: GetNftDataSchema.optional(),
});

export const BEUniverseSchema = z.object({
    collection: z.custom<Address>(),
});

export const BEUniversesSchema = z.object({
    wonTon: z.custom<Address>(),
    wonTonPower: z.number().min(0),
    winUniverse: BEUniverseSchema,
    looseUniverse: BEUniverseSchema,
    prize: z.bigint(),
});

export const CollectionInfoSchema = z.object({
    wonTonPower: z.number().min(0),
    cType: CollectionTypeSchema,
});

export const UniversesPrizesItemSchema = z.object({
    key: z.string(),
    universe: z.number().min(0),
    prize: z.number().min(0),
});

export const NftItemDataSchema = z.object({
    is_active: z.boolean(),
    index: z.number().min(1),
    collection_address: z.custom<Address>().nullable(),
    owner_address: z.custom<Address>().nullable(),
    content: z.string().min(1),
});

export const NftItemWontonDataSchema = z.object({
    is_active: z.boolean(),
    balance: z.bigint(),
    wonton_power: z.number().min(1),
});

export const BEUniversesHolderSchema = z.record(z.number(), BEUniversesSchema);
export const ContractSetSchema = z.record(z.string(), CollectionInfoSchema);
export const UniversesPrizesSchema = z.array(UniversesPrizesItemSchema);

export const FEUniversesHolderSchema = z.object({
    universesHolder: BEUniversesHolderSchema,
    collections: ContractSetSchema,
    universesPrizes: UniversesPrizesSchema,
});

export const TonClientParametersSchema = z.object({
    endpoint: z.string(),
    timeout: z.number().optional(),
    apiKey: z.string().optional(),
});

export const TonClientParametersOptSchema = TonClientParametersSchema.partial();

export const RunningSchema = z.record(z.string(), z.boolean());
export const NftsHistorySchema = z.record(z.string(), NftSchema);

export const SimpleTransactionHistoryItemSchema = z.object({
    hash: z.string(),
    lt: z.bigint(),
    now: z.number(),
    state: TransactionHistoryItemStateSchema,
});

export const SimpleTransactionHistorySchema = z.record(z.string(), SimpleTransactionHistoryItemSchema);

export const NftItemContentResponseSchema = z.object({
    uri: z.string(), //"https://simplemoves.github.io/wontopia-nft/LOOSE/1/meta-1.json"
})

export const NftItemResponseSchema = z.object({
    address: z.string(),
    init: z.boolean(),
    index: z.number(),
    collection_address: z.string(),
    owner_address: z.string(),
    content: NftItemContentResponseSchema,
});

export const NftItemsResponseSchema = z.object({
    nft_items: NftItemResponseSchema.array(),
});

export const AddressInformationResponseSchema = z.object({
    balance: z.number(),
    code: z.string().optional(),
    data: z.string().optional(),
    last_transaction_lt: z.string(),
    last_transaction_hash: z.string(),
    frozen_hash: z.string().optional(),
    status: SmartContractStatusSchema,
});

export const PlayStateEventNftSchema = z.object({
    address: z.string(),
    index: z.number(),
    ownerAddress: z.string(),
    collectionType: CollectionTypeSchema,
    power: z.number(),
    metaUrl: z.string(),
    status: NftStatusSchema,
    mintedAt: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date(),
    ),
});

export const PlayStateEventSchema = z.object({
    id: z.string().optional(),
    state: PlayStateSchema,
    playersToWait: z.number().optional(),
    nft: PlayStateEventNftSchema.optional(),
    stateChangedAt: z.string().optional(),
});

export const PlayStateEventsHolderSchema = z.object({
    event: PlayStateEventSchema,
    started_at: z.date().optional(),
    players_to_wait: z.number(),
});

export const PlayStateSubscriptionResultSchema = z.object({
    playState: PlayStateEventSchema,
});

export const NftsVariablesSchema = z.object({
    walletAddressStr: z.string(),
    power: z.number(),
    collectionTypes: CollectionTypeSchema.array().optional(),
    statuses: NftStatusSchema.array().optional(),
});

export const NftsResultSchema = z.object({
    nfts: PlayStateEventNftSchema.array(),
});

export const GameSchema = z.object({
    state: PlayStateSchema,
    playersToWait: z.number(),
    isPaused: z.boolean(),
    isDelayed: z.boolean(),
})

export const GetGameStateFunctionSchema = z.function().args().returns(PlayStateSchema);
export const StartGameFunctionSchema = z.function().args().returns(z.void());
export const StopGameFunctionSchema = z.function().args().returns(z.void());
export const IsRunningFunctionSchema = z.function().args().returns(z.boolean());
export const SetNftStateFunctionSchema = z.function().args(z.string(), SetNftTypeSchema).returns(z.void());
export const MarkNftAsBurnedFunctionSchema = z.function().args(z.string()).returns(z.void());
export const MarkNftAsBetFunctionSchema = z.function().args(z.union([z.string(), z.undefined()])).returns(z.void());
export const GetNftsFunctionSchema = z.function().args().returns(NftSchema.array());
export const AddNftFunctionSchema = z.function().args(NftSchema).returns(z.void());
export const GameStateHandlerFunctionSchema = z.function().args(PlayStateSubscriptionResultSchema, z.union([z.custom<CombinedError>(), z.undefined()])).returns(z.void());
export const ClearStorageFunctionSchema = z.function().args().returns(z.void());
export const StorageIsEmptyFunctionSchema = z.function().args().returns(z.boolean());
export const StartNftsRequestFunctionSchema = z.function().args().returns(z.void());
export const StopNftsRequestFunctionSchema = z.function().args().returns(z.void());
export const HandleUpdateFunctionSchema = z.function().args().returns(z.void());
export const StartSubscriptionFunctionSchema = z.function().args().returns(z.void());
export const SendBetFunctionSchema = z.function().args(z.custom<Sender>(), z.custom<Address>()).returns(z.promise(z.void()));
export const SendBurnFunctionSchema = z.function().args(z.custom<Sender>(), z.string()).returns(z.promise(z.void()));
export const SendBetNftFunctionSchema = z.function().args(z.custom<Sender>(), z.union([z.string(), z.undefined()])).returns(z.promise(z.boolean()));
// export const GetFilteredNftsFunctionSchema = z.function().args(CollectionTypeSchema).returns(NftSchema.array());
// export const GetWinNftsFunctionSchema = z.function().args().returns(NftSchema.array());
// export const GetLooseNftsFunctionSchema = z.function().args().returns(NftSchema.array());

export const NftStoreSchema = z.object({
    walletAddress: z.string(),
    power: z.number(),
    nfts: NftsHistorySchema,
    winNfts: NftsHistorySchema,
    looseNfts: NftsHistorySchema,

    isNftsRequestInProgress: z.boolean(),

    startSubscription: StartSubscriptionFunctionSchema,
    subscriptionPaused: z.boolean(),
    gameIsRunning: z.boolean(),
    isGameTakingTooLong: z.boolean(),
    state: PlayStateSchema,
    playersToWait: z.number(),
    startedAt: z.string().optional(),
    stateChangedAt: z.string().optional(),

    startGame: StartGameFunctionSchema,
    stopGame: StopGameFunctionSchema,

    setNftState: SetNftStateFunctionSchema,
    markNftAsBurned: MarkNftAsBurnedFunctionSchema,
    markNftAsBet: MarkNftAsBetFunctionSchema,
    addNft: AddNftFunctionSchema,
    // getFilteredNfts: GetFilteredNftsFunctionSchema,
    // getWinNfts: GetWinNftsFunctionSchema,
    // getLooseNfts: GetLooseNftsFunctionSchema,

    clearStorage: ClearStorageFunctionSchema,
    storageIsEmpty: StorageIsEmptyFunctionSchema,

    gameStateHandler: GameStateHandlerFunctionSchema,

    startNftsRequest: StartNftsRequestFunctionSchema,
    stopNftsRequest: StopNftsRequestFunctionSchema,

    handleUpdate: HandleUpdateFunctionSchema,

    sendBet: SendBetFunctionSchema,
    sendBurn: SendBurnFunctionSchema,
    sendBetNft: SendBetNftFunctionSchema,
});

////////////////////////////////
// Types infering and exporting
////////////////////////////////
export type FEUniversesHolder = z.infer<typeof FEUniversesHolderSchema>;
export type BEUniverses = z.infer<typeof BEUniversesSchema>;
export type CollectionType = z.infer<typeof CollectionTypeSchema>;
export type Nft = z.infer<typeof NftSchema>;
export type NftsHistory = z.infer<typeof NftsHistorySchema>;
export type NftStore = z.infer<typeof NftStoreSchema>;
export type CollectionInfo = z.infer<typeof CollectionInfoSchema>;
export type GetNftData = z.infer<typeof GetNftDataSchema>;
export type FeGetNftData = z.infer<typeof FeGetNftDataSchema>;
export type NonNft = z.infer<typeof NonNftSchema>;
export type NftMeta = z.infer<typeof NftMetaSchema>;
export type TonClientParametersOpt = z.infer<typeof TonClientParametersOptSchema>;
export type UniversesPrizesItem = z.infer<typeof UniversesPrizesItemSchema>;
export type NftItemData = z.infer<typeof NftItemDataSchema>;
export type NftItemWontonData = z.infer<typeof NftItemWontonDataSchema>;
export type NftMetaAttributes = z.infer<typeof NftMetaAttributesSchama>;
export type NftItemsResponse = z.infer<typeof NftItemsResponseSchema>;
export type NftItemResponse = z.infer<typeof NftItemResponseSchema>;
export type AddressInformationResponse = z.infer<typeof AddressInformationResponseSchema>;
export type PlayStateSubscriptionResult = z.infer<typeof PlayStateSubscriptionResultSchema>;
export type PlayStateEventsHolder = z.infer<typeof PlayStateEventsHolderSchema>;
export type NftsVariables = z.infer<typeof NftsVariablesSchema>;
export type NftsResult = z.infer<typeof NftsResultSchema>;
export type PlayState = z.infer<typeof PlayStateSchema>;
export type Game = z.infer<typeof GameSchema>;
export type SetNftType = z.infer<typeof SetNftTypeSchema>;

export const INITIAL_GAME: Game = {
    state: 'UNKNOWN',
    playersToWait: 3,
    isPaused: true,
    isDelayed: false,
}
export const NOT_NFT: NonNft = { state: { type: 'NON_NFT', updated_at: new Date().getTime().toString() } };

////////////////////////////////
// Function helpers
////////////////////////////////
export const activePlayStates: Record<PlayState, boolean> = {
    UNKNOWN: true,
    REQUESTED: true,
    REJECTED: false,
    IN_PLAY: true,
    OUT_PLAY: true,
    WIN: false,
    LOOSE: false,
    ERROR: false,
    TIMEOUT: false,
}

export const playStateDescriptions = (ps: PlayState | undefined): [ string, string ] => {
    switch (ps) {
        case undefined:
            return [ "Getting Game Status...", "status-get" ]
        case UNKNOWN:
            return [ "Getting Game Status...", "status-unknown" ]
        case IN_PLAY:
            return [ "You Are In Game", "status-in-play" ]
        case OUT_PLAY:
            return [ "Your Game Played", "status-out-play" ]
        default:
            return [ "Game Finished", "status-finished" ]
    }
}

export const isNft = (nft: Nft | NonNft): nft is Nft => {
    return !!nft && nft.state.type == NFT;
}

export const isNftData = (nftData: GetNftData | undefined): nftData is GetNftData => {
    return nftData != undefined;
}

export const collectionTypeCaptions = {
    [WIN]: "Winning Collection",
    [LOOSE]: "Loosing Collection",
}

export const mapResponseToNfts = (nftItems: NftItemResponse[], cType: CollectionType, wontonPower: number, nftMeta: NftMeta): Nft[] => {
    return nftItems.map((nftItem) => mapResponseToNft(nftItem, cType, wontonPower, nftMeta));
}

export const mapResponseToNft = (nftItem: NftItemResponse, cType: CollectionType, wontonPower: number, nftMeta: NftMeta): Nft => {
    return {
        state: {
            type: 'NFT',
            updated_at: new Date().getTime().toString(),
        },
        nft_address: nftItem.address,
        owner_address: nftItem.owner_address,
        nft_index: nftItem.index,
        collection_type: cType,
        wonton_power: wontonPower,
        nft_meta: nftMeta,
        created_at: new Date().getTime().toString(),
    };
}

export const createNftIndex = (cType: CollectionType, wontonPower: number, nftIndex: number) => `${cType}:${wontonPower}:${nftIndex}`;