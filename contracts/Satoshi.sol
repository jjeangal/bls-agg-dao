// contracts/Satoshi.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Satoshi is Ownable {
    address private _satoshi;

    event SatoshiFound(address indexed satoshi);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function updateSatoshi(address satoshi) external onlyOwner {
        _satoshi = satoshi;
        emit SatoshiFound(satoshi);
    }

    function getSatoshi() external view returns (address) {
        return _satoshi;
    }
}
