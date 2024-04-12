import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { MIN_DELAY, networkConfig } from '../helper-hardhat-config';

const deployTimeLock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    // Hardhat runtime environment
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    // Deploy the TimeLock contract
    log("----------------------------------------------------");
    log(`Deploying TimeLock and waiting for confirmation...`);

    const timeLock = await deploy('TimeLock', {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });

    log(`TimeLock deployed at address ${timeLock.address}`);

}

export default deployTimeLock;