import { ethers, Contract } from 'ethers';
import PaymentManagerABI from '../lib/abis/PaymentManager.json';
import SubscriptionVaultABI from '../lib/abis/SubscriptionVault.json';
import RefundHandlerABI from '../lib/abis/RefundHandler.json';

// Contract addresses (to be configured per network)
export const CONTRACT_ADDRESSES = {
  PaymentManager: process.env.NEXT_PUBLIC_PAYMENT_MANAGER_ADDRESS || '',
  SubscriptionVault: process.env.NEXT_PUBLIC_SUBSCRIPTION_VAULT_ADDRESS || '',
  RefundHandler: process.env.NEXT_PUBLIC_REFUND_HANDLER_ADDRESS || '',
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '',
};

/**
 * Gets a contract instance with a signer
 */
export const getContract = (
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
): Contract => {
  return new Contract(address, abi, signerOrProvider);
};

/**
 * Gets PaymentManager contract instance
 */
export const getPaymentManagerContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): Contract => {
  return getContract(
    CONTRACT_ADDRESSES.PaymentManager,
    PaymentManagerABI,
    signerOrProvider
  );
};

/**
 * Gets SubscriptionVault contract instance
 */
export const getSubscriptionVaultContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): Contract => {
  return getContract(
    CONTRACT_ADDRESSES.SubscriptionVault,
    SubscriptionVaultABI,
    signerOrProvider
  );
};

/**
 * Gets RefundHandler contract instance
 */
export const getRefundHandlerContract = (
  signerOrProvider: ethers.Signer | ethers.Provider
): Contract => {
  return getContract(
    CONTRACT_ADDRESSES.RefundHandler,
    RefundHandlerABI,
    signerOrProvider
  );
};

/**
 * Creates a new subscription
 */
export const createSubscription = async (
  signer: ethers.Signer,
  creator: string,
  paymentToken: string,
  amount: bigint,
  interval: number
): Promise<ethers.ContractTransaction> => {
  const contract = getPaymentManagerContract(signer);
  return await contract.createSubscription(creator, paymentToken, amount, interval);
};

/**
 * Cancels a subscription
 */
export const cancelSubscription = async (
  signer: ethers.Signer,
  subscriptionId: number
): Promise<ethers.ContractTransaction> => {
  const contract = getPaymentManagerContract(signer);
  return await contract.cancelSubscription(subscriptionId);
};

/**
 * Gets subscription details
 */
export const getSubscription = async (
  provider: ethers.Provider,
  subscriptionId: number
): Promise<any> => {
  const contract = getPaymentManagerContract(provider);
  return await contract.getSubscription(subscriptionId);
};

/**
 * Gets all subscriptions for a creator
 */
export const getCreatorSubscriptions = async (
  provider: ethers.Provider,
  creatorAddress: string
): Promise<number[]> => {
  const contract = getPaymentManagerContract(provider);
  return await contract.getCreatorSubscriptions(creatorAddress);
};

/**
 * Gets all subscriptions for a subscriber
 */
export const getSubscriberSubscriptions = async (
  provider: ethers.Provider,
  subscriberAddress: string
): Promise<number[]> => {
  const contract = getPaymentManagerContract(provider);
  return await contract.getSubscriberSubscriptions(subscriberAddress);
};

/**
 * Processes a recurring payment
 */
export const processPayment = async (
  signer: ethers.Signer,
  subscriptionId: number
): Promise<ethers.ContractTransaction> => {
  const contract = getPaymentManagerContract(signer);
  return await contract.processPayment(subscriptionId);
};

/**
 * Requests a refund
 */
export const requestRefund = async (
  signer: ethers.Signer,
  subscriptionId: number,
  subscriber: string,
  creator: string,
  token: string,
  amount: bigint,
  startTime: number
): Promise<ethers.ContractTransaction> => {
  const contract = getRefundHandlerContract(signer);
  return await contract.requestRefund(
    subscriptionId,
    subscriber,
    creator,
    token,
    amount,
    startTime
  );
};

/**
 * Approves a token spending
 */
export const approveToken = async (
  signer: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string,
  amount: bigint
): Promise<ethers.ContractTransaction> => {
  const tokenABI = [
    'function approve(address spender, uint256 amount) returns (bool)',
  ];
  const contract = new Contract(tokenAddress, tokenABI, signer);
  return await contract.approve(spenderAddress, amount);
};

/**
 * Gets token balance
 */
export const getTokenBalance = async (
  provider: ethers.Provider,
  tokenAddress: string,
  userAddress: string
): Promise<bigint> => {
  const tokenABI = ['function balanceOf(address) view returns (uint256)'];
  const contract = new Contract(tokenAddress, tokenABI, provider);
  return await contract.balanceOf(userAddress);
};

/**
 * Formats interval seconds to human readable string
 */
export const formatInterval = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  if (days === 30) return 'Monthly';
  if (days === 7) return 'Weekly';
  if (days === 1) return 'Daily';
  if (days === 365) return 'Yearly';
  return `Every ${days} days`;
};

/**
 * Parses interval string to seconds
 */
export const parseInterval = (interval: string): number => {
  switch (interval.toLowerCase()) {
    case 'daily':
      return 86400;
    case 'weekly':
      return 604800;
    case 'monthly':
      return 2592000; // 30 days
    case 'yearly':
      return 31536000; // 365 days
    default:
      return 2592000; // Default to monthly
  }
};

/**
 * Shortens an Ethereum address
 */
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Formats timestamp to date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculates days until next payment
 */
export const getDaysUntilPayment = (nextPaymentTimestamp: number): number => {
  const now = Math.floor(Date.now() / 1000);
  const diff = nextPaymentTimestamp - now;
  return Math.max(0, Math.floor(diff / 86400));
};

/**
 * Checks if payment is due
 */
export const isPaymentDue = (nextPaymentTimestamp: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return now >= nextPaymentTimestamp;
};

export default {
  getPaymentManagerContract,
  getSubscriptionVaultContract,
  getRefundHandlerContract,
  createSubscription,
  cancelSubscription,
  getSubscription,
  getCreatorSubscriptions,
  getSubscriberSubscriptions,
  processPayment,
  requestRefund,
  approveToken,
  getTokenBalance,
  formatInterval,
  parseInterval,
  shortenAddress,
  formatDate,
  getDaysUntilPayment,
  isPaymentDue,
};

