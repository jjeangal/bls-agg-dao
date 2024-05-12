import fs from "fs";
import * as mcl from "../utils/mcl-helper";
import * as wasm from 'mcl-wasm';

import { KeyPair, keyPairsFile } from "../helper-crypto-config";
import { BigNumber } from "ethers";

export async function signProposalMessage(
    message: string,
    keyPairIndex: number
): Promise<{
    msg: BigNumber[],
    pk: BigNumber[],
    sig: BigNumber[]
}> {
    await mcl.init();
    mcl.setDomain(mcl.DOMAIN_STR);

    const keyPair: KeyPair = await getKeyPairAtIndex(keyPairIndex);

    const { signature, M } = mcl.sign(message, keyPair.secret);

    let msg = mcl.g1ToBN(M);
    let pk = mcl.g2ToBN(keyPair.pubkey);
    let sig = mcl.g1ToBN(signature);

    return { msg, pk, sig };
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