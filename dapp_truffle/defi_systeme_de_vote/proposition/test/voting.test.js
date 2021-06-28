const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;
const Voting = artifacts.require('Voting');

contract('Voting', function (accounts) {
  const VotingWorkflowStatus = {
    RegisteringVoters: new BN(0),
    ProposalsRegistrationStarted: new BN(1),
    ProposalsRegistrationEnded: new BN(2),
    VotingSessionStarted: new BN(3),
    VotingSessionEnded: new BN(4),
    VotesTallied: new BN(5),
  };

  const owner = accounts[0];
  const votersAddresses = [
    accounts[1],
    accounts[2],
    accounts[3],
    accounts[4],
    accounts[5],
    accounts[6],
    accounts[7],
  ];
  const proposals = [
    'Proposal 01',
    'Proposal 02',
    'Proposal 03',
    'Proposal 04',
    'Proposal 05',
  ];

  beforeEach(async function () {
    this.VotingInstance = await Voting.new({ from: owner });
  });

  describe('initial state', function () {
    it('status is RegisteringVoters', async function () {
      const status = await this.VotingInstance.status();
      expect(status).to.be.bignumber.equal(VotingWorkflowStatus.RegisteringVoters);
    });
  });

  describe('add voter', function () {
    describe('accepts', function () {
      const voterAddress = votersAddresses[0];

      beforeEach(async function () {
        this.voterBeforeAddVoter = await this.VotingInstance.voters(voterAddress);
        this.votersAddressesBeforeAddVoter = await this.VotingInstance.getVotersAddresses();
        this.addVoterTx = await this.VotingInstance.addVoter(voterAddress, { from: owner });
      });

      it('update voters mapping', async function () {
        const voterAfterAddVoter = await this.VotingInstance.voters(voterAddress);

        expect(this.voterBeforeAddVoter.isRegistered).to.be.equal(false);
        expect(this.voterBeforeAddVoter.hasVoted).to.be.equal(false);
        expect(this.voterBeforeAddVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
        expect(this.voterBeforeAddVoter.index).to.be.bignumber.equal(new BN(0));

        expect(voterAfterAddVoter.isRegistered).to.be.equal(true);
        expect(voterAfterAddVoter.hasVoted).to.be.equal(false);
        expect(voterAfterAddVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
        expect(voterAfterAddVoter.index).to.be.bignumber.equal(new BN(this.votersAddressesBeforeAddVoter.length));
      });

      it('add address to votersAddresses', async function () {
        const votersAddressesAfterAddVoter = await this.VotingInstance.getVotersAddresses();

        expect(votersAddressesAfterAddVoter).to.be.an('array').have.members([...this.votersAddressesBeforeAddVoter, voterAddress]);
      });

      it('emits a VoterRegistered event', async function () {
        expectEvent(this.addVoterTx, 'VoterRegistered', {
          voterAddress,
        });
      });
    });

    describe('rejects', function () {
      it('a null account', async function () {
        await expectRevert(
          this.VotingInstance.addVoter(ZERO_ADDRESS, { from: owner }),
          "address(0) can't vote"
        );
      });

      it('caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.addVoter(votersAddresses[0], { from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('account already added', async function () {
        await this.VotingInstance.addVoter(votersAddresses[0], { from: owner });

        await expectRevert(
          this.VotingInstance.addVoter(votersAddresses[0], { from: owner }),
          "Voter already registered"
        );
      });

      it('when status is not RegisteringVoters', async function () {
        const error = "Registration voter session is closed";

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.addVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.addVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.addVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.addVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.addVoter(votersAddresses[0], { from: owner }), error);
      });
    });
  });

  describe('remove voter', function () {
    describe('accepts', function () {
      const voterAddress = votersAddresses[0];

      beforeEach(async function () {
        await this.VotingInstance.addVoter(voterAddress, { from: owner });
        await this.VotingInstance.addVoter(votersAddresses[1], { from: owner });
        await this.VotingInstance.addVoter(votersAddresses[2], { from: owner });
        await this.VotingInstance.addVoter(votersAddresses[3], { from: owner });

        this.voterBeforeRemoveVoter = await this.VotingInstance.voters(voterAddress);
        this.votersAddressesBeforeRemoveVoter = await this.VotingInstance.getVotersAddresses();
        this.removeVoterTx = await this.VotingInstance.removeVoter(voterAddress, { from: owner });
      });

      it('update voters mapping', async function () {
        const voterAfterRemoveVoter = await this.VotingInstance.voters(voterAddress);

        expect(this.voterBeforeRemoveVoter.isRegistered).to.be.equal(true);
        expect(this.voterBeforeRemoveVoter.hasVoted).to.be.equal(false);
        expect(this.voterBeforeRemoveVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
        expect(this.voterBeforeRemoveVoter.index).to.be.bignumber.equal(new BN(0));

        expect(voterAfterRemoveVoter.isRegistered).to.be.equal(false);
        expect(voterAfterRemoveVoter.hasVoted).to.be.equal(false);
        expect(voterAfterRemoveVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
        expect(voterAfterRemoveVoter.index).to.be.bignumber.equal(new BN(0));
      });

      it('remove address to votersAddresses', async function () {
        const votersAddressesAfterRemoveVoter = await this.VotingInstance.getVotersAddresses();

        expect(votersAddressesAfterRemoveVoter).to.be.an('array').have.members([votersAddresses[1], votersAddresses[2], votersAddresses[3]]);
      });

      it('update index of last voter', async function () {
        const votersAddressesAfterRemoveVoter = await this.VotingInstance.getVotersAddresses();

        expect(votersAddressesAfterRemoveVoter[0]).to.be.equal(votersAddresses[3]);

        const lastAddedVoterAfterRemoveVoter = await this.VotingInstance.voters(votersAddresses[3]);

        expect(lastAddedVoterAfterRemoveVoter.isRegistered).to.be.equal(true);
        expect(lastAddedVoterAfterRemoveVoter.hasVoted).to.be.equal(false);
        expect(lastAddedVoterAfterRemoveVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
        expect(lastAddedVoterAfterRemoveVoter.index).to.be.bignumber.equal(new BN(0));
      });

      it('emits a VoterUnregistered event', async function () {
        expectEvent(this.removeVoterTx, 'VoterUnregistered', {
          voterAddress,
        });
      });
    });

    describe('rejects', function () {
      it('account not added', async function () {
        await expectRevert(
          this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }),
          "Voter not registered"
        );
      });

      it('caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.removeVoter(votersAddresses[0], { from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not RegisteringVoters', async function () {
        const error = "Registration voter session is closed";

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.removeVoter(votersAddresses[0], { from: owner }), error);
      });
    });
  });

  describe('open proposal registration session', function () {
    describe('accepts', function () {
      beforeEach(async function () {
        this.openProposalRegistrationSessionTx = await this.VotingInstance.openProposalRegistrationSession({ from: owner });
      });

      it('status is ProposalsRegistrationStarted', async function () {
        const status = await this.VotingInstance.status();
        expect(status).to.be.bignumber.equal(VotingWorkflowStatus.ProposalsRegistrationStarted);
      });

      it('emits a ProposalsRegistrationStarted event', async function () {
        expectEvent(this.openProposalRegistrationSessionTx, 'ProposalsRegistrationStarted', {});
      });

      it('emits a WorkflowStatusChange event', async function () {
        expectEvent(this.openProposalRegistrationSessionTx, 'WorkflowStatusChange', {
          previousStatus: VotingWorkflowStatus.RegisteringVoters,
          newStatus: VotingWorkflowStatus.ProposalsRegistrationStarted,
        });
      });
    });

    describe('rejects', function () {
      it('when caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.openProposalRegistrationSession({ from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not RegisteringVoters', async function () {
        const error = "Registration voter session is closed";

        this.VotingInstance.openProposalRegistrationSession({ from: owner });

        await expectRevert(this.VotingInstance.openProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.openProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.openProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.openProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.openProposalRegistrationSession({ from: owner }), error);
      });
    });
  });

  describe('add proposal', function () {
    const voterAddress = votersAddresses[0];
    const proposal = proposals[0];

    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.addVoter(voterAddress, { from: owner });
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });

        this.proposalBeforeAddProposal = await this.VotingInstance.getProposals();
        this.addProposalTx = await this.VotingInstance.addProposal(proposal, { from: voterAddress });
      });

      it('add proposal to proposals', async function () {
        const proposalsAfterAddVoter = await this.VotingInstance.getProposals();

        expect(proposalsAfterAddVoter[proposalsAfterAddVoter.length - 1].description).to.be.equal(proposal);
        expect(proposalsAfterAddVoter[proposalsAfterAddVoter.length - 1].voteCount).to.be.equal('0');
      });

      it('emits a ProposalRegistered event', async function () {
        expectEvent(this.addProposalTx, 'ProposalRegistered', {
          proposalId: new BN(this.proposalBeforeAddProposal.length),
        });
      });
    });

    describe('rejects', function () {
      describe('test', function () {
        beforeEach(async function () {
          await this.VotingInstance.addVoter(voterAddress, { from: owner });
          await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        });

        it('an empty proposal', async function () {
          await expectRevert(
            this.VotingInstance.addProposal('', { from: voterAddress }),
            "proposal is empty"
          );
        });

        it('caller is not voter', async function () {
          await expectRevert(
            this.VotingInstance.addProposal(proposal, { from: owner }),
            "Only voter can call this function"
          );
        });

        it('proposal already added', async function () {
          await this.VotingInstance.addProposal(proposal, { from: voterAddress });

          await expectRevert(
            this.VotingInstance.addProposal(proposal, { from: voterAddress }),
            "Proposal already added"
          );
        });
      });

      it('when status is not ProposalsRegistrationStarted', async function () {
        const error = "Proposals registrations session is not started";

        await this.VotingInstance.addVoter(voterAddress, { from: owner });

        await expectRevert(this.VotingInstance.addProposal(proposal, { from: voterAddress }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.addProposal(proposal, { from: voterAddress }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.addProposal(proposal, { from: voterAddress }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.addProposal(proposal, { from: voterAddress }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.addProposal(proposal, { from: voterAddress }), error);
      });
    });
  });

  describe('close proposal registration session', function () {
    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        this.closeProposalRegistrationSessionTx = await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
      });

      it('status is ProposalsRegistrationEnded', async function () {
        const status = await this.VotingInstance.status();
        expect(status).to.be.bignumber.equal(VotingWorkflowStatus.ProposalsRegistrationEnded);
      });

      it('emits a ProposalsRegistrationEnded event', async function () {
        expectEvent(this.closeProposalRegistrationSessionTx, 'ProposalsRegistrationEnded', {});
      });

      it('emits a WorkflowStatusChange event', async function () {
        expectEvent(this.closeProposalRegistrationSessionTx, 'WorkflowStatusChange', {
          previousStatus: VotingWorkflowStatus.ProposalsRegistrationStarted,
          newStatus: VotingWorkflowStatus.ProposalsRegistrationEnded,
        });
      });
    });

    describe('rejects', function () {
      it('when caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.closeProposalRegistrationSession({ from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not ProposalsRegistrationStarted', async function () {
        const error = "Proposals registrations session is not started";

        await expectRevert(this.VotingInstance.closeProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });

        await expectRevert(this.VotingInstance.closeProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.closeProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.closeProposalRegistrationSession({ from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.closeProposalRegistrationSession({ from: owner }), error);
      });
    });
  });

  describe('open voting session', function () {
    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        this.openVotingSessionTx = await this.VotingInstance.openVotingSession({ from: owner });
      });

      it('status is VotingSessionStarted', async function () {
        const status = await this.VotingInstance.status();
        expect(status).to.be.bignumber.equal(VotingWorkflowStatus.VotingSessionStarted);
      });

      it('emits a VotingSessionStarted event', async function () {
        expectEvent(this.openVotingSessionTx, 'VotingSessionStarted', {});
      });

      it('emits a WorkflowStatusChange event', async function () {
        expectEvent(this.openVotingSessionTx, 'WorkflowStatusChange', {
          previousStatus: VotingWorkflowStatus.ProposalsRegistrationEnded,
          newStatus: VotingWorkflowStatus.VotingSessionStarted,
        });
      });
    });

    describe('rejects', function () {
      it('when caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.closeVotingSession({ from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not ProposalsRegistrationEnded', async function () {
        const error = "Proposals registration session is not closed";

        await expectRevert(this.VotingInstance.openVotingSession({ from: owner }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.openVotingSession({ from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await this.VotingInstance.openVotingSession({ from: owner });

        await expectRevert(this.VotingInstance.openVotingSession({ from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.openVotingSession({ from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.openVotingSession({ from: owner }), error);
      });
    });
  });

  describe('vote', function () {
    const voterAddress = votersAddresses[0];
    const proposal = proposals[0];

    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.addVoter(voterAddress, { from: owner });
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.getProposals({ from: owner });
        await this.VotingInstance.addProposal(proposal, { from: voterAddress });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await this.VotingInstance.openVotingSession({ from: owner });

        this.voteCountBeforeVote = (await this.VotingInstance.proposals(0)).voteCount;
        this.voteTx = await this.VotingInstance.vote(0, { from: voterAddress });
      });

      it('set hasVoted Voter attribute', async function () {
        const voterAfterVote = await this.VotingInstance.voters(voterAddress);

        expect(voterAfterVote.hasVoted).to.be.equal(true);
      });

      it('update proposal vote count', async function () {
        const voteCountAfterVote = (await this.VotingInstance.proposals(0)).voteCount;

        expect(voteCountAfterVote).to.be.bignumber.equal(this.voteCountBeforeVote.add(new BN(1)));
      });

      it('emits a Voted event', async function () {
        expectEvent(this.voteTx, 'Voted', {
          voter: voterAddress,
          proposalId: new BN(0),
        });
      });
    });

    describe('rejects', function () {
      describe('test', function () {
        beforeEach(async function () {
          await this.VotingInstance.addVoter(voterAddress, { from: owner });
          await this.VotingInstance.openProposalRegistrationSession({ from: owner });
          await this.VotingInstance.getProposals({ from: owner });
          await this.VotingInstance.addProposal(proposal, { from: voterAddress });
          await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
          await this.VotingInstance.openVotingSession({ from: owner });
        });
  
        it('caller is not voter', async function () {
          await expectRevert(
            this.VotingInstance.vote(0, { from: owner }),
            "Only voter can call this function"
          );
        });

        it('voter already vote', async function () {
          await this.VotingInstance.vote(0, { from: voterAddress });

          await expectRevert(
            this.VotingInstance.vote(0, { from: voterAddress }),
            "Voter already vote"
          );
        });

        it('proposal not exists', async function () {
          await expectRevert(
            this.VotingInstance.vote(1, { from: voterAddress }),
            "Proposal not exists"
          );
        });
      });

      it('Voting session is not started', async function () {
        const error = "Voting session is not started";

        await this.VotingInstance.addVoter(voterAddress, { from: owner });

        await expectRevert(this.VotingInstance.vote(0, { from: voterAddress }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.vote(0, { from: voterAddress }), error);

        this.VotingInstance.addProposal(proposal, { from: voterAddress });

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.vote(0, { from: voterAddress }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        this.VotingInstance.vote(0, { from: voterAddress });

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.vote(0, { from: voterAddress }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.vote(0, { from: voterAddress }), error);
      });
    });
  });

  describe('close voting session', function () {
    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await this.VotingInstance.openVotingSession({ from: owner });
        this.closeVotingSessionTx = await this.VotingInstance.closeVotingSession({ from: owner });
      });

      it('status is VotingSessionEnded', async function () {
        const status = await this.VotingInstance.status();
        expect(status).to.be.bignumber.equal(VotingWorkflowStatus.VotingSessionEnded);
      });

      it('emits a VotingSessionEnded event', async function () {
        expectEvent(this.closeVotingSessionTx, 'VotingSessionEnded', {});
      });

      it('emits a WorkflowStatusChange event', async function () {
        expectEvent(this.closeVotingSessionTx, 'WorkflowStatusChange', {
          previousStatus: VotingWorkflowStatus.VotingSessionStarted,
          newStatus: VotingWorkflowStatus.VotingSessionEnded,
        });
      });
    });

    describe('rejects', function () {
      it('when caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.closeVotingSession({ from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not ProposalsRegistrationEnded', async function () {
        const error = "Voting session is not started";

        await expectRevert(this.VotingInstance.closeVotingSession({ from: owner }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.closeVotingSession({ from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.closeVotingSession({ from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await this.VotingInstance.closeVotingSession({ from: owner });

        await expectRevert(this.VotingInstance.closeVotingSession({ from: owner }), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        await expectRevert(this.VotingInstance.closeVotingSession({ from: owner }), error);
      });
    });
  });

  describe('tally votes', function () {
    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await this.VotingInstance.openVotingSession({ from: owner });
        await this.VotingInstance.closeVotingSession({ from: owner });
        this.tallyVotesSessionTx = await this.VotingInstance.tallyVotes({ from: owner });
      });

      it('status is VotesTallied', async function () {
        const status = await this.VotingInstance.status();
        expect(status).to.be.bignumber.equal(VotingWorkflowStatus.VotesTallied);
      });

      it('emits a VotesTallied event', async function () {
        expectEvent(this.tallyVotesSessionTx, 'VotesTallied', {});
      });

      it('emits a WorkflowStatusChange event', async function () {
        expectEvent(this.tallyVotesSessionTx, 'WorkflowStatusChange', {
          previousStatus: VotingWorkflowStatus.VotingSessionEnded,
          newStatus: VotingWorkflowStatus.VotesTallied,
        });
      });
    });

    describe('rejects', function () {
      it('when caller is not owner', async function () {
        await expectRevert(
          this.VotingInstance.tallyVotes({ from: votersAddresses[0] }),
          "Ownable: caller is not the owner"
        );
      });

      it('when status is not ProposalsRegistrationEnded', async function () {
        const error = "Voting session is not closed";

        await expectRevert(this.VotingInstance.tallyVotes({ from: owner }), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.tallyVotes({ from: owner }), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.tallyVotes({ from: owner }), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.tallyVotes({ from: owner }), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await this.VotingInstance.tallyVotes({ from: owner });

        await expectRevert(this.VotingInstance.tallyVotes({ from: owner }), error);
      });
    });
  });

  describe('winning proposal', function () {
    const voterAddress = votersAddresses[0];
    const proposalId = 2;

    describe('accepts', function () {
      beforeEach(async function () {
        await this.VotingInstance.addVoter(voterAddress, { from: owner });
        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await this.VotingInstance.getProposals({ from: owner });
        await this.VotingInstance.addProposal(proposals[0], { from: voterAddress });
        await this.VotingInstance.addProposal(proposals[1], { from: voterAddress });
        await this.VotingInstance.addProposal(proposals[2], { from: voterAddress });
        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await this.VotingInstance.openVotingSession({ from: owner });
        await this.VotingInstance.vote(proposalId, { from: voterAddress });
        await this.VotingInstance.closeVotingSession({ from: owner });
        await this.VotingInstance.tallyVotes({ from: owner });
      });

      it('winningProposalId', async function () {
        const winningProposalId = await this.VotingInstance.getWinningProposalId();

        expect(winningProposalId).to.be.bignumber.equal(new BN(proposalId));
      });

      it('winningProposal', async function () {
        const winningProposal = await this.VotingInstance.winningProposal();

        expect(winningProposal.description).to.equal(proposals[proposalId]);
        expect(winningProposal.voteCount).to.equal('1');
      });
    });

    describe('rejects', function () {
      it('Vote not tallied', async function () {
        const error = "Votes not tallied";

        await expectRevert(this.VotingInstance.getWinningProposalId(), error);
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);

        await this.VotingInstance.openProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);

        await this.VotingInstance.closeProposalRegistrationSession({ from: owner });
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);

        await this.VotingInstance.openVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);

        await this.VotingInstance.closeVotingSession({ from: owner });
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);
        await expectRevert(this.VotingInstance.getWinningProposalId(), error);

        await this.VotingInstance.tallyVotes({ from: owner });
        this.VotingInstance.getWinningProposalId();
        this.VotingInstance.getWinningProposalId();
      });
    });
  });

  describe('nominal case', function () {
    it('working', async function () {
      for (const voterAddress of votersAddresses) {
        await this.VotingInstance.addVoter(voterAddress, { from: owner });
      }

      await this.VotingInstance.openProposalRegistrationSession({ from: owner });

      await this.VotingInstance.addProposal(proposals[0], { from: votersAddresses[0] });
      await this.VotingInstance.addProposal(proposals[1], { from: votersAddresses[1] });
      await this.VotingInstance.addProposal(proposals[2], { from: votersAddresses[2] });
      await this.VotingInstance.addProposal(proposals[3], { from: votersAddresses[3] });
      await this.VotingInstance.addProposal(proposals[4], { from: votersAddresses[0] });

      await this.VotingInstance.closeProposalRegistrationSession({ from: owner });

      await this.VotingInstance.openVotingSession({ from: owner });

      await this.VotingInstance.vote(1, { from: votersAddresses[0] });
      await this.VotingInstance.vote(2, { from: votersAddresses[1] });
      await this.VotingInstance.vote(3, { from: votersAddresses[2] });
      await this.VotingInstance.vote(0, { from: votersAddresses[3] });
      await this.VotingInstance.vote(1, { from: votersAddresses[4] });
      await this.VotingInstance.vote(0, { from: votersAddresses[5] });
      await this.VotingInstance.vote(1, { from: votersAddresses[6] });

      await this.VotingInstance.closeVotingSession({ from: owner });

      await this.VotingInstance.tallyVotes({ from: owner });

      const winningProposalId = await this.VotingInstance.getWinningProposalId();
      const winningProposal = await this.VotingInstance.winningProposal();

      expect(winningProposalId).to.be.bignumber.equal(new BN(1));
      expect(winningProposal.description).to.equal(proposals[1]);
      expect(winningProposal.voteCount).to.equal('3');
    });
  });
});
