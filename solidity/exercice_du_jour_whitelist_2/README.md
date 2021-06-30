# ✏️ Exercice du jour - Whitelist 2

## Instructions

En partant de l’exercice Whitelist :

- Ajouter un admin. L’enregistrement dans la whitelist ne peut passer que par lui.
- Utiliser l’enum suivant et adapter la gestion de la whitelist :

  ```sol
  enum addressStatus{
      Default,
      Blacklist,
      Whitelist
  }
  ```

- Ajouter un event “Blacklisted” dès qu’un compte Ethereum est mis dans la blacklist
