import { useCallback, useMemo } from "react";
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { BEUniverses, NftsResult, NftsVariables, PlayStateEventNftSchema } from "../lib/Types.ts";
import { useClient } from "urql";
import { nftsQuery } from "../lib/WontopiaGraphQL.ts";
import { testOnly } from "../lib/Constants.ts";
import { fetchMeta } from "../providers/WontopiaTonClientProvider.ts";
import { useWontopiaStore } from "../store/WontopiaStore.ts";

export function useNftWatcher(walletAddressStr: string, universes: BEUniverses) {
    const { isNftsRequestInProgress, startNftsRequest, stopNftsRequest, addNft, getNfts, nfts } = useWontopiaStore(walletAddressStr, universes.wonTonPower)();
    const nftsMemo = useMemo(() => getNfts(universes.wonTonPower), [ universes.wonTonPower, nfts, getNfts ]);
    const graphQlClient = useClient()

    const handleUpdate = useCallback(() => {
        const requestNfts = async () => {
            startNftsRequest();
            try {
                console.debug(`${new Date().getTime()} | Requesting nfts... isNftsRequestInProgress: ${isNftsRequestInProgress}`);
                const result = await graphQlClient.query<NftsResult, NftsVariables>(
                    nftsQuery,
                    {
                        walletAddressStr,
                        power: universes.wonTonPower + 1,
                        statuses: [ "MINTED" ],
                    }).toPromise();

                console.debug(`${new Date().getTime()} | Finished requesting nfts...`);
                if (result.error) {
                    console.error(`With error: ${result.error}`);
                } else {
                    const nfts = result.data?.nfts || [];
                    for (const nft of nfts) {
                        const parsedNft = PlayStateEventNftSchema.parse(nft);
                        const repoName = testOnly ? "wontopia-nft-testnet" : "wontopia-nft";
                        const nftMeta = await fetchMeta(`https://simplemoves.github.io/${repoName}/${parsedNft.collectionType}/${parsedNft.power}${parsedNft.metaUrl}`);
                        addNft({
                            state: {
                                type: 'NFT',
                                updated_at: new Date().toISOString(),
                            },
                            nft_address: parsedNft.address,
                            owner_address: parsedNft.ownerAddress,
                            nft_index: parsedNft.index,
                            collection_type: parsedNft.collectionType,
                            wonton_power: parsedNft.power,
                            created_at: parsedNft.mintedAt.toISOString(),
                            nft_meta: nftMeta,
                        });
                    }
                }
            } catch (error) {
                console.error(`${new Date().getTime()} | Requesting nfts failed with error: ${getErrorMessage(error)}`);
            }
            stopNftsRequest();
        }

        if (isNftsRequestInProgress) {
            console.debug(`${new Date().getTime()} | Requesting nfts is in progress...`);
            return;
        }

        requestNfts().catch((err) => {
            console.error(err);
        });
    }, [ graphQlClient, walletAddressStr, universes, isNftsRequestInProgress, startNftsRequest, stopNftsRequest, addNft ]);

    return {
        handleUpdate,
        isNftsRequestInProgress,
        nfts: nftsMemo,
    }
}
