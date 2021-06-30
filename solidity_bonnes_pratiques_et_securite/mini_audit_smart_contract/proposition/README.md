# ✏️ Mini Audit - Smart contract

- [Crowdsale 0.8](Crowdsale.sol)
- [Crowdsale 0.5](CrowdsaleV5.sol)

## Failles du contrat Crowdsale

### Fonction withdraw ne fonctionne pas

Ce contrat ne peut pas rembourser le payeur car quand ce contrat reçoit des fonds, ils sont automatiquement envoyer vers **escrow**.

Pour corriger cela, on peut

- désactiver le remboursement (= retirer la fonction withdrawPayments)
- ne pas transférer les fonds vers escrow
  - dans ce cas, escrow n'est plus utile

## Recommandations

- Ajouter la licence
- Utiliser une version précise de solidity
- Utiliser une version plus récente de solidity (0.8.4)
- Remplacer **function Crowdsale** par **constructor** et enlever le mot clé "function"
- Mettre les fonctions en "external" si "public" n'est pas necessaire
- Faire les transferts de fond avec call
  - Il faut aussi faire les mises à jour de l'état avant ces transferts
- Vérifier que les transferts de fond fonctionne
- Commenter le code

### Recommandations pour Solidity 0.8.x

- Retirer SafeMath
- Utiliser **receive** pour recevoir des fonds

### Recommandations pour Solidity 0.5.x

- Importer SafeMath
- Enlever le mot clé "public" du constructeur
- Donner un nom à la fonction qui sert à recevoir des fonds et la mettre en **external** et **payable**

## Autres

- L'utilisation de **tx.origin** est moins flexible (car cela ne peut pas être un contrat). Si on veut que owner puisse être un contrat, il faut le remplacer par **msg.sender**
- **owner** n'est pas utilisé
