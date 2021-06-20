import React from "react";

export const VotingContractContext = React.createContext({
  votingContract: null,
  owner: null,
  votersAddresses: [],
  setVotersAddresses: null,
  proposals: [],
  setProposals: null,
  status: null,
  setStatus: null,
});
