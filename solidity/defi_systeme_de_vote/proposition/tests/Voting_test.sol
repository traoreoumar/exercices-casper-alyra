// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "remix_tests.sol"; // this import is automatically injected by Remix.
import "remix_accounts.sol";
import "../contracts/Voting.sol";

contract AbstractVotingSuite {

    Voting public votingToTest;

    function beforeEach() public virtual {
        votingToTest = new Voting();
    }
}

// ------------------------------ Test addVoter ------------------------------

contract VotingSuite01AddVoter is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkAddVoter0Fail() public {
        try votingToTest.addVoter(address(0)) {
            Assert.ok(false, "addVoter - Test add address 0 - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "address(0) can't vote", string(abi.encodePacked("addVoter - Test add address 0 - Test Failed : ", _err)));
        }
    }

    function checkAddVoter1Success() public {
        try votingToTest.addVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("addVoter - Test add not registered address - Test Failed : ", _err)));
        }
    }

    function checkAddVoter1AgainFail() public {
        votingToTest.addVoter(TestsAccounts.getAccount(0));

        try votingToTest.addVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(false, "addVoter - Test add already registered address - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voter already registered", string(abi.encodePacked("addVoter - Test add already registered address - Test Failed : ", _err)));
        }
    }

    function checkAddVoter1DuringWrongSessionFail() public {
        votingToTest.openProposalRegistrationSession();

        try votingToTest.addVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(false, "addVoter - Test add address 1 during wrong session - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Registration voter session is closed", string(abi.encodePacked("addVoter - Test add address 1 during wrong session - Test Failed : ", _err)));
        }
    }

    function checkAddVoter1WithNotAdminFail() public {
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.addVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(false, "addVoter - Test add address 1 with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("addVoter - Test add address 1 with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test removeVoter ------------------------------

contract VotingSuite02RemoveVoter is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkRemoveNotAddedVoterFail() public {
        try votingToTest.removeVoter(address(0)) {
            Assert.ok(false, "removeVoter - Test remove not added address - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voter not registered", string(abi.encodePacked("removeVoter - Test remove not added address - Test Failed : ", _err)));
        }
    }

    function checkRemoveAddedVoterSuccess() public {
        votingToTest.addVoter(TestsAccounts.getAccount(0));

        try votingToTest.removeVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("removeVoter - Test remove added address - Test Failed : ", _err)));
        }
    }

    function checkRemoveVoter1DuringWrongSessionFail() public {
        votingToTest.addVoter(TestsAccounts.getAccount(0));
        votingToTest.openProposalRegistrationSession();

        try votingToTest.removeVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(false, "removeVoter - Test add address 1 during wrong session - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Registration voter session is closed", string(abi.encodePacked("removeVoter - Test add address 1 during wrong session - Test Failed : ", _err)));
        }
    }

    function checkRemoveVoter1WithNotAdminFail() public {
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.removeVoter(TestsAccounts.getAccount(0)) {
            Assert.ok(false, "removeVoter - Test add address 1 with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("removeVoter - Test add address 1 with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test openProposalRegistrationSession ------------------------------

contract VotingSuite03OpenProposalRegistrationSession is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkOpenProposalRegistrationSessionDuringWrongSessionFail() public {
        votingToTest.openProposalRegistrationSession();

        try votingToTest.openProposalRegistrationSession() {
            Assert.ok(false, "openProposalRegistrationSession - not during RegisteringVoters - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Registration voter session is closed", string(abi.encodePacked("openProposalRegistrationSession - not during RegisteringVoters - Test Failed : ", _err)));
        }
    }

    function checkOpenProposalRegistrationSessionDuringRightSessionSuccess() public {
        votingToTest.addVoter(TestsAccounts.getAccount(0));

        try votingToTest.openProposalRegistrationSession() {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("openProposalRegistrationSession - during RegisteringVoters - Test Failed : ", _err)));
        }
    }

    function checkOpenProposalRegistrationSessionWithNotAdminFail() public {
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.openProposalRegistrationSession() {
            Assert.ok(false, "openProposalRegistrationSession - with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("openProposalRegistrationSession - with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test addProposal ------------------------------

contract VotingSuite04AddProposal is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkAddProposalDuringWrongSessionFail() public {
        votingToTest.addVoter(address(this));

        try votingToTest.addProposal("Proposal 1 description") {
            Assert.ok(false, "addProposal - during wrong session (not ProposalsRegistrationStarted) - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Proposals registrations session is not started", string(abi.encodePacked("addProposal - during wrong session (not ProposalsRegistrationStarted) - Test Failed : ", _err)));
        }
    }

    function checkAddEmptyProposalFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();

        try votingToTest.addProposal("") {
            Assert.ok(false, "addProposal - empty proposal - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "proposal is empty", string(abi.encodePacked("addProposal - empty proposal - Test Failed : ", _err)));
        }
    }

    function checkAddProposalSuccess() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();

        try votingToTest.addProposal("Proposal 1 description") {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("addProposal - valid proposal - Test Failed : ", _err)));
        }
    }

    function checkAddProposalTwiceFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");

        try votingToTest.addProposal("Proposal 1 description") {
            Assert.ok(false, "addProposal - add proposal twice - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Proposal already added", string(abi.encodePacked("addProposal - add proposal twice - Test Failed : ", _err)));
        }
    }

    function checkAddProposalWithNotVoterFail() public {
        try votingToTest.addProposal("Proposal 1 description") {
            Assert.ok(false, "addProposal - with not voter - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Only voter can call this function", string(abi.encodePacked("addProposal - with not voter - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test closeProposalRegistrationSession ------------------------------

contract VotingSuite05CloseProposalRegistrationSession is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkCloseProposalRegistrationSessionDuringWrongSessionFail() public {
        try votingToTest.closeProposalRegistrationSession() {
            Assert.ok(false, "closeProposalRegistrationSession - not during ProposalsRegistrationStarted - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Proposals registrations session is not started", string(abi.encodePacked("closeProposalRegistrationSession - not during ProposalsRegistrationStarted - Test Failed : ", _err)));
        }
    }

    function checkCloseProposalRegistrationSessionDuringRightSessionSuccess() public {
        votingToTest.openProposalRegistrationSession();

        try votingToTest.closeProposalRegistrationSession() {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("closeProposalRegistrationSession - during ProposalsRegistrationStarted - Test Failed : ", _err)));
        }
    }

    function checkCloseProposalRegistrationSessionWithNotAdminFail() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.closeProposalRegistrationSession() {
            Assert.ok(false, "closeProposalRegistrationSession - with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("closeProposalRegistrationSession - with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test openVotingSession ------------------------------

contract VotingSuite06OpenVotingSession is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkOpenVotingSessionDuringWrongSessionFail() public {
        try votingToTest.openVotingSession() {
            Assert.ok(false, "openVotingSession - not during ProposalsRegistrationEnded - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Proposals registration session is not closed", string(abi.encodePacked("openVotingSession - not during ProposalsRegistrationEnded - Test Failed : ", _err)));
        }
    }

    function checkOpenVotingSessionDuringRightSessionSuccess() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.closeProposalRegistrationSession();

        try votingToTest.openVotingSession() {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("openVotingSession - during ProposalsRegistrationEnded - Test Failed : ", _err)));
        }
    }

    function checkOpenVotingSessionWithNotAdminFail() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.closeProposalRegistrationSession();
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.openVotingSession() {
            Assert.ok(false, "openVotingSession - with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("openVotingSession - with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test vote ------------------------------

contract VotingSuite07Vote is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkVoteDuringWrongSessionFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();

        try votingToTest.vote(1) {
            Assert.ok(false, "vote - during wrong session (not VotingSessionStarted) - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voting session is not started", string(abi.encodePacked("vote - during wrong session (not VotingSessionStarted) - Test Failed : ", _err)));
        }
    }

    function checkVoteForNonExistantProposalFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();

        try votingToTest.vote(2) {
            Assert.ok(false, "vote - proposal not exists - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Proposal not exists", string(abi.encodePacked("vote - proposal not exists - Test Failed : ", _err)));
        }
    }

    function checkVoteSuccess() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();

        try votingToTest.vote(1) {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("vote - valid vote - Test Failed : ", _err)));
        }
    }

    function checkVoteTwiceFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);

        try votingToTest.vote(1) {
            Assert.ok(false, "vote - vote twice - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voter already vote", string(abi.encodePacked("vote - vote twice - Test Failed : ", _err)));
        }
    }

    function checkVoteWithNotVoterFail() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();

        try votingToTest.vote(1) {
            Assert.ok(false, "vote - with not voter - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Only voter can call this function", string(abi.encodePacked("vote - with not voter - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test closeVotingSession ------------------------------

contract VotingSuite08CloseVotingSession is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkCloseVotingSessionDuringWrongSessionFail() public {
        try votingToTest.closeVotingSession() {
            Assert.ok(false, "closeVotingSession - not during VotingSessionStarted - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voting session is not started", string(abi.encodePacked("closeVotingSession - not during VotingSessionStarted - Test Failed : ", _err)));
        }
    }

    function checkCloseVotingSessionDuringRightSessionSuccess() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();

        try votingToTest.closeVotingSession() {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("closeVotingSession - during VotingSessionStarted - Test Failed : ", _err)));
        }
    }

    function checkCloseVotingSessionWithNotAdminFail() public {
        votingToTest.openProposalRegistrationSession();
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.closeVotingSession() {
            Assert.ok(false, "closeVotingSession - with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("closeVotingSession - with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test tallyVotes ------------------------------

contract VotingSuite09TallyVotes is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkTallyVotesDuringWrongSessionFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);

        try votingToTest.tallyVotes() {
            Assert.ok(false, "tallyVotes - not during VotingSessionEnded - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Voting session is not closed", string(abi.encodePacked("tallyVotes - not during VotingSessionEnded - Test Failed : ", _err)));
        }
    }

    function checkTallyVotesDuringRightSessionSuccess() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);
        votingToTest.closeVotingSession();

        try votingToTest.tallyVotes() {
            Assert.ok(true, "");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("tallyVotes - during VotingSessionStarted - Test Failed : ", _err)));
        }
    }

    function checkTallyVotesWithNotAdminFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);
        votingToTest.closeVotingSession();
        votingToTest.transferOwnership(TestsAccounts.getAccount(0));

        try votingToTest.tallyVotes() {
            Assert.ok(false, "tallyVotes - with not admin - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Ownable: caller is not the owner", string(abi.encodePacked("tallyVotes - with not admin - Test Failed : ", _err)));
        }
    }
}

// ------------------------------ Test winningProposalDescription ------------------------------

contract VotingSuite10WinningProposalDescription is AbstractVotingSuite {

    function beforeEach() public override(AbstractVotingSuite) {
        super.beforeEach();
    }

    function checkWinningProposalDescriptionDuringWrongSessionFail() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);

        try votingToTest.winningProposalDescription() {
            Assert.ok(false, "winningProposalDescription - during wrong session (not VotesTallied) - Test Failed : function execution should fail");
        } catch Error(string memory _err) {
            Assert.equal(_err, "Votes not tallied", string(abi.encodePacked("winningProposalDescription - during wrong session (not VotesTallied) - Test Failed : ", _err)));
        }
    }

    function checkWinningProposalDescriptionDuringRightSessionSuccess() public {
        votingToTest.addVoter(address(this));
        votingToTest.openProposalRegistrationSession();
        votingToTest.addProposal("Proposal 1 description");
        votingToTest.closeProposalRegistrationSession();
        votingToTest.openVotingSession();
        votingToTest.vote(1);
        votingToTest.closeVotingSession();
        votingToTest.tallyVotes();

        try votingToTest.winningProposalDescription() returns(string memory winningProposalDescription) {
            Assert.equal("Proposal 1 description", winningProposalDescription, "winningProposalDescription - during VotingSessionStarted - Test Failed : winningProposalDescription - when status == VotesTallied - Test Failed : Wrong winning proposal description");
        } catch Error(string memory _err) {
            Assert.ok(false, string(abi.encodePacked("winningProposalDescription - during VotingSessionStarted - Test Failed : ", _err)));
        }
    }
}
