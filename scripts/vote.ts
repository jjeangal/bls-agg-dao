import { ethers, network } from 'hardhat';
import * as fs from 'fs';

import {
    proposalsFile,
    developmentChains,
    VOTING_PERIOD
} from '../helper-hardhat-config';
import { moveBlock } from "../utils/move-blocks"
import theGovernorData from "../deployments/localhost/TheGovernor.json"

const index = 0;

export async function vote(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
    const proposalId = proposals[network.config.chainId!][proposalIndex];

    // 0: Against, 1: For, 2: Abstain
    const voteType = 1;

    // Get the Governor contract
    const theGovernor = await ethers.getContractAt('TheGovernor', theGovernorData.address);

    // Set the reason for voting
    const reason = "He his a cryptography expert";

    console.log("Voting...");

    //Check castVoteWithSig for voting with signature (BLS Agg)
    const voteTx = await theGovernor.castVoteWithReason(
        proposalId,
        voteType,
        reason,
        { gasLimit: 1000000 }
    );

    const voteTxReceipt = await voteTx.wait(1);
    console.log(`Voted with args:\n  - ${voteTxReceipt.events[0].args.join("\n  - ")}`)

    if (developmentChains.includes(network.name)) {
        await moveBlock(VOTING_PERIOD + 1);
    }

    const proposalState = await theGovernor.state(proposalId)
    console.log(`State of the current proposal:\n  ${proposalState}`)

}

vote(index)
    .then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error(error);
        process.exit(1);
    });