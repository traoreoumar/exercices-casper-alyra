pragma solidity 0.6.11;
 
contract Whitelist {
   mapping(address=> bool) whitelist;
   event Authorized(address _address); // Event
}
