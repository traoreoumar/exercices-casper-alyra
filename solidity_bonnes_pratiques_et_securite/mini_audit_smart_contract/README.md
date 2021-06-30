# ✏️ Mini Audit - Smart contract

## Instructions

- Auditer le code suivant, en commentant les différentes failles et en faisant des recommandations pour améliorer le code et la sécurité du smart contract.
- Corriger le code en se basant sur vos recommandations

```sol
pragma solidity ^0.5.12;
 
contract Crowdsale {
   using SafeMath for uint256;
 
   address public owner; // the owner of the contract
   address public escrow; // wallet to collect raised ETH
   uint256 public savedBalance = 0; // Total amount raised in ETH
   mapping (address => uint256) public balances; // Balances in incoming Ether
 
   // Initialization
   function Crowdsale(address _escrow) public{
       owner = tx.origin;
       // add address of the specific contract
       escrow = _escrow;
   }
  
   // function to receive ETH
   function() public {
       balances[msg.sender] = balances[msg.sender].add(msg.value);
       savedBalance = savedBalance.add(msg.value);
       escrow.send(msg.value);
   }
  
   // refund investisor
   function withdrawPayments() public{
       address payee = msg.sender;
       uint256 payment = balances[payee];
 
       payee.send(payment);
 
       savedBalance = savedBalance.sub(payment);
       balances[payee] = 0;
   }
}
```
