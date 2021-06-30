pragma solidity 0.6.11;
contract Whitelist {
  struct Person { // Structure de données
      string name;
      uint age;  
  }
  Person[] public persons;
}
