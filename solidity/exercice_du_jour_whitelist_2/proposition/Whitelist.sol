// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

/**
 * @title Whitelist
 */
contract Whitelist {
    address private admin;
    mapping(address => addressStatus) public whitelist;
    event Authorized(address _address);
    event Blacklisted(address _address);
    enum addressStatus {
        Default,
        Blacklist,
        Whitelist
    }

    constructor(address _admin) public {
        admin = _admin;
    }

    function authorize(address _address) public {
        require(admin == msg.sender, 'only admin');

        whitelist[_address] = addressStatus.Whitelist;
        emit Authorized(_address);
    }

    function unauthorize(address _address) public {
        require(admin == msg.sender, 'only admin');

        whitelist[_address] = addressStatus.Blacklist;
        emit Blacklisted(_address);
    }
    
    function setAdmin(address _admin) public {
        require(admin == msg.sender, 'only admin');
        admin = _admin;
    }
}
