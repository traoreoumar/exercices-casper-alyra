# ✏️ Interaction avec un smart contract sur le réseau testnet ropsten

## Instructions

Veuillez interagir avec le smart contract déployé sous l’adresse 0x8cD906ff391b25304E0572b92028bE24eC1eABFb et récupérer la valeur de la variable nommée "data".

Le smart contract déployé est le suivant :

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

Veuillez indiquez ci-dessous la valeur de la variable nommée data
