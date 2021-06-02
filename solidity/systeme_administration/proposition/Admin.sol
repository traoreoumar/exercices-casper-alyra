// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.6/contracts/access/Ownable.sol";

/**
 * @title Admin
 */
contract Admin is Ownable {
    mapping(address => addressStatus) private mappingAdressStatus;
    event Authorized(address _address);
    event Blacklisted(address _address);
    enum addressStatus {
        Default,
        Blacklist,
        Whitelist
    }

    function whitelist(address _address) public onlyOwner {
        mappingAdressStatus[_address] = addressStatus.Whitelist;
        emit Authorized(_address);
    }

    function blacklist(address _address) public onlyOwner {
        mappingAdressStatus[_address] = addressStatus.Blacklist;
        emit Blacklisted(_address);
    }
    
    function isWhitelisted(address _address) public view returns(bool) {
        return addressStatus.Whitelist == mappingAdressStatus[_address];
    }
    
    function isBlacklisted(address _address) public view returns(bool) {
        return addressStatus.Blacklist == mappingAdressStatus[_address];
    }
}
