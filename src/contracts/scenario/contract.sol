pragma solidity ^0.4.14;
//
// Contract for storing legal Scenario's on the blockchain
// Ben Rogmans - 2017-09-22.1
//
contract Scenario {

    bytes32 public name;
    uint    public lastVersion;
    address public creator;
    
    mapping(uint => Version) public versions;

    struct Version
    {
        uint effectiveDate;
        string content;
    }

    // require msg.sender == publisher
    modifier creatorOnly {
        if(msg.sender != creator) {
            revert();
        } else {
            _;
        }
    }
    
    // Create the contract
    function Scenario(bytes32 _name) public {
        name        = _name;
        creator     = msg.sender;
    }
    
    // Publish a new Scenario
    function publishScenarioVersion(uint _effectiveDate, string _content, bytes32 _checksum) creatorOnly public {
        
        // Only newer versions can be published
        if(_effectiveDate <= lastVersion) revert();
        if(sha256(_content) != _checksum) revert();
        
        versions[_effectiveDate] = Version({
            effectiveDate:  _effectiveDate,
            content:        _content
        });
        
        lastVersion = _effectiveDate;
    }
}