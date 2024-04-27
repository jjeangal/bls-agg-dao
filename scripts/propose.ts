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
    const theGovernor = await ethers.getContractAt('TheGovernor', theGovernorData.address);
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

    const proposeReceipt = await proposeTx.wait(1);
    const proposalId = proposeReceipt.events[0].args.proposalId;

    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    const proposalState = await theGovernor.state(proposalId)

    storeProposalId(proposalId);

    // the Proposal State is an enum data type, defined in the IGovernor contract.
    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current Proposal State: ${proposalState}`)
}

function storeProposalId(proposalId: any) {
    const chainId = network.config.chainId!.toString();
    let proposals: any;

    if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    } else {
        proposals = {};
        proposals[chainId] = [];
    }
    proposals[chainId].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
}

propose(FUNCTION, [ADDRESS_SATOSHI], PROPOSAL_DESCRIPTION)
    .then(() => {
        console.log("Proposed!");
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });