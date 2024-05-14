# DAO Protocol with BLS Aggregate Signature Verification

This DAO protocol allows for on-chain voting with BLS aggregate signature verification. It follows the OpenZeppelin standards for smart contract development and uses the elliptic curve 'alt_bn128' for BLS.

## Features

- **On-chain voting**: Allows for transparent and verifiable voting on the blockchain.
- **BLS aggregate signature verification**: Uses BLS aggregate signatures to verify votes, reducing the amount of data that needs to be stored on-chain.
- **OpenZeppelin standards**: Follows the best practices and standards set by OpenZeppelin for secure and reliable smart contract development.
- **Elliptic curve 'alt_bn128'**: Uses the elliptic curve 'alt_bn128' for BLS, which provides a balance of security and efficiency.

## Dependencies

This project uses the following dependencies:

- `@nomiclabs/hardhat-ethers`: For Ethereum development tasks.
- `@openzeppelin/contracts`: For reusable smart contracts following best practices.
- `ethers`: For interacting with the Ethereum blockchain.
- `mcl-wasm`: For BLS signature operations.

## Setup

1. Clone the repository.
2. Install the dependencies with `yarn install`.
3. Generate key pairs with `npx hardhat run scripts/generate-pairs.ts`.
4. Start a local Ethereum network with `npx hardhat node`.

## Testing

To test the full DAO process, run the following scripts in order:

1. Propose a new proposal with `npx hardhat run scripts/propose.ts --network localhost`.
2. Vote on the proposal with `npx hardhat run scripts/vote.ts --network localhost`.
3. Queue and execute the proposal with `npx hardhat run scripts/queue-and-execute.ts --network localhost`.

## Running Tests

Run the tests with `npx hardhat test`.

## Elliptic Curve 'alt_bn128' (also known as 'bn254')

This protocol uses the elliptic curve 'alt_bn128' which works on a 254 bit prime field, hence also referred to as 'bn254'. 

- We use 𝐺2 for public keys, and 𝐺1 for signatures and messages.
- 𝐺1 Uncompressed is 64 bytes.
- 𝐺2 Uncompressed is 128 bytes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT license.

### Credits

For more information on the implementation of BLS in Solidity, you can refer to this [guide](https://hackmd.io/@liangcc/bls-solidity#Hash-function).

A special thanks to Kobi Gurkan for his pioneering work on implementing BLS in Solidity for the alt-bn128 (also known as bn254) elliptic curve. You can refer to his implementation [here](https://gist.github.com/kobigurk/b9142a4755691bb12df59fbe999c2a1f#file-bls_with_help-sol-L129-L154).

Parts of this project are based on the work done in this [repository](https://github.com/kilic/evmbls). I have used some of their code and adapted it for my purposes. I am grateful for their contribution to the open source community.