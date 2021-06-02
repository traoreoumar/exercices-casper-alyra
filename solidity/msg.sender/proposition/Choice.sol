// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

/**
 * @title Choice
 */
contract Choice {
    mapping(address => uint) public choices;

    function add(uint _choice) public {
        choices[msg.sender] = _choice;
    }
}
