import React, { useContext, useEffect, useState } from "react";
import { ListGroup } from 'react-bootstrap';

import "./ProposalsList.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";
import { VotingWorkflowStatusEnum } from "../../interfaces/VotingWorkflowStatusEnum";

function ProposalsList(props) {
  // Contexts
  const { accounts } = useContext(Web3Context);
  const { votingContract, proposals, status } = useContext(VotingContractContext);

  const [voter, setVoter] = useState(null);

  useEffect(() => {
    votingContract.events.Voted()
      .on('data', async (event) => {
        votingContract.methods.voters(accounts[0]).call()
          .then((voter) => {
            setVoter(voter);
          })
        ;
      })
      .on('error', (event) => {
        console.error(event);
      })
    ;
  }, [votingContract, accounts]);

  if (!voter) {
    votingContract.methods.voters(accounts[0]).call()
      .then((voter) => {
        setVoter(voter);
      })
    ;
  }

  const vote = (event, proposalId) => {
    event.preventDefault();
    votingContract.methods.vote(proposalId).send({ from: accounts[0] });
  }

  let content = (
    <ListGroup.Item>
        Aucune proposition entegistrée
    </ListGroup.Item>
  );

  if (0 < proposals.length) {
    content = proposals.map((proposal, proposalId) => {
      return (
        <ListGroup.Item
          variant={(voter && voter.hasVoted && proposalId === parseInt(voter.votedProposalId)) ? 'primary' : ''}
          action={VotingWorkflowStatusEnum.VotingSessionStarted === status && voter && !voter.hasVoted}
          onClick={(event) => vote(event, proposalId)}
        >
          {proposal.description}
        </ListGroup.Item>
      );
    });
  }

  return (
    <>
      <ListGroup variant="flush">
        {content}
      </ListGroup>
    </>
  );
}

export default ProposalsList;
