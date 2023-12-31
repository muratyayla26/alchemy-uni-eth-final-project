// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TimeLockEscrow {
    mapping(address => mapping(address => Deposit)) public deposits;

    struct Deposit {
        address payable sender;
        address payable recipient;
        uint deadline;
        uint amount;
    }

    event DepositCreation(
        address indexed _sender,
        address indexed _recipient,
        uint _amount
    );
    event WithdrawalToSender(address indexed _sender, uint _amount);
    event WithdrawalToRecipient(address indexed _recipient, uint _amount);

    constructor() {}

    function createDeposit(
        address payable _recipient,
        uint _lockTime
    ) public payable {
        require(msg.value > 0, "Amount must be greater than zero.");

        deposits[msg.sender][_recipient] = Deposit({
            sender: payable(msg.sender),
            recipient: _recipient,
            deadline: block.timestamp + _lockTime,
            amount: msg.value
        });

        emit DepositCreation(msg.sender, _recipient, msg.value);
    }

    function withdrawToSender(address _recipient) public {
        Deposit memory deposit = deposits[msg.sender][_recipient];
        require(
            deposit.sender == msg.sender,
            "Only sender can withdraw to sender."
        );
        require(
            deposit.deadline > block.timestamp,
            "Sender only withdraw before deadline."
        );

        (bool success, ) = deposit.sender.call{value: deposit.amount}("");
        require(success, "withdrawToSender failed");

        emit WithdrawalToSender(deposit.sender, deposit.amount);

        delete deposits[msg.sender][_recipient];
    }

    function releaseForRecipient(address _sender) public {
        Deposit memory deposit = deposits[_sender][msg.sender];
        require(
            deposit.recipient == msg.sender,
            "Only recepient can release for recipient."
        );
        require(
            deposit.deadline < block.timestamp,
            "Release can only happen after deadline."
        );

        (bool success, ) = deposit.recipient.call{value: deposit.amount}("");
        require(success, "releaseForRecipient failed");

        emit WithdrawalToRecipient(deposit.recipient, deposit.amount);

        delete deposits[_sender][msg.sender];
    }
}
