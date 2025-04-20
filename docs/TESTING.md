# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx hardhat test test/PaymentManager.test.ts
```

## Test Structure

Tests are organized by contract:
- PaymentManager.test.ts
- SubscriptionVault.test.ts
- RefundHandler.test.ts
- Integration.test.ts

## Writing Tests

Use Hardhat's testing framework with Chai assertions.

Example:
```typescript
describe("PaymentManager", function () {
  it("Should create subscription", async function () {
    // Test implementation
  });
});
```

