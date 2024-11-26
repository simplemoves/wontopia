import { address } from "@ton/core";
import { log } from "console";
import { FEUniversesHolder } from "../lib/Types";

const wontonPrizeFraction = BigInt(import.meta.env.VITE_WONTON_PRIZE_FRACTION_TON!);

const initUniverses = () => {
    const universesHolder: FEUniversesHolder = {universesHolder: {}, collections: {}};
    for (const wonTonPower of Array(2).keys()) {
        const wonTon = address(import.meta.env[`VITE_WONTON_CONTRACT_ADDRESS_${wonTonPower}`]);
        const wCollection = address(import.meta.env[`VITE_WIN_NFT_COLLECTION_ADDRESS_${wonTonPower}`]);
        const lCollection = address(import.meta.env[`VITE_LOOSE_NFT_COLLECTION_ADDRESS_${wonTonPower}`]);

        if (wonTon && wCollection && lCollection) {
            log(`wontonPower: ${wonTonPower} | universe loaded`);
            log(`wontonPower: ${wonTonPower} | WonTon: ${wonTon.toString({ testOnly: true })}`);
            log(`wontonPower: ${wonTonPower} | wCollection: ${wCollection.toString({ testOnly: true })}`);
            log(`wontonPower: ${wonTonPower} | lCollection: ${lCollection.toString({ testOnly: true })}`);
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
        } else {
        }
    }

    return universesHolder;
}

export const globalUniversesHolder = initUniverses();