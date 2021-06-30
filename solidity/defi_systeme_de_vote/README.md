# ⚡️ Défi - Système de vote

## Instructions

Un smart contract de vote peut être simple ou complexe, selon les exigences des élections que vous souhaitez soutenir. Le vote peut porter sur un petit nombre de propositions (ou de candidats) présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes.

Dans ce cadres, vous allez écrire un smart contract de vote pour une petite organisation. Les électeurs, que l'organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

Le vote n'est pas secret ; chaque électeur peut voir les votes des autres.

Le gagnant est déterminé à la majorité simple ; la proposition qui obtient le plus de voix l'emporte.

Le processus de vote :

Voici le déroulement de l'ensemble du processus de vote :

- L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum
- L'administrateur du vote commence la session d'enregistrement de la proposition
- Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active
- L'administrateur de vote met fin à la session d'enregistrement des propositions
- L'administrateur du vote commence la session de vote
- Les électeurs inscrits votent pour leurs propositions préférées
- L'administrateur du vote met fin à la session de vote
- L'administrateur du vote comptabilise les votes
- Tout le monde peut vérifier les derniers détails de la proposition gagnante

Les recommandations et exigences :

- Votre smart contract doit s’appeler "Voting"
- Votre smart contract doit utiliser la version 0.6.11 du compilateur
- L’administrateur est celui qui va déployer le smart contract
- Votre smart contract doit définir les structures de données suivantes :

  ```sol
  struct Voter {
      bool isRegistered;
      bool hasVoted;
      uint votedProposalId;
  }

  struct Proposal {
      string description;
      uint voteCount;
  }
  ```

- Votre smart contract doit définir une énumération qui gère les différents états d’un vote

  ```sol
  enum WorkflowStatus {
      RegisteringVoters,
      ProposalsRegistrationStarted,
      ProposalsRegistrationEnded,
      VotingSessionStarted,
      VotingSessionEnded,
      VotesTallied
  }
  ```

- Votre smart contract doit définir un uint "winningProposalId" qui représente l’id du gagnant
- Votre smart contract doit importer le smart contract la librairie "Ownable" d’OpenZepplin
- Votre smart contract doit définir les événements suivants :

  ```sol
  event VoterRegistered(address voterAddress);
  event ProposalsRegistrationStarted();
  event ProposalsRegistrationEnded();
  event ProposalRegistered(uint proposalId);
  event VotingSessionStarted();
  event VotingSessionEnded();
  event Voted (address voter, uint proposalId);
  event VotesTallied();
  event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
  ```

Veuillez indiquer le lien de votre répertoire Github correspondant au défi.
