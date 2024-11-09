# Deployment Guide

## Prerequisites

Before deploying Reclaim contracts, ensure you have:

1. **Node.js** >= 18.0.0
2. **npm** or **yarn**
3. **Hardhat** environment set up
4. **Wallet** with sufficient ETH for gas fees
5. **RPC URL** for target network
6. **Block explorer API key** (for verification)

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your `.env` file:
```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# Deployment Wallet
PRIVATE_KEY=your_private_key_here

# Block Explorer (for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Addresses (populated after deployment)
PAYMENT_MANAGER_ADDRESS=
SUBSCRIPTION_VAULT_ADDRESS=
REFUND_HANDLER_ADDRESS=
SUBSCRIPTION_FACTORY_ADDRESS=
PRICE_ORACLE_ADDRESS=
ACCESS_CONTROL_ADDRESS=
```

## Deployment Steps

### Local Deployment (for testing)

1. Start local Hardhat node:
```bash
npm run node
```

2. In a new terminal, deploy contracts:
```bash
npx hardhat run scripts/deploy-all.ts --network localhost
```

### Testnet Deployment (Sepolia)

1. Ensure you have test ETH in your wallet
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy-all.ts --network sepolia
```

3. Verify contracts:
```bash
npx hardhat run scripts/verify-contracts.ts --network sepolia
```

### Mainnet Deployment

⚠️ **IMPORTANT**: Mainnet deployment involves real assets. Double-check everything!

1. Review deployment script and parameters
2. Test thoroughly on testnet first
3. Use a multi-sig wallet for production
4. Consider using a deployment service (Defender, Tenderly)

```bash
# Deploy to mainnet
npx hardhat run scripts/deploy-all.ts --network mainnet

# Verify contracts
npx hardhat run scripts/verify-contracts.ts --network mainnet
```

## Deployment Configuration

### Gas Settings

Configure gas settings in `hardhat.config.ts`:

```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: 20000000000, // 20 gwei
  },
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: "auto",
  },
}
```

### Contract Parameters

Key parameters set during deployment:

| Parameter | Default | Description |
|-----------|---------|-------------|
| Deployment Fee | 0.01 ETH | Fee to deploy new payment manager |
| Protocol Fee | 2.5% | Platform fee on transactions |
| Refund Window | 7 days | Default refund eligibility period |
| Refund Percentage | 100% | Default refund amount |
| Min Interval | 1 day | Minimum subscription interval |

## Post-Deployment Steps

### 1. Save Deployment Addresses

Deployment addresses are automatically saved to `deployments/latest.json`:

```json
{
  "ReclaimAccessControl": "0x...",
  "PriceOracle": "0x...",
  "SubscriptionVault": "0x...",
  "RefundHandler": "0x...",
  "PaymentManager": "0x...",
  "SubscriptionFactory": "0x...",
  "MockUSDC": "0x...",
  "deployer": "0x...",
  "network": "sepolia",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Configure Access Control

Grant necessary roles:

```bash
npx hardhat run scripts/setup-roles.ts --network sepolia
```

Or manually using Hardhat console:

```javascript
const accessControl = await ethers.getContractAt(
  "ReclaimAccessControl",
  "ADDRESS"
);

await accessControl.grantManagerRole("MANAGER_ADDRESS");
await accessControl.grantOperatorRole("OPERATOR_ADDRESS");
```

### 3. Authorize Payment Manager

Authorize PaymentManager in SubscriptionVault:

```javascript
const vault = await ethers.getContractAt(
  "SubscriptionVault",
  "VAULT_ADDRESS"
);

await vault.setAuthorizedManager("PAYMENT_MANAGER_ADDRESS", true);
```

### 4. Initialize Price Oracle

Set initial token prices:

```javascript
const oracle = await ethers.getContractAt("PriceOracle", "ORACLE_ADDRESS");

// Set USDC/USDT price (1:1)
await oracle.updatePrice(
  "USDC_ADDRESS",
  "USDT_ADDRESS",
  ethers.parseEther("1")
);

// Set ETH/USDC price (e.g., 2000 USDC per ETH)
await oracle.updatePrice(
  "ETH_ADDRESS",
  "USDC_ADDRESS",
  ethers.parseEther("2000")
);
```

### 5. Update Frontend Configuration

Update frontend `.env.local`:

```env
NEXT_PUBLIC_PAYMENT_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_VAULT_ADDRESS=0x...
NEXT_PUBLIC_REFUND_HANDLER_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111  # Sepolia
```

### 6. Verify on Block Explorer

Check that all contracts are verified on Etherscan:
- Visit: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS`
- Look for green checkmark next to "Contract" tab

### 7. Test Basic Operations

Run integration tests:

```bash
npx hardhat test --network sepolia
```

Test manually:
1. Create a subscription
2. Process a payment
3. Cancel a subscription
4. Request a refund

## Security Checklist

Before going to production:

- [ ] All contracts verified on block explorer
- [ ] Multi-sig wallet controls critical functions
- [ ] Access control roles properly configured
- [ ] Emergency pause mechanism tested
- [ ] Gas costs optimized
- [ ] Security audit completed
- [ ] Bug bounty program active
- [ ] Monitoring and alerts configured
- [ ] Backup and recovery procedures documented
- [ ] Insurance coverage considered

## Monitoring

### Event Monitoring

Set up event listeners for critical events:

```javascript
paymentManager.on("SubscriptionCreated", (id, subscriber, creator) => {
  console.log(`New subscription: ${id}`);
  // Send notification
});

paymentManager.on("PaymentProcessed", (id, amount) => {
  console.log(`Payment processed: ${id} - ${amount}`);
  // Update analytics
});
```

### Health Checks

Monitor:
- Contract balance sufficiency
- Failed transaction rate
- Average gas costs
- Active subscription count
- Revenue metrics

### Alerting

Set up alerts for:
- Large withdrawals
- Failed payments above threshold
- Unusual activity patterns
- Smart contract errors
- Price oracle staleness

## Upgrades and Migrations

### Proxy Pattern (Future Enhancement)

For upgradeable contracts:

1. Deploy proxy contract
2. Deploy implementation
3. Initialize proxy
4. Test upgrade process on testnet
5. Implement timelock for production upgrades

### Migration Script

If migrating to new contracts:

```bash
npx hardhat run scripts/migrate.ts --network sepolia
```

## Troubleshooting

### Common Issues

**Issue**: Deployment fails with "insufficient funds"
- **Solution**: Ensure wallet has enough ETH for gas

**Issue**: Contract verification fails
- **Solution**: Check constructor arguments match deployment

**Issue**: Transaction reverts with "execution reverted"
- **Solution**: Check contract state, balances, and approvals

**Issue**: Gas estimation too high
- **Solution**: Optimize contract code, batch operations

### Support

For deployment issues:
- Check Hardhat documentation
- Review deployment logs
- Contact team on Discord
- Open GitHub issue

## Rollback Plan

If deployment fails:

1. Stop deployment immediately
2. Document the issue
3. Verify funds are safe
4. Review logs and transaction hashes
5. Plan corrective action
6. Re-deploy with fixes

## References

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethereum Gas Tracker](https://etherscan.io/gastracker)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Etherscan API](https://docs.etherscan.io/)
