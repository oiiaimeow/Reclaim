# Scripts Directory

This directory contains deployment and utility scripts for the Reclaim project.

## Available Scripts

### Deployment
- `deploy-all.ts` - Deploys all contracts to the specified network
- `verify-contracts.ts` - Verifies deployed contracts on Etherscan

### Setup
- `setup-roles.ts` - Configures access control roles
- `setup-oracle.ts` - Initializes price oracle with token pairs

### Utilities
- `check-balances.ts` - Checks wallet balances
- `mint-test-tokens.ts` - Mints test tokens for development
- `monitor.ts` - Monitors subscription events in real-time
- `gas-report.ts` - Generates gas usage reports
- `helpers.ts` - Common helper functions

## Usage

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-all.ts --network sepolia

# Verify contracts
npx hardhat run scripts/verify-contracts.ts --network sepolia

# Monitor events
npx hardhat run scripts/monitor.ts --network sepolia
```

## Environment Variables

Make sure to set up your `.env` file with:
- `PRIVATE_KEY` - Deployer wallet private key
- `SEPOLIA_RPC_URL` - Sepolia RPC endpoint
- `ETHERSCAN_API_KEY` - For contract verification
