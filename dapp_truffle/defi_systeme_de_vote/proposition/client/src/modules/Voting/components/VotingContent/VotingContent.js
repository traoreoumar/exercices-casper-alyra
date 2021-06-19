import React, { useContext } from "react";

import "./VotingContent.scss";

import { VotingContractContext } from "../../contexts/voting-contract-context";
import { VotingWorkflowStatusEnum } from "../../interfaces/VotingWorkflowStatusEnum";

function VotingContent(props) {
  // Contexts
  const { status } = useContext(VotingContractContext);

  let content = (<></>);
  switch (status) {
    case VotingWorkflowStatusEnum.RegisteringVoters:
      content = (
        <p>RegisteringVoters</p>
      );
      break;

    case VotingWorkflowStatusEnum.ProposalsRegistrationStarted:
      content = (
        <p>ProposalsRegistrationStarted</p>
      );
      break;

    case VotingWorkflowStatusEnum.ProposalsRegistrationEnded:
      content = (
        <p>ProposalsRegistrationEnded</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotingSessionStarted:
      content = (
        <p>VotingSessionStarted</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotingSessionEnded:
      content = (
        <p>VotingSessionEnded</p>
      );
      break;

    case VotingWorkflowStatusEnum.VotesTallied:
      content = (
        <p>VotesTallied</p>
      );
      break;
  
    default:
      break;
  }

  return (
    content
  );
}

export default VotingContent;
