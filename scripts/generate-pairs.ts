import bls from "@chainsafe/blst";
import fs from "fs";
import crypto from "crypto";
import {
    keyPairsFile,
    PAIRAMOUNT
} from "../helper-crypto-config";

interface KeyPair {
    sk: Uint8Array;
    pk: Uint8Array;
}

function generateKeyPairs(count: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const keyPairs: KeyPair[] = [];

        try {
            // Generate a random 32-byte buffer for the IKM
            const ikm = Buffer.from(crypto.getRandomValues(new Uint8Array(32)));

            for (let i = 0; i < count; i++) {
                const sk = bls.SecretKey.fromKeygen(ikm);
                const pk = sk.toPublicKey().serialize();

                console.log(sk);

                keyPairs.push({ sk: sk.serialize(), pk });
            }

            storeKeyPairs(keyPairs);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
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