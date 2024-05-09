// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {BLSLibrary} from "./BLSLibrary.sol";

contract BLS {
    // Field order for the elliptic curve y^2 = x^3 + 3
    uint256 constant N =
        21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Negated genarator of G2
    uint256 constant nG2x1 =
        11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant nG2x0 =
        10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant nG2y1 =
        17805874995975841540914202342111839520379459829704422454583296818431106115052;
    uint256 constant nG2y0 =
        13392588948715843804641432497768002650278120570034223513918757245338268106653;

    // Hash a message to a point on the elliptic curve
    function hashToPoint(
        bytes memory data
    ) public view returns (uint256[2] memory p) {
        return mapToPoint(keccak256(data));
    }

    // Map a field element to a point on the elliptic curve
    function mapToPoint(bytes32 _x) public view returns (uint256[2] memory p) {
        // Convert input to field element, a point on the curve
        uint256 x = uint256(_x) % N;
        uint256 y;
        bool found = false;
        while (true) {
            // Compute y^2 = x^3 + 3
            y = mulmod(x, x, N);
            y = mulmod(y, x, N);
            y = addmod(y, 3, N);
            (y, found) = sqrt(y);
            if (found) {
                p[0] = x;
                p[1] = y;
                break;
            }
            // Try the next x - hash and pray
            x = addmod(x, 1, N);
        }
    }

    // Verify a single BLS signature
    function verifySingle(
        uint256[2] memory signature,
        uint256[4] memory pubkey,
        uint256[2] memory message
    ) public view returns (bool) {
        uint256[12] memory input = [
            signature[0],
            signature[1],
            nG2x1,
            nG2x0,
            nG2y1,
            nG2y0,
            message[0],
            message[1],
            pubkey[1],
            pubkey[0],
            pubkey[3],
            pubkey[2]
        ];
        uint256[1] memory out;
        bool success;
        // Call the precompiled contract at address 8 - pairing
        assembly {
            success := staticcall(
                sub(gas(), 2000), // ensure that there is enough gas left
                8, // pairing precompile address
                input, // Start of input
                384, // 12 * 32 bytes - size of the input
                out, // Write the output
                0x20 // Expect 32 bytes of output
            )
            switch success
            case 0 {
                invalid()
            }
        }
        // Check if the pairing result is true
        if (!success) {
            BLSLibrary._throwSigError(
                BLSLibrary.SignatureError.InvalidSignature,
                0
            );
        }
        require(success, "");
        return out[0] != 0;
    }

    // function isValidSignature(
    //     uint256[2] memory signature
    // ) internal pure returns (bool) {
    //     if ((signature[0] >= N) || (signature[1] >= N)) {
    //         return false;
    //     } else {
    //         return isOnCurveG1(signature);
    //     }
    // }

    // function isValidPublicKey(
    //     uint256[4] memory publicKey
    // ) internal pure returns (bool) {
    //     if (
    //         (publicKey[0] >= N) ||
    //         (publicKey[1] >= N) ||
    //         (publicKey[2] >= N || (publicKey[3] >= N))
    //     ) {
    //         return false;
    //     } else {
    //         return isOnCurveG2(publicKey);
    //     }
    // }

    // Compute the square root of a field element
    function sqrt(uint256 xx) internal view returns (uint256 x, bool hasRoot) {
        bool callSuccess;
        assembly {
            // Load pointer to free memory (0x40)
            let freemem := mload(0x40)
            // Set up data segments of 32-byte steps in memory
            mstore(freemem, 0x20)
            mstore(add(freemem, 0x20), 0x20)
            mstore(add(freemem, 0x40), 0x20)
            // Store xx after the data segment
            mstore(add(freemem, 0x60), xx)
            // (N + 1) / 4 = 0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52
            mstore(
                add(freemem, 0x80),
                0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52
            )
            // N = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            mstore(
                add(freemem, 0xA0),
                0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            )

            // Call precompiled contracts at address 0x5 - modexp
            callSuccess := staticcall(
                sub(gas(), 2000),
                5, // modexp precompile address
                freemem, // Start address of the input
                0xC0, // Size of the input
                freemem, // Write the output over the input
                0x20 // Expect 32 bytes of output
            )

            // Load the result from the modexp call
            x := mload(freemem)
            // Find value x s.t. x^2 = xx mod N
            hasRoot := eq(xx, mulmod(x, x, N))
        }
        // Check if the modexp operation was successful
        if (!callSuccess) {
            BLSLibrary._throwOpError(
                BLSLibrary.OperationError.InvalidOperation
            );
        }
    }
}
