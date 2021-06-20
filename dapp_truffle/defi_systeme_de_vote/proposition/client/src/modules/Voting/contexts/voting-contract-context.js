import React from "react";

export const VotingContractContext = React.createContext({
  votingContract: null,
  votersAddresses: [],
  setVoters: null,
  proposals: [],
  setProposals: null,
  status: null,
  setStatus: null,
});
