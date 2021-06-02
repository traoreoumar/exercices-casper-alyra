// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

/**
 * @title Time
 */
contract Time {
    function getTime() public view returns(uint) {
        return block.timestamp;
    }
}
