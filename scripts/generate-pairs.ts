
import fs from "fs";
import * as mcl from '../utils/mcl-helper';
import {
    keyPairsFile,
    KeyPair,
    PAIRAMOUNT,
} from "../helper-crypto-config";

export async function generateKeyPairs(count: number) {
    const keyPairs: KeyPair[] = [];

    for (let i = 0; i < count; i++) {
        const { pubkey, secret } = mcl.newKeyPair();
        keyPairs.push({ secret, pubkey });
    }

    storeKeyPairs(keyPairs);
}

function storeKeyPairs(keyPairs: KeyPair[]) {
    fs.writeFileSync(keyPairsFile, JSON.stringify(keyPairs), "utf8");
}

generateKeyPairs(PAIRAMOUNT)
    .then(() => {
        console.log("Keys Generated. Stored in key-pairs.json.");
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });