// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract SimpleStorage {
  uint storedData;
  event StoredDataUpdated(uint storedData);

  function set(uint x) public {
    storedData = x;

    emit StoredDataUpdated(storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
