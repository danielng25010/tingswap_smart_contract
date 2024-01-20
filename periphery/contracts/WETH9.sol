pragma solidity =0.7.6;

import './interfaces/external/IWETH9.sol';

contract WETH9 is IWETH9 {
    string public constant name = 'Wrapped Ether';
    string public constant symbol = 'WETH';
    uint8 public decimals = 18;

    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;

    event Deposit(address indexed dst, uint wad);
    event Withdrawal(address indexed src, uint wad);

    constructor() {
    }

    receive() external payable {
        deposit();
    }

    function deposit() public override payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint value) external override {
        balanceOf[msg.sender] -= value;
        (bool success, ) = msg.sender.call{value: value}('');
        require(success, 'ETH transfered failed');
        emit Withdrawal(msg.sender, value);
    }

    function totalSupply() external view override returns (uint) {
        return address(this).balance;
    }

    function approve(address spender, uint value) external override returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    modifier ensuresRecipient(address to) {
        // Prevents from burning or sending WETH tokens to the contract.
        require(to != address(0), 'WETH_InvalidTransferRecipient: Cannot send tokens to address(0)');
        require(to != address(this), 'WETH_InvalidTransferRecipient: Cannot send tokens to the contract itself');
        _;
    }

    function transfer(address to, uint value) external override ensuresRecipient(to) returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) external override ensuresRecipient(to) returns (bool) {
        if (from != msg.sender) {
            uint _allowance = allowance[from][msg.sender];
            if (_allowance != type(uint).max) {
                allowance[from][msg.sender] -= value;
            }
        }

        balanceOf[from] -= value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);
        return true;
    }

}
