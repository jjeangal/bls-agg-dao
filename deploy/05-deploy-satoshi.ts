import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { networkConfig } from "../helper-hardhat-config"
import { ethers } from "hardhat";

const deploySatoshi: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {

    // Hardhat runtime environment
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    log(`Deploying Satoshi and TimeLock Contract...`)

    const satoshi = await deploy('Satoshi', {
        from: deployer,
        args: [deployer],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`Satoshi deployed at address ${satoshi.address}`)

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

    log("----------------------------------------------------");
};

export default deploySatoshi;