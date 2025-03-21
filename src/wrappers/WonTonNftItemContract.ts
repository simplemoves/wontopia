import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode } from '@ton/core';
import { Opcodes } from '../lib/Opcodes';
import { getErrorMessage } from "../lib/ErrorHandler.ts";
import { TonConnectUIError, UserRejectsError } from "@tonconnect/ui-react";

export class WonTonNftItemContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new WonTonNftItemContract(address);
    }

    static createFromAddressStr(addressStr: string) {
        return new WonTonNftItemContract(Address.parse(addressStr));
    }

    sendBetNft = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
        },
    ) => {
        try {
            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(Opcodes.betNft, 32)
                                 .storeUint(opts.queryId ?? 0, 64)
                                 .endCell(),
            });
            return true;
        } catch (error) {
            if (error instanceof TonConnectUIError) {
                console.debug("Looks like user closed modal dialog");
                return false;
            } else if (error instanceof UserRejectsError) {
                console.debug("Looks like user rejected transaction");
                return false;
            }
            console.error(getErrorMessage(error));
            throw error;
        }
    }

    sendBurn = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
        },
    ) => {
        try {
            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().storeUint(Opcodes.burn, 32)
                                 .storeUint(opts.queryId ?? 0, 64)
                                 .endCell(),
            });

            return true;
        } catch (error) {
            if (error instanceof TonConnectUIError) {
                console.debug("Looks like user closed modal dialog");
                return false;
            } else if (error instanceof UserRejectsError) {
                console.debug("Looks like user rejected transaction");
                return false;
            }
            console.error(getErrorMessage(error));
            throw error;
        }
    }
}