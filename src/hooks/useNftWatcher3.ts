import { useCallback, useState } from "react";
import { Address } from "@ton/core";
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { BEUniverses, NftsHistory, NftsResult, NftsVariables, PlayStateEventNftSchema } from "../lib/Types.ts";
import { CombinedError, useClient } from "urql";
import { nftsQuery } from "../lib/WontopiaGraphQL.ts";
import { testOnly } from "../lib/Constants.ts";
import { fetchMeta } from "../providers/WontopiaTonClientProvider.ts";
import { createNftIndex } from "../store/WontopiaStore.ts";

export function useNftWatcher3(walletAddress: Address | undefined, universes: BEUniverses) {
    const [ running, setRunning ] = useState(false);
    const [ error, setError ] = useState<CombinedError | undefined>(undefined);
    const [ nfts, setNfts ] = useState<NftsHistory | undefined>(undefined);
    const graphQlClient = useClient()

    const handleUpdate = useCallback(() => {
        const requestNfts = async () => {
            if (walletAddress) {
                setRunning(() => true);
                try {
                    console.log(`${new Date().getTime()} | Requesting nfts... ${running}`);
                    const result = await graphQlClient.query<NftsResult, NftsVariables>(
                        nftsQuery,
                        {
                          walletAddressStr: walletAddress.toString({ testOnly: testOnly }),
                          power: universes.wonTonPower + 1,
                          statuses: ["MINTED"]
                        }).toPromise();

                    console.log(`${new Date().getTime()} | Finished requesting nfts...`);
                    if (result.error) {
                      console.error(`With error: ${result.error}`);
                      setError(result.error);
                    } else {
                      const nfts = result.data?.nfts || [];
                      const parsedNfts: NftsHistory = {}
                      for (const nft of nfts) {
                        const key = createNftIndex(nft.collectionType, nft.power, nft.index)
                        const parsedNft = PlayStateEventNftSchema.parse(nft);
                        const repoName = testOnly ? "wontopia-nft-testnet" : "wontopia-nft";
                        const nftMeta = await fetchMeta(`https://simplemoves.github.io/${repoName}/${parsedNft.collectionType}/${parsedNft.power}${parsedNft.metaUrl}`);
                        parsedNfts[key] = {
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
                          nft_meta: nftMeta
                        };
                      }
                      setNfts(parsedNfts)
                    }
                } catch (error) {
                    console.error(`${new Date().getTime()} | Requesting nfts failed with error: ${getErrorMessage(error)}`);
                }
                setRunning(() => false);
            } else {
                console.log("No wallet address provided yet");
            }                
        }

        if (running) {
            console.log(`${new Date().getTime()} | Requesting nfts is in progress...`);
            return;
        }

        requestNfts().catch((err) => {
          console.error(err);
        });
    }, [ graphQlClient, walletAddress, universes, running, setRunning, setError, setNfts ]);

    return {
        handleUpdate,
        running,
        error,
        nfts
    }
}
