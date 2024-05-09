// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract ecMul {
    function callBn256ScalarMul(
        bytes32 x,
        bytes32 y,
        bytes32 scalar
    ) public returns (bytes32[2] memory result) {
        bytes32[3] memory input;
        input[0] = x;
        input[1] = y;
        input[2] = scalar;
        // 6000 is the gas cost of performing the operation ecMul
        uint256 gasCost = 6000;
        assembly {
            let success := call(gasCost, 0x07, 0, input, 0x60, result, 0x40)
            switch success
            case 0 {
                revert(0, 0)
            }
        }
    }
}
