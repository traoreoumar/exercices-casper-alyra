pragma solidity 0.6.11;
 
contract Whitelist {
   mapping(address=> bool) whitelist;
   event Authorized(address _address); // Event
 
   function authorize(address _address) public {
       whitelist[_address] = true;
       emit Authorized(_address); // Triggering event
   }
}
