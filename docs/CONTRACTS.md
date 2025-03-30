# Smart Contracts Documentation

## Overview

Reclaim uses a modular smart contract architecture to handle decentralized subscription payments with Account Abstraction support.

## Contract Architecture

```
┌─────────────────────┐
│  PaymentManager     │  Main subscription logic
└──────────┬──────────┘
           │
           ├──────────┐
           │          │
┌──────────▼─────────┐│
│ SubscriptionVault  ││  Fund management
└────────────────────┘│
           │          │
┌──────────▼──────────▼┐
│   RefundHandler      │  Cancellation & refunds
└──────────────────────┘
```

## Core Contracts

### PaymentManager.sol

The main contract that handles subscription creation, recurring payments, and cancellations.

**Key Functions:**

- `createSubscription(address creator, address paymentToken, uint256 amount, uint256 interval)`: Creates a new subscription
- `processPayment(uint256 subscriptionId)`: Processes a recurring payment
- `cancelSubscription(uint256 subscriptionId)`: Cancels an active subscription
- `getSubscription(uint256 subscriptionId)`: Returns subscription details
- `getCreatorSubscriptions(address creator)`: Returns all subscriptions for a creator
- `getSubscriberSubscriptions(address subscriber)`: Returns all subscriptions for a subscriber

**Events:**

- `SubscriptionCreated(uint256 subscriptionId, address subscriber, address creator, ...)`
- `PaymentProcessed(uint256 subscriptionId, address subscriber, address creator, uint256 amount, uint256 timestamp)`
- `SubscriptionCancelled(uint256 subscriptionId, address subscriber, uint256 timestamp)`

**Subscription Structure:**

```solidity
struct Subscription {
    address subscriber;      // User subscribing
    address creator;         // Content creator
    address paymentToken;    // ERC20 token for payment
    uint256 amount;          // Payment amount per interval
    uint256 interval;        // Payment frequency in seconds
    uint256 nextPaymentDue;  // Timestamp of next payment
    bool isActive;           // Subscription status
    uint256 startTime;       // Subscription start timestamp
}
```

### SubscriptionVault.sol

Manages secure fund storage with locked balances for active subscriptions.

**Key Functions:**

- `deposit(address token, uint256 amount)`: Deposits tokens into vault
- `withdraw(address token, uint256 amount)`: Withdraws available tokens
- `lockFunds(address user, address token, uint256 amount)`: Locks funds for subscription (authorized only)
- `unlockFunds(address user, address token, uint256 amount)`: Unlocks funds after cancellation
- `transferLockedFunds(address from, address to, address token, uint256 amount)`: Transfers locked funds for payment
- `getAvailableBalance(address user, address token)`: Returns withdrawable balance
- `getTotalBalance(address user, address token)`: Returns total balance
- `getLockedBalance(address user, address token)`: Returns locked balance

**Authorization:**

Only authorized payment managers can lock/unlock funds. Set via `setAuthorizedManager(address manager, bool authorized)`.

### RefundHandler.sol

Handles refund requests and policies for cancelled subscriptions.

**Key Functions:**

- `requestRefund(...)`: Creates a refund request within the refund window
- `processRefund(uint256 refundId, bool approve)`: Approves or rejects refund
- `setDefaultRefundPolicy(uint256 refundWindowDays, uint256 refundPercentage)`: Sets default policy (owner only)
- `setCreatorRefundPolicy(uint256 refundWindowDays, uint256 refundPercentage)`: Sets creator-specific policy
- `calculateRefundAmount(address creator, uint256 amount)`: Calculates refund amount based on policy

**Refund Policy Structure:**

```solidity
struct RefundPolicy {
    uint256 refundWindowDays;  // Days within which refunds are allowed
    uint256 refundPercentage;  // Percentage of refund (0-100)
    bool isActive;             // Policy status
}
```

**Refund Status:**

- `Pending (0)`: Awaiting approval
- `Approved (1)`: Approved, pending transfer
- `Rejected (2)`: Rejected by creator
- `Processed (3)`: Refund completed

### MockUSDC.sol

Test ERC20 token with faucet functionality for development.

**Key Functions:**

- `mint(address to, uint256 amount)`: Mints tokens (owner only)
- `faucet(uint256 amount)`: Public faucet (max 10,000 USDC per call)

## Deployment

See `scripts/deploy.ts` for deployment script.

**Deployment Order:**

1. Deploy MockUSDC (or use existing stablecoin)
2. Deploy PaymentManager
3. Deploy SubscriptionVault
4. Deploy RefundHandler
5. Authorize PaymentManager in SubscriptionVault

## Security Considerations

- All contracts use OpenZeppelin's `ReentrancyGuard` for protection
- Fund transfers use `SafeERC20` for secure token handling
- Access control via `Ownable` for administrative functions
- Subscription cancellation available to both subscriber and creator

## Gas Optimization

- Optimized storage layout
- Batch operations where possible
- Event indexing for efficient querying

## Testing

Run comprehensive test suite:

```bash
npx hardhat test
```

## Upgradeability

Current contracts are non-upgradeable. For production, consider using proxy patterns for future upgrades.


