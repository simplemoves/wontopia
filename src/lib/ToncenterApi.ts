import axios from "axios";
import { AddressInformationResponse, NftItemResponse, NftItemsResponse } from "./Types";

export const requestNftItems = async (owner_address: string, collection_address: string, limit: number = 20, offset: number = 0): Promise<NftItemResponse[] | undefined> => {
  const response = await axios.get<NftItemsResponse>("https://toncenter.com/api/v3/nft/items", {
      params: {
          owner_address,
          collection_address,
          limit,
          offset
      }
  });

  if (response.status != 200) {
      console.error("Error getting NFT Items");
      return;        
  }

  return response.data.nft_items;
}

export const requesAddressInformation = async (address: string, use_v2: boolean = true): Promise<AddressInformationResponse | undefined> => {
  const response = await axios.get<AddressInformationResponse>("https://toncenter.com/api/v3/addressInformation", {
      params: {
          address,
          use_v2,
      }
  });

  if (response.status != 200) {
      console.error("Error getting Address Information");
      return;        
  }

  return response.data;
}
