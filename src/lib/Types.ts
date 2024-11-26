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
export const NftTypeSchema = z.union([
    z.literal(NFT),
    z.literal(NON_NFT),
    z.literal(NON_MY_NFT),
]);

export const FOUND = "FOUND";
export const PROCESSED = "PROCESSED";
export const TransactionHistoryItemStateSchema = z.union([
    z.literal(FOUND),
    z.literal(PROCESSED),
]);

export const NonNftSchema = z.object({
  type: NftTypeSchema,
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
  type: NftTypeSchema,
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

export const BEUniversesHolderSchema = z.record(z.number(), BEUniversesSchema);
export const ContractSetSchema = z.record(z.string(), CollectionInfoSchema);

export const FEUniversesHolderSchema = z.object({
  universesHolder: BEUniversesHolderSchema,
  collections: ContractSetSchema,
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

export const StoreRegistrySchema = z.record(z.string(), StoresSchema);
export const GetStoreSchema = z.function().args(z.string()).returns(StoresSchema);
export const GetTransactionsSchema = z.function().args(z.string()).returns(SimpleTransactionHistorySchema);
export const IsTransactionProcessedSchema = z.function().args(z.string(), z.string()).returns(z.boolean());
export const AddTransactionFunctionSchema = z.function().args(z.string(), SimpleTransactionHistoryItemSchema).returns(z.void());
export const NftFilteringFunctionSchema = z.function().args(z.string(), CollectionInfoSchema, z.number()).returns(z.boolean());
export const AddNftFunctionSchema = z.function().args(z.string(), NftSchema).returns(z.void());
export const DeleteNftFunctionSchema = z.function().args(z.string(), z.string()).returns(z.void());
export const MarkTransactionAsProcessedSchema = z.function().args(z.string(), z.string()).returns(z.void());
export const MarkNftAsNotMyNftSchema = z.function().args(z.string(), z.string(), z.custom<Address>()).returns(z.void());
export const AnyNotProcessesTransactionsSchema = z.function().args(z.string()).returns(z.boolean());
export const PollFunctionSchema = z.function().args(z.custom<Address>()).returns(z.promise(z.void()));
export const UpdateNftOwnerFunctionSchema = z.function().args(z.custom<Address>()).returns(z.promise(z.void()));
export const FilteredNftsFunctionSchema = z.function().args(z.string(), CollectionTypeSchema, z.number()).returns(NftsHistorySchema);
export const NewNftFunctionSchema = z.function().args(z.string()).returns(NftSchema.optional());

export const NftStoreSchema = z.object({
  storesRegistry: StoreRegistrySchema,
  store: GetStoreSchema,
  transactions: GetTransactionsSchema,
  isTransactionProcessed: IsTransactionProcessedSchema,
  addTransaction: AddTransactionFunctionSchema,
  doesNftExists: NftFilteringFunctionSchema,
  addNft: AddNftFunctionSchema,
  deleteNft: DeleteNftFunctionSchema,
  markTransactionAsProcessed: MarkTransactionAsProcessedSchema,
  markNftAsNotMyNft: MarkNftAsNotMyNftSchema,
  anyNotProcessedTransactions: AnyNotProcessesTransactionsSchema,
  poll: PollFunctionSchema,
  updateNftOwner: UpdateNftOwnerFunctionSchema,
  filteredNfts: FilteredNftsFunctionSchema,
  newNft: NewNftFunctionSchema,
});

////////////////////////////////
// Types infering and exporting
////////////////////////////////
export type FEUniversesHolder = z.infer<typeof FEUniversesHolderSchema>;
export type CollectionType = z.infer<typeof CollectionTypeSchema>;
export type Nft = z.infer<typeof NftSchema>;
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

export const NOT_NFT: NonNft = { type: 'NON_NFT' };

////////////////////////////////
// Function helpers
////////////////////////////////
export const isNft = (nft: Nft | NonNft): nft is Nft => {
  return nft!! && nft.type == NFT;
}

export const isNftData = (nftData: GetNftData|undefined): nftData is GetNftData => {
  return nftData != undefined;
}
