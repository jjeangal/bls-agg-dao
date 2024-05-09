// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

library BLS {
    enum RecoverError {
        NoError,
        InvalidSignature,
        InvalidSignatureLength,
        InvalidSignatureS
    }

    /**
     * @dev The signature derives the `address(0)`.
     */
    error BLSInvalidSignature();

    /**
     * @dev The signature has an invalid length.
     */
    error BLSInvalidSignatureLength(uint256 length);

    /**
     * @dev Optionally reverts with the corresponding custom error according to the `error` argument provided.
     */
    function _throwError(RecoverError error, bytes32 errorArg) private pure {
        if (error == RecoverError.NoError) {
            return; // no error: do nothing
        } else if (error == RecoverError.InvalidSignature) {
            revert BLSInvalidSignature();
        } else if (error == RecoverError.InvalidSignatureLength) {
            revert BLSInvalidSignatureLength(uint256(errorArg));
        }
    }
}
