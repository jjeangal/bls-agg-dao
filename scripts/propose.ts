import { ethers } from 'hardhat';
import { ADDRESS_SATOSHI, FUNCTION, PROPOSAL_DESCRIPTION } from '../helper-hardhat-config';

import theGovernorData from "../deployments/localhost/TheGovernor.json"
import satoshiData from "../deployments/localhost/Satoshi.json"

export async function propose(
    functionCalled: string,
    args: any[],
    proposalDescription: string
) {
    const theGovernor = await ethers.getContractAt('Governor', theGovernorData.address);
    const satoshi = await ethers.getContractAt('Satoshi', satoshiData.address);

    const encodedFunctionCall = satoshi.interface.encodeFunctionData(
        functionCalled,
        args
    );

    console.log(`Proposing ${functionCalled} on ${satoshiData.address} with ${args} `)
    console.log(`Proposal Description: \n ${PROPOSAL_DESCRIPTION}`)

    const proposeTx = await theGovernor.propose(
        [satoshiData.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );

    proposeTx.wait(1);
}

propose(FUNCTION, [ADDRESS_SATOSHI], "")
    .then(() => {
        console.log("Proposed");
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });