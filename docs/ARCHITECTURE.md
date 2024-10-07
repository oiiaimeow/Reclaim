# Reclaim Architecture

## Overview

Reclaim is a decentralized subscription payment platform built on Ethereum using ERC-4337 Account Abstraction. This document outlines the system architecture and component interactions.

## System Components

### Smart Contracts Layer

#### 1. PaymentManager.sol
- **Purpose**: Core contract managing subscription lifecycle
- **Key Functions**:
  - `createSubscription()`: Creates new subscriptions
  - `processPayment()`: Handles recurring payments
  - `cancelSubscription()`: Terminates subscriptions
  - `getSubscription()`: Retrieves subscription details

#### 2. SubscriptionVault.sol
- **Purpose**: Secure storage for subscription funds
- **Key Functions**:
  - `deposit()`: Deposits tokens into vault
  - `withdraw()`: Withdraws available balance
  - `lockFunds()`: Locks funds for active subscriptions
  - `unlockFunds()`: Releases locked funds
  - `transferLockedFunds()`: Executes subscription payments

#### 3. RefundHandler.sol
- **Purpose**: Manages refund requests and policies
- **Key Functions**:
  - `requestRefund()`: Initiates refund request
  - `processRefund()`: Approves or rejects refunds
  - `setRefundPolicy()`: Configures refund terms
  - `calculateRefundAmount()`: Computes refund amounts

#### 4. SubscriptionFactory.sol
- **Purpose**: Deploys new payment manager instances
- **Key Functions**:
  - `deployPaymentManager()`: Creates new payment manager
  - `getCreatorManagers()`: Lists creator's managers

#### 5. PriceOracle.sol
- **Purpose**: Provides token price feeds
- **Key Functions**:
  - `updatePrice()`: Updates token pair prices
  - `getPrice()`: Retrieves current price
  - `convertAmount()`: Converts between tokens

#### 6. AccessControl.sol
- **Purpose**: Role-based permission management
- **Roles**:
  - ADMIN_ROLE: System administration
  - MANAGER_ROLE: Payment management
  - OPERATOR_ROLE: Operations execution
  - PAUSER_ROLE: Emergency pause functionality

### Frontend Layer

#### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Web3**: ethers.js v6
- **State Management**: React Context + Hooks

#### Key Components

1. **SubscriptionCard**
   - Displays individual subscription details
   - Handles cancellation actions
   - Shows payment status and next due date

2. **CreatorDashboard**
   - Shows creator statistics
   - Lists all subscribers
   - Displays revenue metrics

3. **SubscribeForm**
   - Subscription creation interface
   - Token approval flow
   - Payment configuration

4. **WalletConnector**
   - Web3 wallet integration
   - Account management
   - Network switching

### Backend Services

#### 1. Indexing Service (The Graph)
- Indexes blockchain events
- Provides subscription data
- Tracks payment history
- Aggregates creator statistics

#### 2. Notification Service
- Monitors upcoming payments
- Sends payment reminders
- Alerts on failed transactions
- Notifies subscription status changes

## Data Flow

### Subscription Creation Flow

```
User → Frontend → Wallet → PaymentManager
                            ↓
                     Emit SubscriptionCreated
                            ↓
                        The Graph
                            ↓
                      Update UI
```

### Payment Processing Flow

```
Scheduler/User → PaymentManager.processPayment()
                        ↓
                 Check subscription validity
                        ↓
                 Transfer tokens
                        ↓
                 Update next payment date
                        ↓
                 Emit PaymentProcessed
```

### Refund Flow

```
Subscriber → RefundHandler.requestRefund()
                    ↓
            Check refund policy
                    ↓
            Create refund request
                    ↓
Creator/Admin → processRefund()
                    ↓
            Transfer refund amount
                    ↓
            Update subscription status
```

## Security Architecture

### Smart Contract Security

1. **Access Control**
   - Role-based permissions
   - Owner-only functions
   - Authorized manager checks

2. **Reentrancy Protection**
   - ReentrancyGuard on all state-changing functions
   - Checks-Effects-Interactions pattern

3. **Input Validation**
   - Address zero checks
   - Amount validations
   - Interval constraints

4. **Safe Token Transfers**
   - SafeERC20 for all token operations
   - Approval checks before transfers

### Frontend Security

1. **Wallet Security**
   - Signature verification
   - Transaction simulation
   - Gas estimation

2. **Input Sanitization**
   - Address validation
   - Amount bounds checking
   - XSS prevention

## Scalability Considerations

### Layer 2 Integration
- Compatible with Optimism, Arbitrum
- Reduced gas costs
- Faster transaction finality

### Gas Optimization
- Batch processing for multiple payments
- Efficient storage patterns
- Minimal on-chain computation

### Event Indexing
- The Graph for efficient queries
- Cached data for common requests
- Pagination for large datasets

## Deployment Architecture

### Development Environment
- Local Hardhat node
- Test token deployments
- Frontend dev server

### Testnet Environment
- Sepolia deployment
- Faucet for test tokens
- Public frontend instance

### Mainnet Environment
- Multi-signature deployment
- Verified contracts
- Production frontend
- Monitoring and alerts

## Future Enhancements

1. **ERC-4337 Integration**
   - Smart contract wallets
   - Gasless transactions
   - Session keys for recurring payments

2. **Multi-Chain Support**
   - Cross-chain subscriptions
   - Bridge integrations
   - Unified frontend

3. **Advanced Features**
   - Tiered subscriptions
   - Discount codes
   - Affiliate system
   - Analytics dashboard

## Monitoring and Maintenance

### Health Checks
- Contract upgrade monitoring
- Event emission verification
- Balance tracking
- Failed transaction alerts

### Analytics
- Subscription metrics
- Revenue tracking
- User growth
- Churn analysis

### Upgradability
- Proxy pattern for contracts
- Migration scripts
- Backward compatibility
- State preservation

## Testing Strategy

### Smart Contract Tests
- Unit tests for each contract
- Integration tests for workflows
- Gas optimization tests
- Security audit preparation

### Frontend Tests
- Component unit tests
- Integration tests
- E2E tests with Cypress
- Wallet interaction mocks

### Continuous Integration
- Automated testing on commits
- Coverage reporting
- Deployment validation
- Performance benchmarking

