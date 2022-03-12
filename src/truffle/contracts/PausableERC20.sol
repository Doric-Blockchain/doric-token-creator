// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PausableERC20 is ERC20, Pausable, Ownable {
     constructor (
        string memory name,
        string memory symbol,
        uint256 initialBalance
    )
        ERC20(name, symbol)
    {
        require(initialBalance > 0, "PausableERC20: supply cannot be zero");
        _mint(msg.sender, initialBalance);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}