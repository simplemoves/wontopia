import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode } from '@ton/core';
import { Opcodes } from '../lib/Opcodes';
import { getErrorMessage } from '../lib/ErrorHandler';

export class WonTonContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new WonTonContract(address);
    }

    sendBet = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
            provided_wonton_power: number,
        }
    ) => {
        try {
            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                .storeUint(Opcodes.bet, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeUint(opts.provided_wonton_power, 8)
                .endCell(),
            })
        } catch (ex) {
            console.error(getErrorMessage(ex));
        }
    }

    sendBetReferred = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
            provided_wonton_power: number,
            referee_address: Address
        }
    ) => {
        try {
            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                .storeUint(Opcodes.bet_referred, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeUint(opts.provided_wonton_power, 8)
                .storeAddress(opts.referee_address)
                .endCell(),
            })
        } catch (ex) {
            console.error(getErrorMessage(ex));
            return false;
        }

        return true;
    }
}