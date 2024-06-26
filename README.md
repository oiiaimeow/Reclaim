# Reclaim - Decentralized Subscription Payment System

A decentralized subscription payment platform built on ERC-4337 Account Abstraction, enabling automated recurring payments with cryptocurrency.

## Overview

Reclaim revolutionizes subscription-based payments by leveraging blockchain technology and smart contract automation. Users can subscribe to content creators with automatic recurring payments without the need for traditional payment processors.

## Features

- **Automated Recurring Payments**: Leverages ERC-4337 Account Abstraction for seamless subscription management
- **Multi-Currency Support**: Accept payments in various stablecoins
- **Creator Dashboard**: Real-time analytics for subscription revenue and subscriber management
- **Flexible Subscriptions**: Customizable payment intervals and amounts
- **Refund Mechanism**: Built-in cancellation and refund handling
- **Gas Optimization**: Efficient smart contracts to minimize transaction costs

## Project Status

🚧 Under active development

## Technology Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, Next.js, TypeScript
- **Wallet Integration**: ERC-4337 Smart Account
- **Blockchain**: Ethereum (mainnet & testnets)
- **Indexing**: The Graph

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oiiaimeow/Reclaim.git
cd Reclaim
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Smart Contract Development

#### Compile Contracts

```bash
npx hardhat compile
```

#### Run Tests

```bash
npx hardhat test
```

#### Deploy Contracts

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

#### Run Local Node

```bash
npx hardhat node
```

### Frontend Development

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Reclaim/
├── contracts/          # Smart contracts
├── scripts/           # Deployment scripts
├── test/              # Contract tests
├── frontend/          # Next.js frontend
│   ├── app/          # Pages and routes
│   ├── components/   # React components
│   ├── lib/          # Utilities and contracts
│   └── utils/        # Helper functions
└── docs/             # Documentation
```

## Architecture

See [CONTRACTS.md](docs/CONTRACTS.md) for smart contract architecture and [API.md](docs/API.md) for frontend integration guide.

## Community

- [GitHub](https://github.com/oiiaimeow/Reclaim)
- [Twitter](https://twitter.com/reclaim)
- [Discord](https://discord.gg/reclaim)
- [Documentation](https://docs.reclaim.xyz)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

Security is our top priority. See [SECURITY.md](docs/SECURITY.md) for our security policy and how to report vulnerabilities.

## License

MIT License

