// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;
 
contract Whitelist {
  struct Person { // Structure de données
      string name;
      uint age;  
  }
 
  function createPerson(string memory _name, uint _age) public {
      Person memory person;
      person.name = _name;
      person.age = _age;
  }
}
