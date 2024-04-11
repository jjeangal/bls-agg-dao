import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre;

};
export default func;