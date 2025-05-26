# Test Directory

This directory contains comprehensive test suites for all Reclaim smart contracts.

## Test Files

### Core Contracts
- `PaymentManager.test.ts` - Tests for subscription creation and payment processing
- `SubscriptionVault.test.ts` - Tests for fund management and locking
- `RefundHandler.test.ts` - Tests for refund request and processing
- `MockUSDC.test.ts` - Tests for mock ERC20 token

### Advanced Features
- `PriceOracle.test.ts` - Tests for price feed and token conversion
- `AccessControl.test.ts` - Tests for role-based permissions
- `SubscriptionFactory.test.ts` - Tests for payment manager deployment

### Integration
- `Integration.test.ts` - End-to-end integration tests

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/PaymentManager.test.ts

# Run with coverage
npm run test:coverage

# Run with gas reporter
npm run test
```

## Test Utilities

- `fixtures.ts` - Common test fixtures and helper functions

## Writing Tests

Tests are written using:
- **Hardhat**: Ethereum development environment
- **Ethers.js v6**: Ethereum library
- **Chai**: Assertion library
- **Mocha**: Test framework

Example:
```typescript
describe("PaymentManager", function () {
  it("Should create subscription correctly", async function () {
    // Test implementation
  });
});
```
