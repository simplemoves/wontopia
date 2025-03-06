import { gql } from "urql";
import { v4 as uuidv4 } from "uuid";
import { PlayStateEventsHolder, PlayStateSubscriptionResult } from "./Types.ts";

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
    query($walletAddressStr: String!, $power: Int!, $startedAt: Time!) {
        playState(walletAddressStr: $walletAddressStr, power: $power, startedAt: $startedAt)
    }`;

export const playStatusSubscriptionQuery = gql`
    subscription PlayStatusSubscription($walletAddressStr: String!, $power: Int!, $startedAt: Time!) {
        playState(walletAddressStr: $walletAddressStr, power: $power, startedAt: $startedAt) {
            state
            stateChangedAt
            playersToWait
            nfts {
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
        }
    }`;

export const playStateSubscriptionResultHandler = (eventsHolder: PlayStateEventsHolder | undefined, newResult: PlayStateSubscriptionResult): PlayStateEventsHolder => {
  const event = { ...newResult.playState, id: uuidv4().toString() }
  return {
    events: [...(eventsHolder?.events || []), event],
    last_event: event,
    players_to_wait: newResult.playState.playersToWait,
    prev_event: eventsHolder?.last_event.state !== event.state ? eventsHolder?.last_event : eventsHolder?.prev_event,
    started_at: eventsHolder?.last_event ? eventsHolder.started_at : new Date(),
  }
};