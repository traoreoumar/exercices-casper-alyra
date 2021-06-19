import React from "react";

export const VotingContractContext = React.createContext({
  voters: {},
  setVoters: null,
  proposals: {},
  setProposals: null,
  status: null,
  setStatus: null,
});
