/**
 * Application constants
 */

// Supported payment tokens
export const SUPPORTED_TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000000', // Update with actual address
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000000', // Update with actual address
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Update with actual address
  },
];

// Subscription intervals (in seconds)
export const SUBSCRIPTION_INTERVALS = {
  DAILY: 86400,
  WEEKLY: 604800,
  MONTHLY: 2592000,
  QUARTERLY: 7776000,
  YEARLY: 31536000,
};

// Subscription interval options for UI
export const INTERVAL_OPTIONS = [
  { label: 'Daily', value: SUBSCRIPTION_INTERVALS.DAILY },
  { label: 'Weekly', value: SUBSCRIPTION_INTERVALS.WEEKLY },
  { label: 'Monthly', value: SUBSCRIPTION_INTERVALS.MONTHLY },
  { label: 'Quarterly', value: SUBSCRIPTION_INTERVALS.QUARTERLY },
  { label: 'Yearly', value: SUBSCRIPTION_INTERVALS.YEARLY },
];

// Creator categories
export const CREATOR_CATEGORIES = [
  'Technology',
  'Finance',
  'Art',
  'Education',
  'Gaming',
  'Music',
  'Writing',
  'Podcasts',
  'Video',
  'Other',
];

// Default refund window (in days)
export const DEFAULT_REFUND_WINDOW = 7;

// Minimum subscription amount (in USD)
export const MIN_SUBSCRIPTION_AMOUNT = 1;

// Maximum subscription amount (in USD)
export const MAX_SUBSCRIPTION_AMOUNT = 10000;

// Transaction confirmation blocks
export const CONFIRMATION_BLOCKS = 2;

// Polling interval for transaction status (in milliseconds)
export const POLLING_INTERVAL = 3000;

// Maximum retries for failed transactions
export const MAX_RETRIES = 3;

// Gas price multiplier for faster transactions
export const GAS_PRICE_MULTIPLIER = 1.2;

// Links
export const SOCIAL_LINKS = {
  github: 'https://github.com/oiiaimeow/Reclaim',
  twitter: 'https://twitter.com/reclaim',
  discord: 'https://discord.gg/reclaim',
  docs: 'https://docs.reclaim.xyz',
};

// Chain-specific configurations
export const CHAIN_CONFIG = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    explorer: 'https://sepolia.etherscan.io',
  },
  hardhat: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: '',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  INVALID_AMOUNT: 'Invalid amount entered',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  NETWORK_MISMATCH: 'Please switch to the correct network',
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  UNAUTHORIZED: 'Unauthorized action',
};


