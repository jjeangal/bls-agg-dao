import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import {
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    networkConfig
} from '../helper-hardhat-config';

const deployTheGovernor: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    // Hardhat runtime environment
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    // Get both the GovernanceToken contract and the TimeLock contract
    const governanceToken = await get('GovernanceToken');
    const timeLock = await get('TimeLock');

    // Arguments for the TheGoverner contract constructor
    const governorArgs = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE
    ]

    // Deploy the TheGovernor contract
    log("----------------------------------------------------");
    log(`Deploying TheGovernor and waiting for confirmation...`);

    const theGovernor = await deploy('TheGovernor', {
        from: deployer,
        args: governorArgs,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`TheGovernor deployed at address ${theGovernor.address}`);
};

export default deployTheGovernor;