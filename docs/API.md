# Frontend API Documentation

## Contract Integration

### Setup

```typescript
import { ethers } from 'ethers';
import { 
  getPaymentManagerContract,
  getSubscriptionVaultContract,
  getRefundHandlerContract 
} from '@/lib/contracts';

// Connect with signer
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const paymentManager = getPaymentManagerContract(signer);
```

## Subscription Management

### Create Subscription

```typescript
async function createSubscription(
  creatorAddress: string,
  tokenAddress: string,
  amount: bigint,
  interval: number
) {
  // Approve token spending first
  const token = getERC20Contract(tokenAddress, signer);
  await token.approve(paymentManagerAddress, amount * 2n);

  // Create subscription
  const tx = await paymentManager.createSubscription(
    creatorAddress,
    tokenAddress,
    amount,
    interval
  );
  
  const receipt = await tx.wait();
  
  // Get subscription ID from event
  const event = receipt.logs.find(
    log => log.topics[0] === ethers.id('SubscriptionCreated(...)')
  );
  
  return event.args.subscriptionId;
}
```

### Get Subscription Details

```typescript
async function getSubscription(subscriptionId: number) {
  const subscription = await paymentManager.getSubscription(subscriptionId);
  
  return {
    subscriber: subscription.subscriber,
    creator: subscription.creator,
    paymentToken: subscription.paymentToken,
    amount: ethers.formatUnits(subscription.amount, 6), // Assuming USDC
    interval: Number(subscription.interval),
    nextPaymentDue: Number(subscription.nextPaymentDue),
    isActive: subscription.isActive,
    startTime: Number(subscription.startTime),
  };
}
```

### Cancel Subscription

```typescript
async function cancelSubscription(subscriptionId: number) {
  const tx = await paymentManager.cancelSubscription(subscriptionId);
  await tx.wait();
}
```

### Process Payment

```typescript
async function processRecurringPayment(subscriptionId: number) {
  const tx = await paymentManager.processPayment(subscriptionId);
  await tx.wait();
}
```

## Vault Operations

### Deposit Funds

```typescript
async function depositToVault(
  tokenAddress: string,
  amount: bigint
) {
  const vault = getSubscriptionVaultContract(signer);
  const token = getERC20Contract(tokenAddress, signer);
  
  // Approve vault
  await token.approve(vaultAddress, amount);
  
  // Deposit
  const tx = await vault.deposit(tokenAddress, amount);
  await tx.wait();
}
```

### Withdraw Funds

```typescript
async function withdrawFromVault(
  tokenAddress: string,
  amount: bigint
) {
  const vault = getSubscriptionVaultContract(signer);
  const tx = await vault.withdraw(tokenAddress, amount);
  await tx.wait();
}
```

### Check Balances

```typescript
async function getVaultBalances(
  userAddress: string,
  tokenAddress: string
) {
  const vault = getSubscriptionVaultContract(signer);
  
  const [total, locked, available] = await Promise.all([
    vault.getTotalBalance(userAddress, tokenAddress),
    vault.getLockedBalance(userAddress, tokenAddress),
    vault.getAvailableBalance(userAddress, tokenAddress),
  ]);
  
  return {
    total: ethers.formatUnits(total, 6),
    locked: ethers.formatUnits(locked, 6),
    available: ethers.formatUnits(available, 6),
  };
}
```

## Refund Management

### Request Refund

```typescript
async function requestRefund(
  subscriptionId: number,
  subscription: Subscription
) {
  const refundHandler = getRefundHandlerContract(signer);
  
  const tx = await refundHandler.requestRefund(
    subscriptionId,
    subscription.subscriber,
    subscription.creator,
    subscription.paymentToken,
    subscription.amount,
    subscription.startTime
  );
  
  const receipt = await tx.wait();
  
  // Extract refund ID from event
  const event = receipt.logs.find(
    log => log.topics[0] === ethers.id('RefundRequested(...)')
  );
  
  return event.args.refundId;
}
```

### Process Refund (Creator)

```typescript
async function processRefund(
  refundId: number,
  approve: boolean
) {
  const refundHandler = getRefundHandlerContract(signer);
  
  if (approve) {
    // Approve token spending first
    const refundRequest = await refundHandler.getRefundRequest(refundId);
    const token = getERC20Contract(refundRequest.token, signer);
    await token.approve(refundHandlerAddress, refundRequest.amount);
  }
  
  const tx = await refundHandler.processRefund(refundId, approve);
  await tx.wait();
}
```

### Get Refund Policy

```typescript
async function getCreatorRefundPolicy(creatorAddress: string) {
  const refundHandler = getRefundHandlerContract(signer);
  const policy = await refundHandler.getRefundPolicy(creatorAddress);
  
  return {
    refundWindowDays: Number(policy.refundWindowDays),
    refundPercentage: Number(policy.refundPercentage),
    isActive: policy.isActive,
  };
}
```

## Event Listening

### Listen for New Subscriptions

```typescript
paymentManager.on('SubscriptionCreated', (
  subscriptionId,
  subscriber,
  creator,
  paymentToken,
  amount,
  interval
) => {
  console.log('New subscription:', {
    id: subscriptionId.toString(),
    subscriber,
    creator,
    amount: ethers.formatUnits(amount, 6),
  });
});
```

### Listen for Payments

```typescript
paymentManager.on('PaymentProcessed', (
  subscriptionId,
  subscriber,
  creator,
  amount,
  timestamp
) => {
  console.log('Payment processed:', {
    id: subscriptionId.toString(),
    amount: ethers.formatUnits(amount, 6),
    timestamp: new Date(Number(timestamp) * 1000),
  });
});
```

## Error Handling

```typescript
try {
  await createSubscription(creator, token, amount, interval);
} catch (error) {
  if (error.code === 'ACTION_REJECTED') {
    console.error('User rejected transaction');
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    console.error('Insufficient balance');
  } else if (error.message.includes('Invalid creator address')) {
    console.error('Invalid creator');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

## Utilities

### Format Token Amount

```typescript
function formatUSDC(amount: bigint): string {
  return ethers.formatUnits(amount, 6);
}

function parseUSDC(amount: string): bigint {
  return ethers.parseUnits(amount, 6);
}
```

### Format Timestamp

```typescript
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}
```

### Calculate Next Payment Date

```typescript
function calculateNextPayment(
  startTime: number,
  interval: number
): Date {
  const now = Date.now() / 1000;
  const elapsed = now - startTime;
  const periods = Math.floor(elapsed / interval);
  const nextPayment = startTime + (periods + 1) * interval;
  return new Date(nextPayment * 1000);
}
```

