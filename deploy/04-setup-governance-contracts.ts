import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { ethers } from "hardhat";
import { ADDRESS_ZERO } from '../helper-hardhat-config';

const setupContracts: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    // Hardhat runtime environment
    const { getNamedAccounts, deployments } = hre;
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();

    // Get Contract Deployments
    const timeLockDeployment = await deployments.get('TimeLock');
    const governorDeployment = await deployments.get('TheGovernor');

    // Get both the Governor and the TimeLock contract
    const timeLock = await ethers.getContractAt('TimeLock', timeLockDeployment.address);
    const theGovernor = await ethers.getContractAt('TheGovernor', governorDeployment.address);

    log("----------------------------------------------------");
    log(`Setting up roles...`)

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.DEFAULT_ADMIN_ROLE();

    // Grant Proposer Role to the Governor contract
    const proposerTx = await timeLock.grantRole(proposerRole, theGovernor.address);
    await proposerTx.wait(1);

    // Grant Executor Role to address zero - everyone
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1);

    // Revoke Admin Role for the TimeLock contract
    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
}

export default setupContracts;