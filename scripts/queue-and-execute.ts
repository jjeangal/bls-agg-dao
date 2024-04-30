import { ethers, network } from "hardhat"

import {
    developmentChains,
    FUNCTION,
    ADDRESS_SATOSHI,
    PROPOSAL_DESCRIPTION,
    MIN_DELAY
} from "../helper-hardhat-config"

import theGovernorData from "../deployments/localhost/TheGovernor.json"
import satoshiData from "../deployments/localhost/Satoshi.json"

import { moveBlock } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {

    // Get contracts
    const satoshi = await ethers.getContractAt(satoshiData.abi, satoshiData.address);
    const theGovernor = await ethers.getContractAt(theGovernorData.abi, theGovernorData.address);

    // Get queue arguments
    const args = [ADDRESS_SATOSHI];
    const encodedFunctionCall = satoshi.interface.encodeFunctionData(
        FUNCTION,
        args
    );

    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    // Queue the proposal
    console.log("Queueing...");
    const queueTx = await theGovernor.queue(
        [satoshi.address],
        [0],
        [encodedFunctionCall],
        descriptionHash,
        { gasLimit: 1000000 }
    );
    await queueTx.wait(1);

    // If working on a development chain, push forward till to the voting period.
    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1);
        await moveBlock(1);
    }

    console.log("Executing...");
    const executeTx = await theGovernor.execute(
        [satoshi.address],
        [0],
        [encodedFunctionCall],
        descriptionHash,
        { gasLimit: 1000000 }
    );
    await executeTx.wait(1);

    console.log("Queue and Execute completed successfully!")
    console.log("----------------------------------------------------");
    const satoshiValue = await satoshi.getSatoshi();
    console.log(`New Satoshi value: ${satoshiValue}`);
}

queueAndExecute()
    .then(() => {
        process.exit(0)
    }).catch((error) => {
        console.error(error)
        process.exit(1)
    })