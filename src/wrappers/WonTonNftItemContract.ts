import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, } from '@ton/core';
import { Opcodes } from '../lib/Opcodes';
import { NftItemData, NftItemWontonData } from '../lib/Types';
import { decodeCommonContentUrl } from '../lib/TonUtils';

export class WonTonNftItemContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new WonTonNftItemContract(address);
    }

    sendBetNft = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
        }
    ) => {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.betNft, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .endCell(),
        });
    }

    sendBurn = async (
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint
            queryId?: number
        }
    ) => {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.burn, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .endCell(),
        });
    }

    getNftData = async (provider: ContractProvider): Promise<NftItemData> => {
        const result = await provider.get('get_nft_data', []);
        
        return {
            is_active: result.stack?.readBoolean(),
            index: result.stack?.readNumber(),
            collection_address: result.stack?.readAddress(),
            owner_address: result.stack?.readAddress(),
            content: decodeCommonContentUrl(result.stack?.readCell())
        };
    }

    getNftWontonData = async (provider: ContractProvider): Promise<NftItemWontonData> => {
        const result = await provider.get('get_wonton_information', []);

        return {
            is_active: result.stack?.readBoolean(),
            balance: result.stack?.readBigNumber(),
            wonton_power: result.stack?.readNumber(),
        };
    }

    getBalance = async (provider: ContractProvider): Promise<bigint> => {
        const nftWontonData = await this.getNftWontonData(provider);
        return nftWontonData.balance;
    }
}