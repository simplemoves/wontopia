import { address, fromNano } from "@ton/core";
import { debug } from "console";
import { FEUniversesHolder } from "../lib/Types";

const wontonPrizeFraction = BigInt(import.meta.env.VITE_WONTON_PRIZE_FRACTION_TON!);

const initUniverses = () => {
    const universesHolder: FEUniversesHolder = {universesHolder: {}, collections: {}, universesPrizes: []};
    for (const wonTonPower of Array(12).keys()) {
        const wonTon = address(import.meta.env[`VITE_WONTON_CONTRACT_ADDRESS_${wonTonPower}`]);
        const wCollection = address(import.meta.env[`VITE_WIN_NFT_COLLECTION_ADDRESS_${wonTonPower}`]);
        const lCollection = address(import.meta.env[`VITE_LOOSE_NFT_COLLECTION_ADDRESS_${wonTonPower}`]);

        if (wonTon && wCollection && lCollection) {
            debug(`wontonPower: ${wonTonPower} | universe loaded`);
            debug(`wontonPower: ${wonTonPower} | WonTon: ${wonTon.toString({ testOnly: true })}`);
            debug(`wontonPower: ${wonTonPower} | wCollection: ${wCollection.toString({ testOnly: true })}`);
            debug(`wontonPower: ${wonTonPower} | lCollection: ${lCollection.toString({ testOnly: true })}`);
            universesHolder.collections[wCollection.toRawString()] = { cType: 'WIN', wonTonPower: wonTonPower + 1 };
            universesHolder.collections[lCollection.toRawString()] = { cType: 'LOOSE', wonTonPower: wonTonPower + 1 };
            universesHolder.universesHolder[wonTonPower] = {
                wonTonPower,
                wonTon,
                winUniverse: {
                    collection: wCollection,
                },
                looseUniverse: {
                    collection: lCollection,
                },
                prize: wontonPrizeFraction * BigInt(3 ** (wonTonPower + 1)),
            }

            universesHolder.universesPrizes.push({
                key: wonTonPower.toString(),
                universe: wonTonPower,
                prize: +fromNano(wontonPrizeFraction) * (3 ** (wonTonPower + 1)),
            });
        }
    }

    return universesHolder;
}

export const globalUniversesHolder = initUniverses();