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
  const [owner, setOwner] = useState(votingInitialData.owner);
  useEffect(() => {
  }, [setOwner]);

  const [votersAddresses, setVotersAddresses] = useState(votingInitialData.votersAddresses);
  useEffect(() => {
  }, [votersAddresses]);

  const [proposals, setProposals] = useState(votingInitialData.proposals);
  useEffect(() => {
  }, [proposals]);

  const [status, setStatus] = useState(votingInitialData.status);
  useEffect(() => {
  }, [status]);

  const [winningProposalId, setWinningProposalId] = useState(votingInitialData.winningProposalId);
  useEffect(() => {
  }, [winningProposalId]);

  const [votingContract, setVotingContract] = useState(null);
  useEffect(() => {
    if (votingContract) {
      manageVotingContractEvents(
        votingContract,
        setOwner,
        setVotersAddresses,
        setProposals,
        setStatus,
        setWinningProposalId
      );

      getVotingContractOwner(votingContract).then((owner) => {
        setOwner(owner);
      });

      getVotingContractVotersAddresses(votingContract).then((votersAddresses) => {
        setVotersAddresses(votersAddresses);
      });

      getVotingContractProposals(votingContract).then((proposals) => {
        setProposals(proposals);
      });

      getVotingContractStatus(votingContract).then((status) => {
        setStatus(status);
      });

      getVotingContractWinningProposalId(votingContract)
        .then((winningProposalId) => {
          setWinningProposalId(winningProposalId);
        })
        .catch((error) => {})
      ;
    }
  }, [votingContract]);

  if (!votingContract) {
    getVotingContract(web3, setVotingContract).then((instance) => {
      setVotingContract(instance);
    })
  }

  const votingContractContext = {
    votingContract,
    owner,
    votersAddresses,
    setVotersAddresses,
    proposals,
    setProposals,
    status,
    setStatus,
    winningProposalId,
    setWinningProposalId,
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

  return votingContract;
}

function getVotingContractOwner(votingContract) {
  return votingContract.methods.owner().call();
}

function getVotingContractVotersAddresses(votingContract) {
  return votingContract.methods.getVotersAddresses().call();
}

function getVotingContractProposals(votingContract) {
  return votingContract.methods.getProposals().call();
}

function getVotingContractStatus(votingContract) {
  return votingContract.methods.status().call().then(parseInt);
}

function getVotingContractWinningProposalId(votingContract) {
  return votingContract.methods.getWinningProposalId().call().then(parseInt);
}

function manageVotingContractEvents(votingContract, setOwner, setVotersAddresses, setProposals, setStatus, setWinningProposalId) {
  votingContract.events.VoterRegistered()
    .on('data', (event) => {
      setVotersAddresses((votersAddresses) => {
        const voterAddress = event.returnValues.voterAddress;
        const index = votersAddresses.findIndex((voterAddressItem) => {
          return voterAddress.toUpperCase() === voterAddressItem.toUpperCase();
        });

        if (-1 === index) {
          votersAddresses = [...votersAddresses, voterAddress];
        }

        return votersAddresses;
      });
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.VoterUnregistered()
    .on('data', (event) => {
      setVotersAddresses((votersAddresses) => {
        const voterAddress = event.returnValues.voterAddress;
        const index = votersAddresses.findIndex((voterAddressItem) => {
          return voterAddress.toUpperCase() === voterAddressItem.toUpperCase();
        });

        if (-1 !== index) {
          votersAddresses.splice(index)
          votersAddresses = [...votersAddresses];
        }

        return votersAddresses;
      });
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

      setProposals((proposals) => {
        const index = proposals.findIndex((item) => {
          return proposalId === item.proposalId;
        });

        if (-1 === index) {
          votingContract.methods.proposals(proposalId).call()
            .then((proposal) => {
              setProposals([...proposals, proposal]);
            })
            .catch((error) => {
              console.error(error);
            })
          ;
        }

        return proposals;
      });
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.Voted()
    .on('data', async (event) => {
      getVotingContractProposals(votingContract).then((proposals) => {
        setProposals(proposals);
      });
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;

  votingContract.events.VotesTallied()
    .on('data', async (event) => {
      getVotingContractWinningProposalId(votingContract)
        .then((winningProposalId) => {
          setWinningProposalId(winningProposalId);
        })
        .catch((error) => {})
      ;
    })
    .on('error', (event) => {
      console.error(event);
    })
  ;
}

export default Voting;
