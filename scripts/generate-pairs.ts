import bls from "@chainsafe/blst";
import fs from "fs";
import crypto from "crypto";
import {
    keyPairsFile,
    KeyPair,
    PAIRAMOUNT
} from "../helper-crypto-config";

export async function generateKeyPairs(count: number) {
    const keyPairs: KeyPair[] = [];

    for (let i = 0; i < count; i++) {
        // Generate a random 32-byte buffer for the IKM
        const ikm = Buffer.from(crypto.getRandomValues(new Uint8Array(32)));

        const sk = bls.SecretKey.fromKeygen(ikm);
        const pk = sk.toPublicKey().serialize();

        keyPairs.push({ sk: sk.serialize(), pk });
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