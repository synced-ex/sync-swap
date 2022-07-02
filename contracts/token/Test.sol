// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Test liquidity token
 * @author https://github.com/neily0x
 * @notice Sync finance test token
 */
contract TestToken is ERC20, ERC20Burnable, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1e30);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
