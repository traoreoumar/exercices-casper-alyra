// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.6/contracts/math/SafeMath.sol";

/**
 * @title Bank
 */
contract Bank {
    mapping(address => uint) _balances;

    function deposit(uint _amount) public {
        (bool success, uint updatedBalance) = SafeMath.tryAdd(balanceOf(msg.sender), _amount);

        require(success, "Can't deposit");
        _balances[msg.sender] = updatedBalance;
    }

    function transfer(address _recipient, uint _amount) public {
        (bool successSenderBalance, uint senderUpdatedBalance) = SafeMath.trySub(balanceOf(msg.sender), _amount);
        require(successSenderBalance, "amount > balance");

        (bool successRecipientBalance, uint recipientUpdatedBalance) = SafeMath.tryAdd(balanceOf(_recipient), _amount);
        require(successRecipientBalance, "recipent can't receive");

        _balances[msg.sender] = senderUpdatedBalance;
        _balances[_recipient] = recipientUpdatedBalance;
    }

    function balanceOf(address _address) public view returns(uint) {
        return _balances[_address];
    }
}

// 50000000000000000000000000000000000000000000000000000000000000000000000000000
