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
}
