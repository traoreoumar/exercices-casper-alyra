# ✏️ Exercice - Whitelist

## Instructions

Écrivez un smart contract qui permet de gérer une liste blanche (en anglais whitelist). Une whitelist définit un ensemble d’entités (personnes, comptes, machines…) auxquels on attribue un niveau de liberté ou de confiance maximum dans un système particulier ; en opposition à une liste noire (en anglais blacklist) qui définit un état de bannissement, d‘interdiction pour ses membres.

Votre smart contract va reproduire ce concept en autorisant un ensemble de compte Ethereum et en les stockant dans une whitelist.

Pour plus de détails, suivez les instructions suivantes :

- Vous pouvez repartir du smart contract de l’exercice "Exercice - events"
- Votre smart contract doit définir une fonction nommée "authorize" accessible par tout le monde et qui permet d’autoriser un compte Ethereum en l’ajoutant sur le mapping.
- La fonction “authorize” prend un paramètre nommé “_address” le compte Ethereum à autoriser.
- L'événement “Authorized” est déclenché dès qu’un compte Ethereum est autorisé.
