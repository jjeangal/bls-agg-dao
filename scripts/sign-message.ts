import { ethers } from "hardhat"
import blsData from "../deployments/localhost/BLS.json"
import fs from "fs";
import crypto from "crypto";

import { KeyPair, keyPairsFile } from "../helper-crypto-config";

export async function signProposalMessage(message: string, keyPairIndex: number): Promise<Uint8Array> {

    // Get BLS contract
    const blsContract = await ethers.getContractAt(blsData.abi, blsData.address);

    let msgInBytes: Uint8Array = ethers.utils.toUtf8Bytes(message);
    const msgPoint: Uint8Array = blsContract.hashToPoint(msgInBytes);

    console.log(`Message Point: ${msgPoint}`);

    return msgPoint;
}

export async function getKeyPairs(): Promise<KeyPair[]> {
    const keyPairs: KeyPair[] = JSON.parse(fs.readFileSync(keyPairsFile, 'utf8'));
    return keyPairs;
}

export async function getKeyPairAtIndex(index: number): Promise<KeyPair> {
    const keyPairs = await getKeyPairs();
    return keyPairs[index];
}