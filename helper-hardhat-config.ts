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

export const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact

export const VOTING_DELAY = 1 // Number of blocks till a proposal vote becomes active
export const VOTING_PERIOD = 5 // Number or blocks
export const QUORUM_PERCENTAGE = 20 // % of voters to pass

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"