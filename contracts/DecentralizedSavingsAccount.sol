// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedSavingsAccount {
    address public owner;
    uint public interestRate; // Annual interest rate in percentage
    mapping(address => uint) public balances;
    mapping(address => uint) public depositTimestamps;

    constructor(uint _interestRate) {
        owner = msg.sender;
        interestRate = _interestRate; // Set the interest rate (e.g., 5 means 5%)
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        if (balances[msg.sender] > 0) {
            uint interest = calculateInterest(msg.sender);
            balances[msg.sender] += interest;
        }

        balances[msg.sender] += msg.value;
        depositTimestamps[msg.sender] = block.timestamp;
    }

    function withdraw(uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance");
        
        uint interest = calculateInterest(msg.sender);
        balances[msg.sender] += interest;

        balances[msg.sender] -= amount;
        depositTimestamps[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(amount);
    }

    function calculateInterest(address user) internal view returns (uint) {
        uint timeElapsed = block.timestamp - depositTimestamps[user]; 
        uint interest = balances[user] * interestRate * timeElapsed / (100 * 365 * 24 * 60 * 60);
        return interest;
    }

    function checkBalance() public view returns (uint) {
        uint interest = calculateInterest(msg.sender);
        return balances[msg.sender] + interest;
    }

    function updateInterestRate(uint newRate) public {
        require(msg.sender == owner, "Only the owner can update the interest rate");
        interestRate = newRate;
    }
}
