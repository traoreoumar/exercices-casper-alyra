import React, { useContext } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';

import "./VotingContent.scss";

import DefaultCard from '../DefaultCard/DefaultCard';
import ProposalsList from '../ProposalsList/ProposalsList';
import ProposalFormModal from '../ProposalFormModal/ProposalFormModal';
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
          <DefaultCard
            title='Votants'
            content={<VotersList isEditable={false}></VotersList>}
            footer={<VoterFormModal></VoterFormModal>}
          ></DefaultCard>

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
        <>
          <h2>Enregistrement des propositions</h2>
          <DefaultCard
            title='Propositions'
            content={<ProposalsList></ProposalsList>}
            footer={<ProposalFormModal></ProposalFormModal>}
          ></DefaultCard>

          <div>
            <Button className="ml-auto" onClick={(event) => setStatus(event, 'closeProposalRegistrationSession')}>
              Fermer la phase d'enregistrement des propositions
            </Button>
          </div>
        </>
      );
      break;

    case VotingWorkflowStatusEnum.ProposalsRegistrationEnded:
      content = (
        <>
          <h2>Fin de la période d'enregistrement des propositions</h2>
          <Container>
            <Row>
              <Col>
                <DefaultCard
                  title='Votants'
                  content={<VotersList></VotersList>}
                ></DefaultCard>
              </Col>

              <Col>
                <DefaultCard
                  title='Propositions'
                  content={<ProposalsList></ProposalsList>}
                ></DefaultCard>
              </Col>
            </Row>
          </Container>

          <div>
            <Button className="ml-auto" onClick={(event) => setStatus(event, 'openVotingSession')}>
              Ouvrir la phase de vote
            </Button>
          </div>
        </>
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
