import { ethers, network } from 'hardhat';
import * as fs from 'fs';

import {
    PROPOSAL_DESCRIPTION,
} from '../helper-hardhat-config';

import {
    proposalsFile,
    developmentChains,
    VOTING_PERIOD
} from '../helper-hardhat-config';
import { moveBlock } from "../utils/move-blocks"
import theGovernorData from "../deployments/localhost/TheGovernor.json"

import { signProposalMessage } from './sign-message';

const index = 0;

export async function vote(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
    const proposalId = proposals[network.config.chainId!][proposalIndex];

    // Get the signer
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    // 0: Against, 1: For, 2: Abstain
    const voteType = 1;

    // Get the Governor contract
    const theGovernor = await ethers.getContractAt(theGovernorData.abi, theGovernorData.address);

    // Set the reason for voting
    const reason = "He his a cryptography expert";

    const { msg, pk, sig } = await signProposalMessage(PROPOSAL_DESCRIPTION, 0);

    console.log("Voting...");

    const aggVoteTx = await theGovernor.castVoteWithReasonAndBlsSig(
        proposalId,
        [signerAddress],
        sig,
        pk,
        msg,
        voteType,
        reason,
        { gasLimit: 1000000 }
    );

    const aggVoteTxReceipt = await aggVoteTx.wait(1);
    console.log(`Vote with BLS Agg Signature:\n  - ${aggVoteTxReceipt.events[0].args.join("\n  - ")}`);

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