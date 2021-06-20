import React, { useContext } from "react";
import { Button, Card } from 'react-bootstrap';

import "./VotingContent.scss";

import VotersList from '../VotersList/VotersList';
import VoterFormModal from '../VoterFormModal/VoterFormModal';
import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";
import { VotingWorkflowStatusEnum } from "../../interfaces/VotingWorkflowStatusEnum";

function VotingContent(props) {
  // Contexts
  const { accounts } = useContext(Web3Context);
  const { votingContract, status } = useContext(VotingContractContext);

  const setStatus = (event, methodName) => {
    event.preventDefault();
    event.stopPropagation();

    votingContract.methods[methodName]().send({ from: accounts[0] });
  }

  let content = (<></>);
  switch (status) {
    case VotingWorkflowStatusEnum.RegisteringVoters:
      content = (
        <>
          <h2>Enregistrement des Votants</h2>
          <Card>
            <Card.Header>
              <Card.Title>Votants</Card.Title>
            </Card.Header>

            <Card.Body>
              <VotersList></VotersList>
            </Card.Body>

            <Card.Footer className="card-footer-btn-fs">
              <VoterFormModal></VoterFormModal>
            </Card.Footer>
          </Card>

          <div>
            <Button className="ml-auto" onClick={(event) => setStatus(event, 'openProposalRegistrationSession')}>
              Fermer la phase d'enregistrement des votants
            </Button>
          </div>
        </>
      );
      break;

    case VotingWorkflowStatusEnum.ProposalsRegistrationStarted:
      content = (
        <p>ProposalsRegistrationStarted</p>
      );
      break;

    case VotingWorkflowStatusEnum.ProposalsRegistrationEnded:
      content = (
        <p>ProposalsRegistrationEnded</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotingSessionStarted:
      content = (
        <p>VotingSessionStarted</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotingSessionEnded:
      content = (
        <p>VotingSessionEnded</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotesTallied:
      content = (
        <p>VotesTallied</p>
      );
      break;
  
    default:
      break;
  }

  return (
    content
  );
}

export default VotingContent;
