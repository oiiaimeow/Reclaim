import { ethers } from 'ethers';

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number = 6
): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse token amount to BigInt
 */
export function parseTokenAmount(
  amount: string,
  decimals: number = 6
): bigint {
  return ethers.parseUnits(amount, decimals);
}

/**
 * Format wallet address to shortened version
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number | bigint): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format timestamp to readable date and time
 */
export function formatDateTime(timestamp: number | bigint): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate time remaining until next payment
 */
export function getTimeUntilNextPayment(
  nextPaymentTimestamp: number
): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = nextPaymentTimestamp - now;

  if (diff <= 0) return 'Due now';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Format subscription interval to human-readable text
 */
export function formatInterval(intervalSeconds: number): string {
  const days = intervalSeconds / 86400;
  const weeks = days / 7;
  const months = days / 30;

  if (months >= 1 && days % 30 === 0) {
    return months === 1 ? 'Monthly' : `Every ${Math.floor(months)} months`;
  }
  if (weeks >= 1 && days % 7 === 0) {
    return weeks === 1 ? 'Weekly' : `Every ${Math.floor(weeks)} weeks`;
  }
  return days === 1 ? 'Daily' : `Every ${Math.floor(days)} days`;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number | string,
  currency: string = 'USD'
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

