// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

/**
 * @title Whitelist
 */
contract Whitelist {
    struct Person {
        string name;
        uint age;
    }

    function addPerson(string memory _name, uint _age) public pure {
        Person memory person = Person(_name, _age);
    }
}
