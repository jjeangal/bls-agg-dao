import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from "hardhat";

const deploySatoshi: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {

    // Hardhat runtime environment
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    log(`Deploying Satoshi and TimeLock Contract...`)

    const satoshi = await deploy('Satoshi', {
        from: deployer,
        args: [deployer],
        log: true
    });

    // Get Contract Deployment
    const timeLockDeployment = await deployments.get('TimeLock');

    // Get Contracts
    const timeLock = await ethers.getContractAt('TimeLock', timeLockDeployment.address);
    const satoshiContract = await ethers.getContractAt('Satoshi', satoshi.address);

    // Transfer Ownership of Satoshi to TimeLock
    const transferOwnershipTx = await satoshiContract.transferOwnership(
        timeLock.address
    );
    await transferOwnershipTx.wait(1);
};

export default deploySatoshi;