import React, { useContext } from "react";
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import "./VotersList.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";

function VotersList(props) {
  // Contexts
  const { accounts } = useContext(Web3Context);
  const { votingContract, votersAddresses } = useContext(VotingContractContext);

  const removeVoter = async (event, voterAddress) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        await votingContract.methods.removeVoter(voterAddress).send({ from: accounts[0] });
      } catch (error) {
          console.log(error);
      }
  };

  let content = (
    <ListGroup.Item>
      Aucun votants entegistrés
    </ListGroup.Item>
  );

  if (0 < votersAddresses.length) {
    content = votersAddresses.map((addressVoter) => {
      return (
        <ListGroup.Item>
          { props.isEditable
            ? (
              <Container>
                <Row>
                  <Col className="my-auto">{addressVoter}</Col>
                  <Col xs="auto">
                    <Button size="sm" variant="danger" onClick={(event) => removeVoter(event, addressVoter)}>
                      <Trash></Trash>
                    </Button>
                  </Col>
                </Row>
              </Container>
            )
            : (
              <>
                {addressVoter}
              </>
            )
          }
        </ListGroup.Item>
      );
    })
  }

  return (
    <>
      <ListGroup variant="flush">
        {content}
      </ListGroup>
    </>
  );
}

export default VotersList;
