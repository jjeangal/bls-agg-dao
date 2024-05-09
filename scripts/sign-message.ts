import { ethers } from "hardhat"
import blsData from "../deployments/localhost/BLS.json"

export async function signProposalMessage(message: string, /**privateKey: string */): Promise<void> {

    // Get BLS contract
    const bls = await ethers.getContractAt(blsData.abi, blsData.address);

    let msgInBytes = ethers.utils.toUtf8Bytes(message);
    const msgPoint = bls.hashToPoint(msgInBytes);

    console.log(`Message Point: ${msgPoint}`);

    return msgPoint;
}