import React, { useContext, useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';

import "./VoterFormModal.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";

function VoterFormModal(props) {
  // Contexts
  const { accounts } = useContext(Web3Context);
  const { votingContract } = useContext(VotingContractContext);

  const [showNewVoterModal, setShowNewVoterModal] = useState(false);

  const closeNewVoterModal = () => setShowNewVoterModal(false);
  const openNewVoterModal = () => setShowNewVoterModal(true);
  const addVoter = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      const { voterAddress } = Object.fromEntries(formData.entries());

      try {
        await votingContract.methods.addVoter(voterAddress).send({ from: accounts[0] });

        closeNewVoterModal();
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <>
      <Button variant="primary" onClick={openNewVoterModal}>Ajouter un votant</Button>

      <Modal show={showNewVoterModal} onHide={closeNewVoterModal}>
        <Form onSubmit={addVoter}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un votant</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="formVoterAddress">
              <Form.Label>Addresse du votant</Form.Label>
              <Form.Control type="text" name="voterAddress" required/>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeNewVoterModal}>
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

export default VoterFormModal;
