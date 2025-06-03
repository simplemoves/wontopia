import { gql } from "urql";

export const nftsQuery = gql`
    query(
        $walletAddressStr: String!,
        $power: Int!,
        $collectionTypes: [CollectionType!],
        $statuses: [NftStatus!]
    ) {
        nfts(
            address: $walletAddressStr,
            power: $power,
            collectionTypes: $collectionTypes
            statuses: $statuses) {
            address
            index
            ownerAddress
            collectionType
            power
            metaUrl
            status
            mintedAt
            updatedAt
        }
    }`;

export const playStateQuery = gql`
    query($walletAddressStr: String!) {
        playState(walletAddressStr: $walletAddressStr)
    }`;

export const playStatusSubscriptionQuery = gql`
    subscription PlayStatusSubscription($walletAddressStr: String!) {
        playState(walletAddressStr: $walletAddressStr) {
            power
            state
            stateChangedAt
        }
    }`;
