import { Address, ContractProvider, Sender } from '@ton/core';
import { z } from 'zod';

export const WIN = "WIN";
export const LOOSE = "LOOSE";
export const CollectionTypeSchema = z.union([
    z.literal(WIN),
    z.literal(LOOSE),
]);

export const NFT = "NFT";
export const NON_NFT = "NON_NFT";
export const NON_MY_NFT = "NON_MY_NFT";
export const NFT_BET_REQUEST = "NFT_BET_REQUEST";
export const NFT_BURN_REQUEST = "NFT_BURN_REQUEST";
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
  updated_at: z.string().date()
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

export const FeNftSchema = z.object({
  nft_address: z.string().min(1),
  owner_address: z.string().min(1),
  nft_index: z.number().min(0),
  collection_type: CollectionTypeSchema,
  wonton_power: z.number().min(0),
  nft_meta: z.string(),
});

export const GetNftDataSchema = z.object({
  inited: z.boolean(),
  index: z.number().min(1),
  collection: z.custom<Address>(),
  owner: z.custom<Address>(),
});

export const FeGetNftDataSchema = z.object({
  getNftData: GetNftDataSchema.optional()
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

export const NftItemDescriptionSchema = z.object({
  index: z.number(),
  cType: CollectionTypeSchema,
  wontonPower: z.number(),
  createdAt: z.string(),
  name: z.string(),
  description: z.string(),
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

export const SendDeployFunctionSchema =
                 z.function()
                  .args(
                      z.custom<ContractProvider>(),
                      z.custom<Sender>(),
                      z.bigint())
                  .returns(z.custom<Promise<void>>());

export const DeployableSchema = z.object({
  address: z.custom<Address>().readonly(),
  sendDeploy: SendDeployFunctionSchema,
});


export const TonClientParametersSchema = z.object({
  endpoint: z.string(),
  timeout: z.number().optional(),
  apiKey: z.string().optional(),
});

export const TonClientParametersOptSchema = TonClientParametersSchema.partial();

export const NftsHistorySchema = z.record(z.string(), NftSchema);

export const SimpleTransactionHistoryItemSchema = z.object({
  hash: z.string(),
  lt: z.bigint(),
  now: z.number(),
  state: TransactionHistoryItemStateSchema,
});

export const SimpleTransactionHistorySchema = z.record(z.string(), SimpleTransactionHistoryItemSchema);
export type SimpleTransactionHistory = z.infer<typeof SimpleTransactionHistorySchema>;

export const StoresSchema = z.object({
  newNft: NftSchema.optional(),
  nfts: NftsHistorySchema,
  transactions: SimpleTransactionHistorySchema,
})

export const NftItemContentResponseSchema = z.object({
  uri: z.string() //"https://simplemoves.github.io/wontopia-nft/LOOSE/1/meta-1.json"
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
  nft_items: NftItemResponseSchema.array()
});

export const AddressInformationResponseSchema = z.object({
  balance: z.number(),
  code: z.string().optional(),
  data: z.string().optional(),
  last_transaction_lt: z.string(),
  last_transaction_hash: z.string(),
  frozen_hash: z.string().optional(),
  status: SmartContractStatusSchema
});

export const StoreRegistrySchema = z.record(z.string(), StoresSchema);
export const GetStoreSchema = z.function().args(z.string()).returns(StoresSchema);
export const GetTransactionsSchema = z.function().args(z.string()).returns(SimpleTransactionHistorySchema);
export const IsTransactionProcessedSchema = z.function().args(z.string(), z.string()).returns(z.boolean());
export const AddTransactionFunctionSchema = z.function().args(z.string(), SimpleTransactionHistoryItemSchema).returns(z.void());
export const NftFilteringFunctionSchema = z.function().args(z.string(), CollectionInfoSchema, z.number()).returns(z.boolean());
export const AddNftFunctionSchema = z.function().args(z.string(), NftSchema).returns(z.void());
export const AddNftsFunctionSchema = z.function().args(z.string(), NftSchema.array()).returns(z.void());
export const DeleteNftFunctionSchema = z.function().args(z.string(), z.string()).returns(z.void());
export const MarkTransactionAsProcessedSchema = z.function().args(z.string(), z.string()).returns(z.void());
export const MarkNftAsNotMyNftSchema = z.function().args(z.string(), z.string(), z.custom<Address>()).returns(z.void());
export const MarkNftForBurnSchema = z.function().args(z.string(), NftSchema).returns(z.void());
export const MarkNftForBetSchema = z.function().args(z.string(), NftSchema).returns(z.void());
export const AnyNotProcessesTransactionsSchema = z.function().args(z.string()).returns(z.boolean());
export const PollFunctionSchema = z.function().args(z.custom<Address>()).returns(z.promise(z.void()));
export const PollNftFunctionSchema = z.function().args(z.custom<Address>(), BEUniversesSchema).returns(z.promise(z.void()));
export const UpdateNftOwnerFunctionSchema = z.function().args(z.custom<Address>()).returns(z.promise(z.void()));
export const FilteredNftsFunctionSchema = z.function().args(z.string(), CollectionTypeSchema, z.number()).returns(NftsHistorySchema);
export const NewNftFunctionSchema = z.function().args(z.string(), CollectionTypeSchema).returns(NftSchema.optional());
export const ClearStorageFunctionSchema = z.function().args().returns(z.void());
export const StorageIsEmptyFunctionSchema = z.function().args().returns(z.boolean());

export const NftStoreSchema = z.object({
  storesRegistry: StoreRegistrySchema,
  store: GetStoreSchema,
  transactions: GetTransactionsSchema,
  isTransactionProcessed: IsTransactionProcessedSchema,
  addTransaction: AddTransactionFunctionSchema,
  doesNftExists: NftFilteringFunctionSchema,
  addNft: AddNftFunctionSchema,
  addNfts: AddNftsFunctionSchema,
  deleteNft: DeleteNftFunctionSchema,
  markTransactionAsProcessed: MarkTransactionAsProcessedSchema,
  markNftAsNotMyNft: MarkNftAsNotMyNftSchema,
  markNftForBurn: MarkNftForBurnSchema,
  markNftForBet: MarkNftForBetSchema,
  anyNotProcessedTransactions: AnyNotProcessesTransactionsSchema,
  poll: PollFunctionSchema,
  pollNft: PollNftFunctionSchema,
  updateNftOwner: UpdateNftOwnerFunctionSchema,
  filteredNfts: FilteredNftsFunctionSchema,
  newNft: NewNftFunctionSchema,
  clearStorage: ClearStorageFunctionSchema,
  storageIsEmpty: StorageIsEmptyFunctionSchema
});

////////////////////////////////
// Types infering and exporting
////////////////////////////////
export type FEUniversesHolder = z.infer<typeof FEUniversesHolderSchema>;
export type BEUniverses = z.infer<typeof BEUniversesSchema>;
export type CollectionType = z.infer<typeof CollectionTypeSchema>;
export type Nft = z.infer<typeof NftSchema>;
export type FeNft = z.infer<typeof FeNftSchema>;
export type NftsHistory = z.infer<typeof NftsHistorySchema>;
export type NftStore = z.infer<typeof NftStoreSchema>;
export type Stores = z.infer<typeof StoresSchema>;
export type CollectionInfo = z.infer<typeof CollectionInfoSchema>;
export type GetNftData = z.infer<typeof GetNftDataSchema>;
export type FeGetNftData = z.infer<typeof FeGetNftDataSchema>;
export type NonNft = z.infer<typeof NonNftSchema>;
export type NftMeta = z.infer<typeof NftMetaSchema>;
export type TonClientParametersOpt = z.infer<typeof TonClientParametersOptSchema>;
export type Deployable = z.infer<typeof DeployableSchema>;
export type UniversesPrizesItem = z.infer<typeof UniversesPrizesItemSchema>;
export type NftItemDescription = z.infer<typeof NftItemDescriptionSchema>;
export type NftItemData = z.infer<typeof NftItemDataSchema>;
export type NftItemWontonData = z.infer<typeof NftItemWontonDataSchema>;
export type NftMetaAttributes = z.infer<typeof NftMetaAttributesSchama>;
export type NftItemsResponse = z.infer<typeof NftItemsResponseSchema>;
export type NftItemResponse = z.infer<typeof NftItemResponseSchema>;
export type AddressInformationResponse = z.infer<typeof AddressInformationResponseSchema>;
export type BEUniversesHolder = z.infer<typeof BEUniversesHolderSchema>;

export const NOT_NFT: NonNft = { state: { type: 'NON_NFT', updated_at: new Date().getTime().toString() } };

////////////////////////////////
// Function helpers
////////////////////////////////
export const isNft = (nft: Nft | NonNft): nft is Nft => {
  return !!nft && nft.state.type == NFT;
}

export const isNftData = (nftData: GetNftData|undefined): nftData is GetNftData => {
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
      created_at: new Date().getTime().toString()
  };
}