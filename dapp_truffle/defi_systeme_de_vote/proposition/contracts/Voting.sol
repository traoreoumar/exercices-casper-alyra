// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Implements voting
 */
contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event VoterUnregistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    uint private winningProposalId;
    uint private winningProposalVoteCount;

    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;
    mapping(string => bool) internal proposalsDescription;
    WorkflowStatus public status;
    uint internal lastProposalId;

    modifier onlyVoter() {
        require(voters[msg.sender].isRegistered, "Only voter can call this function");
        _;
    }

    // ------------------------------ Phase 1 : Manage voters list ------------------------------

    /** 
     * @dev Register a new voter
     * @param _voterAddress address of voter to register
     */
    function addVoter(address _voterAddress) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Registration voter session is closed"); // TODO: Gas costs: message too long (> 32)
        require(!voters[_voterAddress].isRegistered, "Voter already registered");
        require(address(0) != _voterAddress, "address(0) can't vote");

        Voter memory voterToAdd = Voter(true, false, 0);
        voters[_voterAddress] = voterToAdd;

        emit VoterRegistered(_voterAddress);
    }

    /** 
     * @dev Unregister a voter
     * @param _voterAddress address of voter to unregister
     */
    function removeVoter(address _voterAddress) external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Registration voter session is closed"); // TODO: Gas costs: message too long (> 32)
        require(voters[_voterAddress].isRegistered, "Voter not registered");

        delete voters[_voterAddress];

        emit VoterUnregistered(_voterAddress);
    }

    // ------------------------------ Phase 2 : Manage proposals registration session ------------------------------

    /** 
     * @dev Open the proposal registration session
     */
    function openProposalRegistrationSession() external onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Registration voter session is closed"); // TODO: Gas costs: message too long (> 32)
        status = WorkflowStatus.ProposalsRegistrationStarted;

        emit ProposalsRegistrationStarted();
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    /** 
     * @dev Add proposal to proposals list
     * @param _description proposal description
     */
    function addProposal(string memory _description) external onlyVoter {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registrations session is not started");
        require(false == proposalsDescription[_description] , "Proposal already added");
        require(0 < bytes(_description).length, "proposal is empty");

        lastProposalId++;

        Proposal memory proposalToAdd = Proposal(_description, 0);
        proposals[lastProposalId] = proposalToAdd;

        proposalsDescription[_description] = true;

        emit ProposalRegistered(lastProposalId);
    }

    /** 
     * @dev Close the proposal registration session
     */
    function closeProposalRegistrationSession() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registrations session is not started"); // TODO: Gas costs: message too long (> 32)
        status = WorkflowStatus.ProposalsRegistrationEnded;

        emit ProposalsRegistrationEnded();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    // ------------------------------ Phase 3 : Manage voting registration session ------------------------------

    /** 
     * @dev Open the voting session
     */
    function openVotingSession() external onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Proposals registration session is not closed"); // TODO: Gas costs: message too long (> 32)
        status = WorkflowStatus.VotingSessionStarted;

        emit VotingSessionStarted();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
    }

    /** 
     * @dev Vote for one proposal
     */
    function vote(uint _proposalId) external onlyVoter {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session is not started");
        require(!voters[msg.sender].hasVoted, "Voter already vote");
        require(0 < bytes(proposals[_proposalId].description).length, "Proposal not exists");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;

        proposals[_proposalId].voteCount++;

        if (winningProposalVoteCount < proposals[_proposalId].voteCount) {
            winningProposalVoteCount = proposals[_proposalId].voteCount;
            winningProposalId = _proposalId;
        }

        emit Voted(msg.sender, _proposalId);
    }

    /** 
     * @dev Close the voting session
     */
    function closeVotingSession() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session is not started");
        status = WorkflowStatus.VotingSessionEnded;

        emit VotingSessionEnded();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    // ------------------------------ Phase 4 : Tally votes ------------------------------

    /** 
     * @dev tally votes
     */
    function tallyVotes() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded, "Voting session is not closed");
        status = WorkflowStatus.VotesTallied;

        emit VotesTallied();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
    }

    function winningProposalDescription() external view returns(string memory) {
        require(status == WorkflowStatus.VotesTallied, "Votes not tallied");

        return proposals[winningProposalId].description;
    }
}
