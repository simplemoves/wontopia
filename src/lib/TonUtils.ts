import { Address, Cell, ExternalAddress, Message } from "@ton/core";
import { Maybe } from "@ton/core/dist/utils/maybe";
import { Opcodes } from "./Opcodes";

export const isTonAddress = (address: Address | Maybe<ExternalAddress> | undefined): address is Address => {
  return address!! && ((address as Address).workChain !== undefined);
}

export const tonAddress = (src: string | undefined | null): Address | undefined => src ? Address.parse(src) : undefined;

export const possiblyNftTransfer = (inMsg: Maybe<Message>): boolean => {
  if (inMsg
      && (inMsg?.body.bits.length > (32 + 64 + 256))) {
      const op = parsePossibleNftTransfer(inMsg.body);
      // console.log(`op === Opcodes.ownershipAssigned: ${op === Opcodes.ownershipAssigned}`);
      // console.log(`queryId === BigInt(0): ${queryId === BigInt(0)}`);
      // console.log(`collection address param: ${collectionAddress.toString({testOnly: true})}`);
      // console.log(`collection address received: ${collection.toString({testOnly: true})}`);
      return op === Opcodes.ownershipAssigned;
  } else {
      return false;
  }
}

export const parsePossibleNftTransfer = (body: Cell): number => {
  const cs = body.beginParse();
  return cs.loadUint(32);
}
