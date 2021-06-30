// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title Auction
 */
contract Auction {
    mapping(address => uint) internal addressesToRefund;
    address payable public currentLeader;
    uint public highestBid;

    function bid() public payable {
        require(msg.value > highestBid);

        addressesToRefund[currentLeader] += highestBid;

        currentLeader = payable(msg.sender);
        highestBid = msg.value;
    }

    function refund() public {
        uint amount = addressesToRefund[msg.sender];
        addressesToRefund[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
