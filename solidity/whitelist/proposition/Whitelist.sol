// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

/**
 * @title Whitelist
 */
contract Whitelist {
    mapping(address => bool) public whitelist;
    event Authorized(address _address);

    function authorize(address _address) public {
        whitelist[_address] = true;
        emit Authorized(_address);
    }
}
