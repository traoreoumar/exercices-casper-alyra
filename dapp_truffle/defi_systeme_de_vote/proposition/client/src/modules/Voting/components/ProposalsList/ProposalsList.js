import React, { useContext } from "react";
import { ListGroup } from 'react-bootstrap';

import "./ProposalsList.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";

function ProposalsList(props) {
  // Contexts
  const { proposals } = useContext(VotingContractContext);

  let content = (
    <ListGroup.Item>
        Aucune proposition entegistrée
    </ListGroup.Item>
  );

  if (0 < proposals.length) {
    content = proposals.map((proposal) => {
      return (
        <ListGroup.Item>
          {proposal[0]}
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

export default ProposalsList;
