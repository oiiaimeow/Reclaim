// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC token for testing purposes
 * @dev ERC20 token with minting capabilities for testing
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals;

    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        _decimals = 6; // USDC has 6 decimals
        _mint(msg.sender, 1000000 * 10**_decimals); // Mint 1M USDC to deployer
    }

    /**
     * @notice Mints tokens to a specified address
     * @param to The recipient address
     * @param amount The amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Allows anyone to mint tokens for testing
     * @param amount The amount to mint
     */
    function faucet(uint256 amount) external {
        require(amount <= 10000 * 10**_decimals, "Faucet limit exceeded");
        _mint(msg.sender, amount);
    }

    /**
     * @notice Returns the number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}

