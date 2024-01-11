// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SubscriptionVault
 * @notice Secure vault for storing subscription funds
 * @dev Provides deposit, withdrawal, and balance tracking functionality
 */
contract SubscriptionVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Mapping: user => token => balance
    mapping(address => mapping(address => uint256)) public balances;

    // Mapping: user => token => locked amount (for active subscriptions)
    mapping(address => mapping(address => uint256)) public lockedBalances;

    // Authorized payment managers that can lock/unlock funds
    mapping(address => bool) public authorizedManagers;

    // Events
    event Deposited(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event Withdrawn(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event FundsLocked(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event FundsUnlocked(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event ManagerAuthorized(address indexed manager, bool authorized);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Authorizes or revokes a payment manager
     * @param manager The address of the payment manager
     * @param authorized True to authorize, false to revoke
     */
    function setAuthorizedManager(address manager, bool authorized)
        external
        onlyOwner
    {
        authorizedManagers[manager] = authorized;
        emit ManagerAuthorized(manager, authorized);
    }

    /**
     * @notice Deposits tokens into the vault
     * @param token The ERC20 token address
     * @param amount The amount to deposit
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender][token] += amount;

        emit Deposited(msg.sender, token, amount, block.timestamp);
    }

    /**
     * @notice Withdraws available tokens from the vault
     * @param token The ERC20 token address
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        uint256 availableBalance = balances[msg.sender][token] -
            lockedBalances[msg.sender][token];
        require(availableBalance >= amount, "Insufficient available balance");

        balances[msg.sender][token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, token, amount, block.timestamp);
    }

    /**
     * @notice Locks funds for a subscription (called by authorized manager)
     * @param user The user's address
     * @param token The token address
     * @param amount The amount to lock
     */
    function lockFunds(
        address user,
        address token,
        uint256 amount
    ) external {
        require(authorizedManagers[msg.sender], "Not authorized");
        require(
            balances[user][token] >= lockedBalances[user][token] + amount,
            "Insufficient balance"
        );

        lockedBalances[user][token] += amount;

        emit FundsLocked(user, token, amount, block.timestamp);
    }

    /**
     * @notice Unlocks funds after subscription cancellation (called by authorized manager)
     * @param user The user's address
     * @param token The token address
     * @param amount The amount to unlock
     */
    function unlockFunds(
        address user,
        address token,
        uint256 amount
    ) external {
        require(authorizedManagers[msg.sender], "Not authorized");
        require(lockedBalances[user][token] >= amount, "Insufficient locked balance");

        lockedBalances[user][token] -= amount;

        emit FundsUnlocked(user, token, amount, block.timestamp);
    }

    /**
     * @notice Transfers locked funds for subscription payment (called by authorized manager)
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
    ) external nonReentrant {
        require(authorizedManagers[msg.sender], "Not authorized");
        require(lockedBalances[from][token] >= amount, "Insufficient locked funds");

        balances[from][token] -= amount;
        lockedBalances[from][token] -= amount;

        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @notice Gets the available (unlocked) balance for a user
     * @param user The user's address
     * @param token The token address
     */
    function getAvailableBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return balances[user][token] - lockedBalances[user][token];
    }

    /**
     * @notice Gets the total balance for a user
     * @param user The user's address
     * @param token The token address
     */
    function getTotalBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return balances[user][token];
    }

    /**
     * @notice Gets the locked balance for a user
     * @param user The user's address
     * @param token The token address
     */
    function getLockedBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return lockedBalances[user][token];
    }
}

