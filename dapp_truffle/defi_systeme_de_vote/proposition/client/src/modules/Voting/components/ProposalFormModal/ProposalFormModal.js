import React, { useContext, useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';

import "./ProposalFormModal.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";

function ProposalFormModal(props) {
  // Contexts
  const { accounts } = useContext(Web3Context);
  const { votingContract } = useContext(VotingContractContext);

  const [showNewProposalModal, setShowNewProposalModal] = useState(false);

  const closeNewProposalModal = () => setShowNewProposalModal(false);
  const openNewProposalModal = () => setShowNewProposalModal(true);
  const addProposal = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      const { proposal } = Object.fromEntries(formData.entries());

      try {
        await votingContract.methods.addProposal(proposal).send({ from: accounts[0] });

        closeNewProposalModal();
      } catch (error) {
          console.log(error);
      }
  };

  return (
    <>
      <Button variant="primary" onClick={openNewProposalModal}>Ajouter une proposition</Button>

      <Modal show={showNewProposalModal} onHide={closeNewProposalModal}>
        <Form onSubmit={addProposal}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une proposition</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="formProposalDescription">
              <Form.Label>Proposition</Form.Label>
              <Form.Control as="textarea" name="proposal" required/>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeNewProposalModal}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ProposalFormModal;
