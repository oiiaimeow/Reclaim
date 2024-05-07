# Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- Hardhat configured
- Private key with sufficient ETH for gas
- Etherscan API key (for verification)

## Environment Setup

1. Copy environment template:
```bash
cp .env.example .env
```

2. Configure `.env`:
```
NETWORK=sepolia
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
DEPLOYER_PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Deployment Steps

### 1. Compile Contracts

```bash
npx hardhat compile
```

### 2. Run Tests

```bash
npx hardhat test
```

### 3. Deploy to Testnet

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### 4. Verify Contracts

```bash
npx hardhat run scripts/verify.ts --network sepolia
```

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Sufficient ETH in deployer wallet
- [ ] Contract parameters reviewed
- [ ] Deployment script tested on local network
- [ ] Backup of deployment addresses saved
- [ ] Contracts verified on Etherscan
- [ ] Frontend updated with contract addresses

## Post-Deployment

1. Save contract addresses to `.env`:
```
PAYMENT_MANAGER_ADDRESS=0x...
SUBSCRIPTION_VAULT_ADDRESS=0x...
REFUND_HANDLER_ADDRESS=0x...
MOCK_USDC_ADDRESS=0x...
```

2. Update frontend configuration:
```typescript
// frontend/lib/contracts.ts
export const CONTRACT_ADDRESSES = {
  PaymentManager: '0x...',
  // ...
};
```

3. Test contract interactions on testnet

## Network Configuration

### Sepolia Testnet

- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/YOUR_KEY
- Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com

### Mainnet

- Chain ID: 1
- RPC: https://mainnet.infura.io/v3/YOUR_KEY
- Explorer: https://etherscan.io
- **Warning**: Ensure thorough testing before mainnet deployment

## Gas Optimization

Estimated gas costs:
- PaymentManager deployment: ~2,500,000 gas
- SubscriptionVault deployment: ~2,000,000 gas
- RefundHandler deployment: ~2,800,000 gas
- Create subscription: ~150,000 gas
- Process payment: ~80,000 gas
- Cancel subscription: ~50,000 gas

## Troubleshooting

### Deployment Fails

- Check deployer wallet balance
- Verify RPC endpoint is accessible
- Review gas price settings
- Check for contract compilation errors

### Verification Fails

- Ensure Etherscan API key is valid
- Wait a few minutes after deployment
- Verify constructor arguments match
- Check network configuration

## Security Considerations

- Never commit private keys
- Use hardware wallet for mainnet
- Implement timelock for admin functions
- Consider using multi-sig wallet
- Conduct security audit before mainnet

