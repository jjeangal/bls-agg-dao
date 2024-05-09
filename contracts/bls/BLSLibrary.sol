// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library BLSLibrary {
    // Enum for the signature errors
    enum SignatureError {
        NoError,
        InvalidSignature,
        InvalidSignatureLength,
        InvalidSignatures
    }

    // Enum for the cryptographic operation errors
    enum OperationError {
        NoError,
        InvalidOperation
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
     * @dev The cryptographic operation is invalid.
     */
    error InvalidCryptoOperation();

    /**
     * @dev Optionally reverts with the corresponding custom error according to the `error` argument provided.
     */
    function _throwSigError(
        SignatureError error,
        bytes32 errorArg
    ) internal pure {
        if (error == SignatureError.NoError) {
            return; // no error: do nothing
        } else if (error == SignatureError.InvalidSignature) {
            revert BLSInvalidSignature();
        } else if (error == SignatureError.InvalidSignatureLength) {
            revert BLSInvalidSignatureLength(uint256(errorArg));
        }
    }

    /**
     * @dev Optionally reverts with the corresponding custom error according to the `error` argument provided.
     */
    function _throwOpError(OperationError error) internal pure {
        if (error == OperationError.NoError) {
            return; // no error: do nothing
        } else if (error == OperationError.InvalidOperation) {
            revert InvalidCryptoOperation();
        }
    }
}
