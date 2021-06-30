//Admin.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Admin is Ownable{
  mapping(address=> bool) private _whitelist;
  mapping(address=> bool) private _blacklist;
  event Whitelisted(address _address);
  event Blacklisted(address _address);
 
  function whitelist(address _address) public onlyOwner {
      require(!_blacklist[_address], "This address is already blacklisted !");
      require(!_whitelist[_address], "This address is already whitelisted !");
      _whitelist[_address] = true;
      emit Whitelisted(_address);
  }
 
  function isWhitelisted(address _address) public view onlyOwner returns(bool) {
      return _whitelist[_address];
  }
  
  function blacklist(address _address) public onlyOwner {
      require(!_blacklist[_address], "This address is already blacklisted !");
      require(msg.sender != _address, "Owner cannot be blacklisted !");
      _blacklist[_address] = true;
      _whitelist[_address] = false;
      emit Blacklisted(_address);
  }
 
  function isBlacklisted(address _address) public view onlyOwner returns(bool){
      return _blacklist[_address];
  }
}