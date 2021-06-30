// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.5.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/contracts/math/SafeMath.sol";

/**
 * @title Crowdsale
 * @author ???
 */
contract Crowdsale {
    using SafeMath for uint256;

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

    constructor(address _escrow) public {
        owner = tx.origin;

        // add address of the specific contract
        escrow = _escrow;
    }

    /**
     * @notice Receive ETH
     */
    function() external payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        savedBalance = savedBalance.add(msg.value);

        (bool success, ) = escrow.call.value(msg.value)("");
        require(success, "Transfer failed");
    }

    // /**
    //  * @notice Refund investisor
    //  */
    // function withdrawPayments() external {
    //     address payee = msg.sender;
    //     uint256 payment = balances[payee];

    //     savedBalance = savedBalance.sub(payment);
    //     balances[payee] = 0;

    //     (bool success, ) = payee.call.value(payment)("");
    //     require(success, "Transfer failed");
    // }
}
