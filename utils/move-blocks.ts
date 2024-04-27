import { network } from 'hardhat';

export async function moveBlock(amount: number) {
    console.log("----------------------------------------------------");
    console.log(`Moving ${amount} blocks forward...`);

    for (let i = 0; i < amount; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
    }
}
