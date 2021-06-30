# TP Truffle SimpleStorage - Déployer sur le testnet avec Truffle

## Instructions

Veuillez déployer le smart contract SimpleStorage sur le réseau Ropsten et Rinkeby via truffle.

```sol
// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;
contract SimpleStorage {
  uint data;
  function set(uint x) public {
      data = x;
  }
  function get() public view returns (uint) {
      return data;
  }
}
```

Pour valider l’exercice vous devez rendre :

- L’address du smart contract (ropsten et rinkeby)
- Le fichier truffle-config.js

💡 Les instructions suivantes peuvent vous aider :

- Le package npm  @truffle/hdwallet-provider doit être utilisé
- Le package npm dotenv doit être utilisé, pour paramétrer les variables d’environnement.

## Adresses

- Ropsten
  - Migration : 0xc2D4DfA36A291f890AFf9075936d14e0637AD2D9
  - SimpleStorage : 0x60d451352f6CA0E7d9Cc6F221688cD496c506dBb
- Rinkeby
  - Migration : 0x0F5E0E9C65F58633c08C24b4E1Dc87317c120C3c
  - SimpleStorage : 0x48C4721A2342AEfACd7d09C93F40359BEC33C29a
