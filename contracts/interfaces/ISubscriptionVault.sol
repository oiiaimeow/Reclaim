// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title ISubscriptionVault
 * @notice Interface for SubscriptionVault contract
 * @dev Defines vault interaction methods for subscription payments
 */
interface ISubscriptionVault {
    /**
     * @notice Deposits tokens into the vault
     * @param token The ERC20 token address
     * @param amount The amount to deposit
     */
    function deposit(address token, uint256 amount) external;

    /**
     * @notice Withdraws available tokens from the vault
     * @param token The ERC20 token address
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) external;

    /**
     * @notice Locks funds for a subscription
     * @param user The user's address
     * @param token The token address
     * @param amount The amount to lock
     */
    function lockFunds(
        address user,
        address token,
        uint256 amount
    ) external;

    /**
     * @notice Unlocks funds after subscription cancellation
     * @param user The user's address
     * @param token The token address
     * @param amount The amount to unlock
     */
    function unlockFunds(
        address user,
        address token,
        uint256 amount
    ) external;

    /**
     * @notice Transfers locked funds for subscription payment
     * @param from The subscriber's address
     * @param to The creator's address
     * @param token The token address
     * @param amount The payment amount
     */
    function transferLockedFunds(
        address from,
        address to,
        address token,
        uint256 amount
    ) external;

    /**
     * @notice Gets the available balance for a user
     * @param user The user's address
     * @param token The token address
     * @return The available balance
     */
    function getAvailableBalance(address user, address token)
        external
        view
        returns (uint256);

    /**
     * @notice Gets the total balance for a user
     * @param user The user's address
     * @param token The token address
     * @return The total balance
     */
    function getTotalBalance(address user, address token)
        external
        view
        returns (uint256);

    /**
     * @notice Gets the locked balance for a user
     * @param user The user's address
     * @param token The token address
     * @return The locked balance
     */
    function getLockedBalance(address user, address token)
        external
        view
        returns (uint256);
}

