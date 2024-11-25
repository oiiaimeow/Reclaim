import { ethers } from 'ethers';

/**
 * Formats a BigInt amount to a readable string
 */
export const formatAmount = (
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string => {
  const formatted = ethers.formatUnits(amount, decimals);
  const parsed = parseFloat(formatted);
  return parsed.toFixed(displayDecimals);
};

/**
 * Formats an Ethereum address for display
 */
export const formatAddress = (
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address || address.length < prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Formats a timestamp to a date string
 */
export const formatDate = (
  timestamp: number,
  includeTime: boolean = false
): string => {
  const date = new Date(timestamp * 1000);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a number with thousands separators
 */
export const formatNumber = (
  num: number | string,
  decimals: number = 2
): string => {
  const parsed = typeof num === 'string' ? parseFloat(num) : num;
  return parsed.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats a large number with K, M, B suffixes
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Formats a percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats time duration in human-readable format
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Formats transaction hash for display
 */
export const formatTxHash = (hash: string): string => {
  return formatAddress(hash, 10, 8);
};

/**
 * Formats USD amount
 */
export const formatUSD = (amount: number, decimals: number = 2): string => {
  return `$${formatNumber(amount, decimals)}`;
};

/**
 * Formats a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export default {
  formatAmount,
  formatAddress,
  formatDate,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatDuration,
  formatTxHash,
  formatUSD,
  formatRelativeTime,
};
