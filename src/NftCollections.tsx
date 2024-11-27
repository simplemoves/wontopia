import { Address } from "@ton/core";
import { createNftIndexFrom, testOnly, useNftsStore } from "./store/NftsStore";
import { useMemo } from "react";
import { NftItem } from "./NftItem";

export function NftCollections({ walletAddress, wontonPower }: { walletAddress: Address, wontonPower: number }) {
  const nftStore = useNftsStore();
  const walletAddressStr = useMemo(() => walletAddress.toString({ testOnly }), [ walletAddress ])
  const filteredNfts = useMemo(() => {
      const filtered = nftStore.filteredNfts(walletAddressStr, 'WIN', wontonPower + 1);
      // console.log(`Filtered size for ${collection_type}: ${Object.keys(filtered).length}`);
      return filtered;
  }, [ nftStore.store(walletAddressStr).nfts, wontonPower ]);

  const newNft = useMemo(() => {
      return nftStore.newNft(walletAddressStr);
  }, [walletAddressStr])

  return Object.keys(filteredNfts).map((nftId) =>
      <NftItem nft={filteredNfts[nftId]} key={nftId} isNew={nftId === createNftIndexFrom(newNft)}/>,
  );
}