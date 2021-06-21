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
  const { votingContract, owner, votersAddresses, status } = useContext(VotingContractContext);

  const isOwner = owner && accounts[0] && owner.toUpperCase() === accounts[0].toUpperCase();
  const isVoter = votersAddresses
    && accounts[0]
    && votersAddresses.map((voterAddress) => voterAddress.toUpperCase()).includes(accounts[0].toUpperCase())
  ;

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
            content={<VotersList isEditable={isOwner}></VotersList>}
            footer={isOwner
              ? <VoterFormModal></VoterFormModal>
              : <></>
            }
          ></DefaultCard>

          {isOwner
            ? (
              <div>
                <Button className="ml-auto" onClick={(event) => setStatus(event, 'openProposalRegistrationSession')}>
                  Fermer la phase d'enregistrement des votants
                </Button>
              </div>
            )
            : <></>
          }
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
            footer={isVoter
              ? <ProposalFormModal></ProposalFormModal>
              : <></>
            }
          ></DefaultCard>

          {isOwner
            ? (
              <div>
                <Button className="ml-auto" onClick={(event) => setStatus(event, 'closeProposalRegistrationSession')}>
                  Fermer la phase d'enregistrement des propositions
                </Button>
              </div>
            )
            : <></>
          }
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

          {isOwner
            ? (
              <div>
                <Button className="ml-auto" onClick={(event) => setStatus(event, 'openVotingSession')}>
                  Ouvrir la phase de vote
                </Button>
              </div>
            )
            : <></>
          }
        </>
      );
      break;

    case VotingWorkflowStatusEnum.VotingSessionStarted:
    case VotingWorkflowStatusEnum.VotingSessionEnded:
      let title = 'Période de vote';
      let setStatuslabel = 'Fermer la phase de vote';
      let setStatusMethodName = 'closeVotingSession';

      if (VotingWorkflowStatusEnum.VotingSessionEnded === status) {
        title = 'Fin de la période de vote';
        setStatuslabel = 'Comptabiliser les votes';
        setStatusMethodName = 'tallyVotes';
      }

      if (isOwner) {
        content = (
          <>
            <h2>{title}</h2>
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
              <Button className="ml-auto" onClick={(event) => setStatus(event, setStatusMethodName)}>
                {setStatuslabel}
              </Button>
            </div>
          </>
        );
      } else {
        content = (
          <>
            <h2>{title}</h2>
            <DefaultCard
              title='Propositions'
              content={<ProposalsList></ProposalsList>}
            ></DefaultCard>
          </>
        );
      }
      break;

    case VotingWorkflowStatusEnum.VotesTallied:
      content = (
        <>
          <h2>Résultat du vote</h2>
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
        </>
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
