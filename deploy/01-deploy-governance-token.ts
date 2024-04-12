import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { networkConfig } from "../helper-hardhat-config";

const deployGovernanceToken: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    // Hardhat runtime environment
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    // Deploy the GovernanceToken contract
    log("----------------------------------------------------");
    log(`Deploying GovernanceToken and waiting for confirmation...`);

    const governanceToken = await deploy('GovernanceToken', {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`GovernanceToken deployed at address ${governanceToken.address}`);

    log("----------------------------------------------------");
    await delegate(governanceToken.address, deployer);
    log("Delegated!");
};

const delegate = async (
    governanceTokenAddress: string,
    delegatedAccount: string
) => {

    const governanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    );

    const txResponse = await governanceToken.delegate(delegatedAccount);
    await txResponse.wait(1);

    console.log(
        `Checkpoint; ${await governanceToken.numCheckpoints(delegatedAccount)}`
    );
};

export default deployGovernanceToken;