// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

contract SimpleStorage {
   uint data;

   function set(uint x) public {
       data = x;
   }

   function get() public view returns (uint) {
       return data;
   }
}
