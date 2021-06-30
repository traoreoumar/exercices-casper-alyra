// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

/**
 * @title Crowdsale
 * @author ???
 */
contract Crowdsale {

    /**
     * @notice the owner of the contract
     */
    address public owner;

    /**
     * @notice wallet to collect raised ETH
     */
    address public escrow;

    /**
     * @notice Total amount raised in ETH
     */
    uint256 public savedBalance = 0;

    /**
     * @notice Balances in incoming Ether
     */
    mapping (address => uint256) public balances;

    constructor(address _escrow) {
        owner = tx.origin;

        // add address of the specific contract
        escrow = _escrow;
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        balances[msg.sender] = balances[msg.sender] + msg.value;
        savedBalance = savedBalance + msg.value;

        (bool success, ) = escrow.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    // /**
    //  * @notice Refund investisor
    //  */
    // function withdrawPayments() external {
    //     address payee = msg.sender;
    //     uint256 payment = balances[payee];

    //     savedBalance = savedBalance - payment;
    //     balances[payee] = 0;

    //     (bool success, ) = payee.call{value: payment}("");
    //     require(success, "Transfer failed");
    // }
}
