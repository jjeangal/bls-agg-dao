import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337 //31337?
    },
    localhost: {
      chainId: 1337
    }
  },
  solidity: "0.8.24",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;