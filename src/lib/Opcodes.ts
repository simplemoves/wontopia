import { crc32 } from "./Crc32";

export const Opcodes = {
  deploy: 1,
  batch_deploy: 2,
  change_ownership: 3,
  change_content: 4,

  bet: crc32("op::bet"),      //0x9b0663d8
  bet_referred: crc32("op::bet_referred"),      //0xd2ba0295
  play: crc32("op::play"),    //0xb13c381f,
  setUniverse: crc32("op::set_universe"),    //0xb13c381f
  setReferral: crc32("op::set_referral"),    //0x2fb0ee30
  betNft: crc32("op::bet_nft"), //0x0c5a5683
  validateNft: crc32("op::validate_nft"), //0x75540eaf
  validateNftCollection: crc32("op::validate_nft_collection"), //0x284464f9
  burn: crc32("op::burn"), //0xbae7fba1
  sendExcesses: crc32("op::send_excesses"), //0xd7a82b13
  excesses: 0xd53276db,
  ownershipAssigned: 0x05138d91,
  reportStaticData: 0x8b771735,
  getStaticData: 0x2fcb26a2,
  transfer: 0x5fcc3d14,
  getRoyaltyParams: 0x693d3950,
  reportRoyaltyParams: 0xa8cb00ad,
  editContent: 0x1a0b9d51,
  transferEditorship: 0x1c04412a,
  editorshipAssigned: 0x511a4463,
};
