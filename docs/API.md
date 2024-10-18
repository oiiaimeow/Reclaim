# Reclaim API Documentation

## Smart Contract APIs

### PaymentManager

#### createSubscription

Creates a new subscription between a subscriber and creator.

```solidity
function createSubscription(
    address creator,
    address paymentToken,
    uint256 amount,
    uint256 interval
) external returns (uint256 subscriptionId)
```

**Parameters:**
- `creator`: Address of the content creator
- `paymentToken`: ERC20 token address for payments
- `amount`: Payment amount per interval
- `interval`: Payment interval in seconds (minimum 1 day)

**Returns:**
- `subscriptionId`: Unique identifier for the subscription

**Events Emitted:**
- `SubscriptionCreated(subscriptionId, subscriber, creator, paymentToken, amount, interval)`
- `PaymentProcessed(subscriptionId, subscriber, creator, amount, timestamp)`

**Requirements:**
- Creator address must be valid
- Payment token must be valid ERC20
- Amount must be greater than 0
- Interval must be at least 1 day
- Subscriber must have approved tokens

---

#### processPayment

Processes a recurring payment for an active subscription.

```solidity
function processPayment(uint256 subscriptionId) external
```

**Parameters:**
- `subscriptionId`: ID of the subscription to process

**Events Emitted:**
- `PaymentProcessed(subscriptionId, subscriber, creator, amount, timestamp)`

**Requirements:**
- Subscription must be active
- Current time must be >= next payment due date
- Subscriber must have sufficient token balance
- Subscriber must have approved tokens

---

#### cancelSubscription

Cancels an active subscription.

```solidity
function cancelSubscription(uint256 subscriptionId) external
```

**Parameters:**
- `subscriptionId`: ID of the subscription to cancel

**Events Emitted:**
- `SubscriptionCancelled(subscriptionId, subscriber, timestamp)`

**Requirements:**
- Caller must be subscriber or creator
- Subscription must be active

---

#### getSubscription

Retrieves subscription details.

```solidity
function getSubscription(uint256 subscriptionId) 
    external 
    view 
    returns (Subscription memory)
```

**Parameters:**
- `subscriptionId`: ID of the subscription

**Returns:**
- `Subscription` struct containing:
  - `subscriber`: Subscriber address
  - `creator`: Creator address
  - `paymentToken`: Payment token address
  - `amount`: Payment amount
  - `interval`: Payment interval
  - `nextPaymentDue`: Timestamp of next payment
  - `isActive`: Active status
  - `startTime`: Subscription start timestamp

---

#### getCreatorSubscriptions

Gets all subscription IDs for a creator.

```solidity
function getCreatorSubscriptions(address creator) 
    external 
    view 
    returns (uint256[] memory)
```

**Parameters:**
- `creator`: Creator's address

**Returns:**
- Array of subscription IDs

---

#### getSubscriberSubscriptions

Gets all subscription IDs for a subscriber.

```solidity
function getSubscriberSubscriptions(address subscriber) 
    external 
    view 
    returns (uint256[] memory)
```

**Parameters:**
- `subscriber`: Subscriber's address

**Returns:**
- Array of subscription IDs

---

### SubscriptionVault

#### deposit

Deposits tokens into the vault.

```solidity
function deposit(address token, uint256 amount) external
```

**Parameters:**
- `token`: ERC20 token address
- `amount`: Amount to deposit

**Events Emitted:**
- `Deposited(user, token, amount, timestamp)`

**Requirements:**
- Token address must be valid
- Amount must be greater than 0
- User must have approved tokens

---

#### withdraw

Withdraws available tokens from the vault.

```solidity
function withdraw(address token, uint256 amount) external
```

**Parameters:**
- `token`: ERC20 token address
- `amount`: Amount to withdraw

**Events Emitted:**
- `Withdrawn(user, token, amount, timestamp)`

**Requirements:**
- Token address must be valid
- Amount must be greater than 0
- User must have sufficient available balance (excluding locked funds)

---

#### lockFunds

Locks funds for a subscription (called by authorized manager).

```solidity
function lockFunds(
    address user,
    address token,
    uint256 amount
) external
```

**Parameters:**
- `user`: User's address
- `token`: Token address
- `amount`: Amount to lock

**Events Emitted:**
- `FundsLocked(user, token, amount, timestamp)`

**Requirements:**
- Caller must be authorized manager
- User must have sufficient balance

---

#### unlockFunds

Unlocks funds after subscription cancellation.

```solidity
function unlockFunds(
    address user,
    address token,
    uint256 amount
) external
```

**Parameters:**
- `user`: User's address
- `token`: Token address
- `amount`: Amount to unlock

**Events Emitted:**
- `FundsUnlocked(user, token, amount, timestamp)`

**Requirements:**
- Caller must be authorized manager
- User must have sufficient locked balance

---

#### getAvailableBalance

Gets the available (unlocked) balance for a user.

```solidity
function getAvailableBalance(address user, address token) 
    external 
    view 
    returns (uint256)
```

**Parameters:**
- `user`: User's address
- `token`: Token address

**Returns:**
- Available balance amount

---

### RefundHandler

#### requestRefund

Requests a refund for a cancelled subscription.

```solidity
function requestRefund(
    uint256 subscriptionId,
    address subscriber,
    address creator,
    address token,
    uint256 amount,
    uint256 subscriptionStartTime
) external returns (uint256 refundId)
```

**Parameters:**
- `subscriptionId`: Subscription ID
- `subscriber`: Subscriber's address
- `creator`: Creator's address
- `token`: Payment token address
- `amount`: Subscription amount
- `subscriptionStartTime`: When subscription started

**Returns:**
- `refundId`: Unique refund request ID

**Events Emitted:**
- `RefundRequested(refundId, subscriptionId, subscriber, creator, amount)`

**Requirements:**
- Caller must be the subscriber
- Within refund window period
- No existing refund for this subscription

---

#### processRefund

Processes a refund request (approve or reject).

```solidity
function processRefund(uint256 refundId, bool approve) external
```

**Parameters:**
- `refundId`: Refund request ID
- `approve`: True to approve, false to reject

**Events Emitted:**
- `RefundProcessed(refundId, subscriptionId, subscriber, amount, status)`

**Requirements:**
- Caller must be creator or contract owner
- Refund request must be pending
- Creator must have approved tokens (if approving)

---

#### getRefundPolicy

Gets the applicable refund policy for a creator.

```solidity
function getRefundPolicy(address creator) 
    external 
    view 
    returns (RefundPolicy memory)
```

**Parameters:**
- `creator`: Creator's address

**Returns:**
- `RefundPolicy` struct containing:
  - `refundWindowDays`: Days within which refunds allowed
  - `refundPercentage`: Refund percentage (0-100)
  - `isActive`: Whether policy is active

---

### PriceOracle

#### updatePrice

Updates the price for a token pair (owner only).

```solidity
function updatePrice(
    address tokenA,
    address tokenB,
    uint256 price
) external
```

**Parameters:**
- `tokenA`: First token address
- `tokenB`: Second token address
- `price`: Price in 18 decimals

**Events Emitted:**
- `PriceUpdated(tokenA, tokenB, price, timestamp)`

**Requirements:**
- Caller must be owner
- Tokens must be valid addresses
- Price must be greater than 0

---

#### getPrice

Gets the current price for a token pair.

```solidity
function getPrice(address tokenA, address tokenB) 
    external 
    view 
    returns (uint256)
```

**Parameters:**
- `tokenA`: First token address
- `tokenB`: Second token address

**Returns:**
- Price in 18 decimals

**Requirements:**
- Price must exist for the pair
- Price must not be expired (within 24 hours)

---

#### convertAmount

Converts an amount from one token to another.

```solidity
function convertAmount(
    address tokenA,
    address tokenB,
    uint256 amountA
) external view returns (uint256 amountB)
```

**Parameters:**
- `tokenA`: Source token
- `tokenB`: Target token
- `amountA`: Amount in source token

**Returns:**
- Equivalent amount in target token

**Requirements:**
- Price must be available and valid

---

## Frontend API (TypeScript/ethers.js)

### Contract Helpers

```typescript
import { 
  createSubscription,
  cancelSubscription,
  getSubscription,
  processPayment 
} from '@/utils/contractHelpers';

// Create subscription
const tx = await createSubscription(
  signer,
  creatorAddress,
  tokenAddress,
  parseEther("10"),
  2592000 // 30 days
);

// Cancel subscription
await cancelSubscription(signer, subscriptionId);

// Get subscription details
const subscription = await getSubscription(provider, subscriptionId);

// Process payment
await processPayment(signer, subscriptionId);
```

### Utility Functions

```typescript
import { 
  formatInterval,
  parseInterval,
  shortenAddress,
  getDaysUntilPayment 
} from '@/utils/contractHelpers';

// Format interval
formatInterval(2592000); // "Monthly"

// Parse interval
parseInterval("weekly"); // 604800

// Shorten address
shortenAddress("0x1234...5678"); // "0x1234...5678"

// Days until payment
getDaysUntilPayment(nextPaymentTimestamp); // 15
```

## Event Definitions

### SubscriptionCreated
```solidity
event SubscriptionCreated(
    uint256 indexed subscriptionId,
    address indexed subscriber,
    address indexed creator,
    address paymentToken,
    uint256 amount,
    uint256 interval
);
```

### PaymentProcessed
```solidity
event PaymentProcessed(
    uint256 indexed subscriptionId,
    address indexed subscriber,
    address indexed creator,
    uint256 amount,
    uint256 timestamp
);
```

### SubscriptionCancelled
```solidity
event SubscriptionCancelled(
    uint256 indexed subscriptionId,
    address indexed subscriber,
    uint256 timestamp
);
```

### RefundRequested
```solidity
event RefundRequested(
    uint256 indexed refundId,
    uint256 indexed subscriptionId,
    address indexed subscriber,
    address creator,
    uint256 amount
);
```

## Error Codes

| Error | Description |
|-------|-------------|
| `Invalid creator address` | Creator address is zero |
| `Invalid token address` | Token address is zero |
| `Amount must be greater than 0` | Payment amount is zero |
| `Interval must be at least 1 day` | Interval is too short |
| `Subscription is not active` | Trying to process inactive subscription |
| `Payment not due yet` | Trying to process before due date |
| `Insufficient balance` | Not enough token balance |
| `Refund window expired` | Past refund eligibility period |
| `Price expired` | Oracle price is stale |

## Rate Limits

- No rate limits on read operations
- Write operations limited by blockchain block time
- Recommended: Batch operations when possible

## Best Practices

1. **Always check allowances** before creating subscriptions
2. **Validate subscription data** before displaying to users
3. **Handle transaction failures** gracefully
4. **Use events for real-time updates** via The Graph or websockets
5. **Estimate gas** before transactions
6. **Implement retry logic** for failed transactions
7. **Cache frequently accessed data** to reduce RPC calls
