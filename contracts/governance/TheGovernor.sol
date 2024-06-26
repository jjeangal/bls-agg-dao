// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./GovernorCouting.sol";
import {BLS} from "../bls/BLS.sol";
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract TheGovernor is
    Governor,
    GovernorSettings,
    GovernorCounting,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint48 _votingDelay,
        uint32 _votingPeriod,
        uint256 _quorumPercentage
    )
        Governor("TheGovernor")
        GovernorSettings(_votingDelay, _votingPeriod, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    /**
     * @dev The provided signature is not valid for the expected `voters`.
     * //  If the `voter` is a contract, the signature is not valid using {IERC1271-isValidSignature}.  // - from Governor
     */
    error GovernorInvalidAggSignature(/** address voter */);

    event AggVoteCast(
        uint256 numberOfVotes,
        uint256 proposalId,
        uint8 support,
        uint256 nbVoters,
        uint256 weight,
        string reason
    );

    event AggVoteCastWithParams(
        uint256 numberOfVotes,
        uint256 proposalId,
        uint8 support,
        uint256 nbVoters,
        uint256 weight,
        string reason,
        bytes params
    );

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    // To be called in the scripts
    function castVoteWithReasonAndBlsSig(
        uint256 proposalId,
        address[] memory accounts,
        uint256[2] memory signature,
        uint256[4] memory pubkeys,
        uint256[2] memory message,
        uint8 support,
        string memory reason
    ) public virtual returns (uint256, uint256[] memory) {
        bool valid = BLS.verifySingle(
            signature,
            pubkeys,
            message
        );

        if (!valid) {
            revert GovernorInvalidAggSignature();
        }
        return _castVoteAgg(proposalId, accounts, support, reason, "");
    }

    function _castVoteAgg(
        uint256 proposalId,
        address[] memory accounts,
        uint8 support,
        string memory reason,
        bytes memory params
    ) internal virtual returns (uint256 totalWeight, uint256[] memory weights) {
        validateStateBitmap(
            proposalId,
            _encodeStateBitmap(ProposalState.Active)
        );

        totalWeight = 0;
        uint256 nbVoters = accounts.length;
        weights = new uint256[](nbVoters);

        for (uint i = 0; i < accounts.length; i++) {
            address account = accounts[i];
            weights[i] = _getVotes(account, proposalSnapshot(proposalId), params);
            totalWeight += weights[i];
        }

        _countAggVotes(proposalId, accounts, weights, support, params);

        if (params.length == 0) {
            emit AggVoteCast(0, proposalId, support, nbVoters, totalWeight, reason);
        } else {
            emit AggVoteCastWithParams(
                0,
                proposalId,
                support,
                nbVoters,
                totalWeight,
                reason,
                params
            );
        }

        return (totalWeight, weights);
    }

    /**
     * @dev Check that the current state of a proposal matches the requirements described by the `allowedStates` bitmap.
     * This bitmap should be built using `_encodeStateBitmap`.
     *
     * If requirements are not met, reverts with a {GovernorUnexpectedProposalState} error.
     */
    function validateStateBitmap(
        uint256 proposalId,
        bytes32 allowedStates
    ) private view returns (ProposalState) {
        ProposalState currentState = state(proposalId);
        if (_encodeStateBitmap(currentState) & allowedStates == bytes32(0)) {
            revert GovernorUnexpectedProposalState(
                proposalId,
                currentState,
                allowedStates
            );
        }
        return currentState;
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}
