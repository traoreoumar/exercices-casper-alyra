# ✏️ Exercice - keccak256

## Instructions

**Comment générer des nombres aléatoires dans Solidity ?**

La vraie réponse est, vous ne pouvez pas. Du moins, vous ne pouvez pas le faire en toute sécurité.

**Pourquoi ?**

Pour générer des nombres aléatoires, il faut passer par un hash généré aléatoirement ! Sauf que généralement, on utilise la variable spéciale "now" qui est un paramètre qui peut être manipulé par les mineurs. 

Comme le contenu entier de la Blockchain est visible par tous les participants, c'est un problème difficile à gérer, et sa solution dépasse le cadre de ce cours. Vous pouvez lire cette discussion StackOverflow pour avoir quelques idées. Une idée serait d'utiliser un oracle pour accéder à une fonction de nombre aléatoire en dehors de la chaîne de blocs Ethereum.

Dans le cadre de cet exercice, ne vous souciez pas de la sécurité de votre solution. Vous allez alors utiliser la fonction de hachage de Solidity keccak256 qui est la meilleure source de hasard dans Solidity.

Les instructions suivantes peuvent vous aider :

- Votre smart contract doit s'appeler "Random".
- Votre smart contract doit utiliser la version 0.6.11 du compilateur.
- Votre smart contract doit définir uint appelé "nonce" de visibilité private, et fixez-le à 0.
- Votre smart contract doit définir une fonction "random" qui retourne un nombre aléatoire entre 0 et 100. "random" doit utiliser la fonction de hachage keccak256
- Enfin, elle doit (en une ligne de code) calculer le typecast uint du hash keccak256 des paramètres suivants : block.timestamp, msg.sender, nonce

**La variable nonce est un numéro qui n'est utilisé qu'une seule fois, de sorte que nous ne lançons pas deux fois la même fonction de hachage avec les mêmes paramètres d'entrée.**

[Indice] Vous trouverez de l'aide sur [eatherblocks.com](https://eattheblocks.com/) si vous cherchez bien.

Pour aller plus loin et générer un nombre aléatoire en toute sécurité, vous pouvez suivre [ce tutoriel](https://medium.com/coinmonks/how-to-generate-random-numbers-on-ethereum-using-vrf-8250839dd9e2).
