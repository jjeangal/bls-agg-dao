// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract ecAdd {
    function callBn256Add(
        bytes32 ax,
        bytes32 ay,
        bytes32 bx,
        bytes32 by
    ) public returns (bytes32[2] memory result) {
        bytes32[4] memory input;
        input[0] = ax;
        input[1] = ay;
        input[2] = bx;
        input[3] = by;
        // 150 is the gas cost of performing the operation ecAdd
        uint256 gasCost = 150;
        assembly {
            // 0x06 is the precompile address for the bn256Add function
            let success := call(gasCost, 0x06, 0, input, 0x80, result, 0x40)
            switch success
            case 0 {
                revert(0, 0)
            }
        }
    }
}
