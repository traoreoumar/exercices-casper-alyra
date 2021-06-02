# ✏️ Exercice - Système d'administration

## Instructions

Ecrire un smart contract qui permet de simuler un système d’administration.

Les instructions suivantes peuvent vous aider :

- Votre smart contract doit s'appeler "Admin"
- Votre smart contract doit utiliser la version 0.6.11 du compilateur
- L’administrateur est celui qui va déployer le smart contract
- L’administrateur est le seul qui a le droit d’autoriser un compte Ethereum à l’aide de la fonction "whitelist"
- L’administrateur est le seul qui a le droit de bloquer un compte Ethereum à l’aide de la fonction "blacklist"
- Votre smart contract doit définir une fonction "isWhitelisted" qui précise si un compte est whitelisté
- Votre smart contract doit définir une fonction "isBlacklisted" qui précise si un compte est blacklisté
- Votre smart contract doit définir deux événements "Whitelisted" et "Blacklisted"
- L’utilisation du type mapping est exigée
- L’utilisation d’un modifier est exigée
- L’import de la librairie "Ownable" d’OpenZepplin est obligatoire
- Vous pouvez vous inspirer de l’exercice whitelis
