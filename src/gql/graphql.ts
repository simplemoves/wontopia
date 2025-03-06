/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Int64: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type Bettors = {
  __typename?: 'Bettors';
  count: Scalars['Int']['output'];
  first?: Maybe<Scalars['String']['output']>;
  second?: Maybe<Scalars['String']['output']>;
};

export enum CollectionType {
  Loose = 'LOOSE',
  Win = 'WIN'
}

export type NftData = {
  __typename?: 'NftData';
  address: Scalars['String']['output'];
  collectionType: CollectionType;
  index: Scalars['Int64']['output'];
  metaUrl: Scalars['String']['output'];
  mintedAt: Scalars['Time']['output'];
  ownerAddress: Scalars['String']['output'];
  power: Scalars['Int']['output'];
  status: NftStatus;
};

export enum NftStatus {
  Burned = 'BURNED',
  Minted = 'MINTED',
  NotInited = 'NOT_INITED',
  NotValidated = 'NOT_VALIDATED'
}

export enum PlayState {
  Error = 'ERROR',
  InPlay = 'IN_PLAY',
  Loose = 'LOOSE',
  Timeout = 'TIMEOUT',
  Unknown = 'UNKNOWN',
  Win = 'WIN'
}

export type PlayStateEvent = {
  __typename?: 'PlayStateEvent';
  nft?: Maybe<NftData>;
  state: PlayState;
  stateChangedAt?: Maybe<Scalars['Time']['output']>;
};

export type Query = {
  __typename?: 'Query';
  nfts: Array<NftData>;
  wontopiaStatus: WontopiaState;
  wontopiaStatuses: Array<WontopiaState>;
};


export type QueryNftsArgs = {
  address: Scalars['String']['input'];
};


export type QueryWontopiaStatusArgs = {
  address: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  playState: PlayStateEvent;
  wontopiaStatus?: Maybe<WontopiaStateResponse>;
};


export type SubscriptionPlayStateArgs = {
  address: Scalars['String']['input'];
};


export type SubscriptionWontopiaStatusArgs = {
  address: Scalars['String']['input'];
};

export type Universe = {
  __typename?: 'Universe';
  address?: Maybe<Scalars['String']['output']>;
  index: Scalars['Int64']['output'];
};

export type Universes = {
  __typename?: 'Universes';
  loose: Universe;
  win: Universe;
};

export type WontopiaState = {
  __typename?: 'WontopiaState';
  address: Scalars['String']['output'];
  balance: Scalars['Int64']['output'];
  bettors: Bettors;
  power: Scalars['Int']['output'];
  prize: Scalars['Int64']['output'];
  universes: Universes;
};

export type WontopiaStateResponse = {
  __typename?: 'WontopiaStateResponse';
  cause?: Maybe<Scalars['String']['output']>;
  result: WontopiaStateResponseResult;
  state?: Maybe<WontopiaState>;
};

export enum WontopiaStateResponseResult {
  Failed = 'FAILED',
  Ok = 'OK'
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Int64: { input: any; output: any; }
  Time: { input: any; output: any; }
};

export type Bettors = {
  __typename?: 'Bettors';
  count: Scalars['Int']['output'];
  first?: Maybe<Scalars['String']['output']>;
  second?: Maybe<Scalars['String']['output']>;
};

export enum CollectionType {
  Loose = 'LOOSE',
  Win = 'WIN'
}

export type NftData = {
  __typename?: 'NftData';
  address: Scalars['String']['output'];
  collectionType: CollectionType;
  index: Scalars['Int64']['output'];
  metaUrl: Scalars['String']['output'];
  mintedAt: Scalars['Time']['output'];
  ownerAddress: Scalars['String']['output'];
  power: Scalars['Int']['output'];
  status: NftStatus;
};

export enum NftStatus {
  Burned = 'BURNED',
  Minted = 'MINTED',
  NotInited = 'NOT_INITED',
  NotValidated = 'NOT_VALIDATED'
}

export enum PlayState {
  Error = 'ERROR',
  InPlay = 'IN_PLAY',
  Loose = 'LOOSE',
  Timeout = 'TIMEOUT',
  Unknown = 'UNKNOWN',
  Win = 'WIN'
}

export type PlayStateEvent = {
  __typename?: 'PlayStateEvent';
  nft?: Maybe<NftData>;
  state: PlayState;
  stateChangedAt?: Maybe<Scalars['Time']['output']>;
};

export type Query = {
  __typename?: 'Query';
  nfts: Array<NftData>;
  wontopiaStatus: WontopiaState;
  wontopiaStatuses: Array<WontopiaState>;
};


export type QueryNftsArgs = {
  address: Scalars['String']['input'];
};


export type QueryWontopiaStatusArgs = {
  address: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  playState: PlayStateEvent;
  wontopiaStatus?: Maybe<WontopiaStateResponse>;
};


export type SubscriptionPlayStateArgs = {
  address: Scalars['String']['input'];
};


export type SubscriptionWontopiaStatusArgs = {
  address: Scalars['String']['input'];
};

export type Universe = {
  __typename?: 'Universe';
  address?: Maybe<Scalars['String']['output']>;
  index: Scalars['Int64']['output'];
};

export type Universes = {
  __typename?: 'Universes';
  loose: Universe;
  win: Universe;
};

export type WontopiaState = {
  __typename?: 'WontopiaState';
  address: Scalars['String']['output'];
  balance: Scalars['Int64']['output'];
  bettors: Bettors;
  power: Scalars['Int']['output'];
  prize: Scalars['Int64']['output'];
  universes: Universes;
};

export type WontopiaStateResponse = {
  __typename?: 'WontopiaStateResponse';
  cause?: Maybe<Scalars['String']['output']>;
  result: WontopiaStateResponseResult;
  state?: Maybe<WontopiaState>;
};

export enum WontopiaStateResponseResult {
  Failed = 'FAILED',
  Ok = 'OK'
}
