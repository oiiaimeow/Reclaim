import { ethers } from 'ethers';

export const CONTRACT_ADDRESSES = {
  PaymentManager: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  SubscriptionVault: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  RefundHandler: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  MockUSDC: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
};

export const PAYMENT_MANAGER_ABI = [
  'function createSubscription(address creator, address paymentToken, uint256 amount, uint256 interval) external returns (uint256)',
  'function processPayment(uint256 subscriptionId) external',
  'function cancelSubscription(uint256 subscriptionId) external',
  'function getSubscription(uint256 subscriptionId) external view returns (tuple(address subscriber, address creator, address paymentToken, uint256 amount, uint256 interval, uint256 nextPaymentDue, bool isActive, uint256 startTime))',
  'function getCreatorSubscriptions(address creator) external view returns (uint256[])',
  'function getSubscriberSubscriptions(address subscriber) external view returns (uint256[])',
  'event SubscriptionCreated(uint256 indexed subscriptionId, address indexed subscriber, address indexed creator, address paymentToken, uint256 amount, uint256 interval)',
  'event PaymentProcessed(uint256 indexed subscriptionId, address indexed subscriber, address indexed creator, uint256 amount, uint256 timestamp)',
  'event SubscriptionCancelled(uint256 indexed subscriptionId, address indexed subscriber, uint256 timestamp)',
];

export const SUBSCRIPTION_VAULT_ABI = [
  'function deposit(address token, uint256 amount) external',
  'function withdraw(address token, uint256 amount) external',
  'function getAvailableBalance(address user, address token) external view returns (uint256)',
  'function getTotalBalance(address user, address token) external view returns (uint256)',
  'function getLockedBalance(address user, address token) external view returns (uint256)',
];

export const REFUND_HANDLER_ABI = [
  'function requestRefund(uint256 subscriptionId, address subscriber, address creator, address token, uint256 amount, uint256 subscriptionStartTime) external returns (uint256)',
  'function processRefund(uint256 refundId, bool approve) external',
  'function getRefundPolicy(address creator) external view returns (tuple(uint256 refundWindowDays, uint256 refundPercentage, bool isActive))',
  'function calculateRefundAmount(address creator, uint256 amount) external view returns (uint256)',
];

export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export function getPaymentManagerContract(
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.PaymentManager,
    PAYMENT_MANAGER_ABI,
    signerOrProvider
  );
}

export function getSubscriptionVaultContract(
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.SubscriptionVault,
    SUBSCRIPTION_VAULT_ABI,
    signerOrProvider
  );
}

export function getRefundHandlerContract(
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.RefundHandler,
    REFUND_HANDLER_ABI,
    signerOrProvider
  );
}

export function getERC20Contract(
  tokenAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
}

