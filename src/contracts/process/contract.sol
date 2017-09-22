pragma solidity ^0.4.14;
//
// Contract facilitating a legal process on the blockchain
// Ben Rogmans - 2017-09-22.1
//
contract Process {
    
    Scenario private scenario;
    string[] private keys;
    string[] private events;
    
    function Process(Scenario _scenario) public {
        scenario = _scenario;
    }
    
    function addKey(string _key) public {
        keys.push(_key);
    }
    
    function addEvent(string _event) public {
        events.push(_event);
    }
}