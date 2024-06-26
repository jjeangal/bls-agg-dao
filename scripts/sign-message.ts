import fs from "fs";
import * as mcl from "../utils/mcl-helper";
import * as wasm from 'mcl-wasm';

import { KeyPair, keyPairsFile } from "../helper-crypto-config";
import { BigNumber } from "ethers";

export async function signProposalMessage(
    message: string,
    keyPairIndex: number
): Promise<{
    msgs: BigNumber[],
    pks: BigNumber[],
    aggSig: BigNumber[]
}> {
    await mcl.init();
    mcl.setDomain(mcl.DOMAIN_STR);

    const keyPairs: KeyPair[] = await getKeyPairsFromLToN(0, keyPairIndex);

    let aggSignature = mcl.newG1();
    let aggPkeys = mcl.newG2();

    let Ms;

    for (let i = 0; i < keyPairIndex; i++) {
        const { pubkey, secret } = keyPairs[i];
        const { signature, M } = mcl.sign(message, secret);
        aggSignature = mcl.aggreagate(aggSignature, signature);
        aggPkeys = mcl.aggreagate(aggPkeys, pubkey);

        if (i === 0) {
            Ms = M;
        }
    }

    const msgs = mcl.g1ToBN(Ms);
    const pks = mcl.g2ToBN(aggPkeys);
    const aggSig = mcl.g1ToBN(aggSignature);

    return { msgs, pks, aggSig };
}

export async function getKeyPairs(): Promise<KeyPair[]> {
    const serializedKeyPairs: { secret: number[], pubkey: number[] }[] = JSON.parse(fs.readFileSync(keyPairsFile, 'utf8'));
    const keyPairs: KeyPair[] = serializedKeyPairs.map(({ secret, pubkey }) => {
        const secretFr = new wasm.Fr();
        secretFr.deserialize(new Uint8Array(secret));
        const pubkeyG2 = new wasm.G2();
        pubkeyG2.deserialize(new Uint8Array(pubkey));
        return { secret: secretFr, pubkey: pubkeyG2 };
    });
    return keyPairs;
}

export async function getKeyPairAtIndex(index: number): Promise<KeyPair> {
    const keyPairs = await getKeyPairs();
    return keyPairs[index];
}

export async function getKeyPairsFromLToN(l: number, n: number): Promise<KeyPair[]> {
    const keyPairs = await getKeyPairs();
    return keyPairs.slice(l, n);
}