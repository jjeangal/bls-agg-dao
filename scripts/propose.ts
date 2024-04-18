import { ethers, network } from 'hardhat';
import {
    developmentChains,
    proposalsFile,
    ADDRESS_SATOSHI,
    VOTING_DELAY,
    FUNCTION,
    PROPOSAL_DESCRIPTION,
} from '../helper-hardhat-config';

import theGovernorData from "../deployments/localhost/TheGovernor.json"
import satoshiData from "../deployments/localhost/Satoshi.json"

import { moveBlock } from '../utils/move-blocks';

import * as fs from 'fs';

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
        [satoshi.address],
        [0],
        [encodedFunctionCall],
        proposalDescription,
        { gasLimit: 1000000 }
    );

    if (developmentChains.includes(network.name)) {
        await moveBlock(VOTING_DELAY + 1);
    }

    const proposeReceipt = await proposeTx.wait(2);
    const proposalId = proposeReceipt.events[0].args.proposalId;

    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    let proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));

    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose(FUNCTION, [ADDRESS_SATOSHI], "")
    .then(() => {
        console.log("Proposed!");
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });