// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableERC20 is ERC20, Ownable {
     constructor (
        string memory name,
        string memory symbol,
        uint256 initialBalance
    )
        ERC20(name, symbol)
    {
        require(initialBalance > 0, "MintableERC20: supply cannot be zero");
        _mint(msg.sender, initialBalance);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}