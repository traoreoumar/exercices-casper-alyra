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

    Person[] public persons;

    function add(string _name, uint _age) public {
        persons.push(Person(_name, _age));
    }

    function remove(string _name, uint _age) public {
        persons.pop();
    }
}
