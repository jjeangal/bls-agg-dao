export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    sepolia: {
        blockConfirmations: 6,
    },
}

export const developmentChains = ["hardhat", "localhost"]

export const proposalsFile = "./proposals.json";

export const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact

export const VOTING_DELAY = 1 // Number of blocks till a proposal vote becomes active
export const VOTING_PERIOD = 5 // Number or blocks
export const QUORUM_PERCENTAGE = 4 // % of voters to pass

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const ADDRESS_SATOSHI = "0x4df30AF0237E9a5c29D0f49a18Cb6f46692e3c71"

export const FUNCTION = "updateSatoshi"
export const PROPOSAL_DESCRIPTION = "Proposal #1: I am Satoshi Nakamoto."