import React, { useContext, useEffect, useState } from "react";
import VotingContract from "../../contracts/Voting.json";

import "./Voting.scss";

import VotingContent from "../VotingContent/VotingContent";
import { VotingContractContext } from "../../contexts/voting-contract-context";
import { Web3Context } from "../../contexts/web3-context";

function Voting(props) {
  // Contexts
  const { web3 } = useContext(Web3Context);
  const votingInitialData = useContext(VotingContractContext);

  // State & Effect
  const [voters, setVoters] = useState(votingInitialData.voters);
  useEffect(() => {
  }, [voters]);

  const [proposals, setProposals] = useState(votingInitialData.proposals);
  useEffect(() => {
  }, [proposals]);

  const [status, setStatus] = useState(votingInitialData.status);
  useEffect(() => {
  }, [status]);

  const [votingContract, setVotingContract] = useState(null);
  useEffect(() => {
    if (votingContract) {
      getVotingContractVoters(votingContract, setVoters);
      getVotingContractProposals(votingContract, setProposals);
      getVotingContractStatus(votingContract, setStatus);
    }
  }, [votingContract, status]);

  if (!votingContract) {
    getVotingContract(web3, setVotingContract);
  }

  const votingContractContext = {
    voters,
    setVoters,
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

async function getVotingContractVoters(votingContract, setVoters) {
  const voters = await votingContract.methods.status().call();
  setVoters(voters);
}

async function getVotingContractProposals(votingContract, setProposals) {
  const proposals = await votingContract.methods.status().call();
  setProposals(proposals);
}

async function getVotingContractStatus(votingContract, setStatus) {
  const status = parseInt(await votingContract.methods.status().call());
  setStatus(status);
}

export default Voting;
