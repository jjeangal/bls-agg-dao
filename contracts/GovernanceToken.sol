// contracts/GovernanceToken.sol
// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {
    uint256 public _maxSupply = 10000000000000000000;

    constructor() ERC20("Governance Token", "GTKN") {
        _mint(msg.sender, _maxSupply);
    }
}
