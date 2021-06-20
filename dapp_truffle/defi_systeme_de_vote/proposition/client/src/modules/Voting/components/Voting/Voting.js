import React, { useContext, useEffect, useState } from "react";
import VotingContract from "../../../../contracts/Voting.json";

import "./Voting.scss";

import VotingContent from "../VotingContent/VotingContent";
import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../../../contexts/web3-context";

function Voting(props) {
  // Contexts
  const { web3 } = useContext(Web3Context);
  const votingInitialData = useContext(VotingContractContext);

  // State & Effect
  const [votersAddresses, setVotersAddresses] = useState(votingInitialData.votersAddresses);
  useEffect(() => {
  }, [votersAddresses]);

  const [proposals, setProposals] = useState(votingInitialData.proposals);
  useEffect(() => {
  }, [proposals]);

  const [status, setStatus] = useState(votingInitialData.status);
  useEffect(() => {
  }, [status]);

  const [votingContract, setVotingContract] = useState(null);
  useEffect(() => {
    if (votingContract) {
      manageVotingContractEvents(
        votingContract,
        votersAddresses,
        setVotersAddresses,
        proposals,
        setProposals,
        status,
        setStatus
      );
      getVotingContractVotersAddresses(votingContract, setVotersAddresses);
      getVotingContractProposals(votingContract, setProposals);
      getVotingContractStatus(votingContract, setStatus);
    }
  }, [votingContract]);

  if (!votingContract) {
    getVotingContract(web3, setVotingContract);
  }

  const votingContractContext = {
    votingContract,
    votersAddresses,
    setVotersAddresses,
    proposals,
    setProposals,
    status,
    setStatus,
  }

  return (
    <VotingContractContext.Provider value={votingContractContext}>
      <div className="voting-container">
        <VotingContent></VotingContent>
      </div>
    </VotingContractContext.Provider>
  );
}

async function getVotingContract(web3, setVotingContract) {
  // Get the contract instance.
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = VotingContract.networks[networkId];
  const votingContract = new web3.eth.Contract(
    VotingContract.abi,
    deployedNetwork && deployedNetwork.address,
  );

  // Set votingContract state
  setVotingContract(votingContract);
}

async function getVotingContractVotersAddresses(votingContract, setVotersAddresses) {
  const votersAddresses = await votingContract.methods.getVotersAddresses().call();
  setVotersAddresses(votersAddresses);
}

async function getVotingContractProposals(votingContract, setProposals) {
  const proposals = await votingContract.methods.getProposals().call();
  setProposals(proposals);
}

async function getVotingContractStatus(votingContract, setStatus) {
  const status = parseInt(await votingContract.methods.status().call());
  setStatus(status);
}

function manageVotingContractEvents(votingContract, votersAddresses, setVotersAddresses, proposals, setProposals, status, setStatus) {
  votingContract.events.VoterRegistered()
    .on('data', (event) => {
      const index = votersAddresses.indexOf(event.returnValues.voterAddress);
      if (-1 === index) {
        votersAddresses.push(event.returnValues[0]);
        setVotersAddresses(votersAddresses);
      } else {
        getVotingContractVotersAddresses(votingContract, setVotersAddresses);
      }
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.VoterUnregistered()
    .on('data', (event) => {
      const index = votersAddresses.indexOf(event.returnValues.voterAddress);
      if (-1 !== index) {
        votersAddresses.splice(index);
        setVotersAddresses(votersAddresses);
      } else {
        getVotingContractVotersAddresses(votingContract, setVotersAddresses);
      }
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.WorkflowStatusChange()
    .on('data', (event) => {
      const newStatus = parseInt(event.returnValues.newStatus);
      setStatus(newStatus);
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.ProposalRegistered()
    .on('data', async (event) => {
      const proposalId = parseInt(event.returnValues.proposalId);

      const index = proposals.find((item) => {
        return proposalId === item.proposalId;
      });

      if (-1 === index) {
        try {
          const proposal = await votingContract.methods.proposals(proposalId).call();
          proposals.push(proposal);
          setProposals(proposals);
        } catch (error) {
          console.error(error);
          getVotingContractProposals(votingContract, setProposals);
        }
      } else {
        getVotingContractProposals(votingContract, setProposals);
      }
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;
}

export default Voting;
