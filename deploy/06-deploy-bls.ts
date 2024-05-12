import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { networkConfig } from "../helper-hardhat-config"

const deployBLS: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {

    // Hardhat runtime environment
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    log(`Deploying BLS contract...`)

    const bls = await deploy('BLSTest', {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        gasLimit: 30000000
    });

    log(`BLS deployed at address ${bls.address}`);
}

export default deployBLS;
