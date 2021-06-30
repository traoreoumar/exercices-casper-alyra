// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

/**
 * @title Random
 */
contract Random {
    uint private nonce = 0;
    
    function random() internal returns(uint) {
        nonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 101;
    }
}
