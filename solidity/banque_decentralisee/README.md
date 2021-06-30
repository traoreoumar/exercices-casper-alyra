# ✏️ Exercice - Banque décentralisée

## Instructions

Cet exercice consiste à écrire un smart contract qui permet de simuler le fonctionnement d’une banque.

Les instructions suivantes peuvent vous aider :

- Votre smart contract doit s’appeler "Bank"
- Votre smart contract doit utiliser la version 0.6.11 du compilateur
- Votre smart contract doit définir un mapping "_balances" qui détient le solde détenu par un compte
- Votre smart contract doit définir une fonction "deposit" qui permet à son appelant de déposer de l’argent dans son compte. Elle prend comme paramètre un uint "_amount"
- Votre smart contract doit définir une fonction "transfer" qui permet à son appelant de transférer de l’argent de son propre compte à un autre compte. Elle prend comme paramètre une address "_recipient" et un uint "_amount"
- Votre smart contract doit définir une fonction "balanceOf" qui renvoie le solde détenu par un compte. Elle prend comme paramètre une address "_address"
- Votre smart contract doit importer la librairie SafeMath d’OpenZeppelin et appliquer son utilisation au type uint
