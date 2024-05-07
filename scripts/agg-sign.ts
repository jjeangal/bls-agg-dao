import {
    KeyPair,
    keyPairsFile
} from '../helper-crypto-config';

import * as fs from 'fs';

export async function signatureAggregate() {

    const keyPairs: KeyPair[] = JSON.parse(fs.readFileSync(keyPairsFile, 'utf8'));
    console.log("KeyPairs: ", keyPairs);


}

signatureAggregate()
    .then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });

