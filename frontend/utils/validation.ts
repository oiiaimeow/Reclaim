import { ethers } from 'ethers';

/**
 * Validates an Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Validates an amount string
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount.trim() === '') return false;
  
  try {
    const parsed = parseFloat(amount);
    return parsed > 0 && !isNaN(parsed) && isFinite(parsed);
  } catch {
    return false;
  }
};

/**
 * Validates subscription interval
 */
export const isValidInterval = (interval: string): boolean => {
  const validIntervals = ['daily', 'weekly', 'monthly', 'yearly'];
  return validIntervals.includes(interval.toLowerCase());
};

/**
 * Sanitizes user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validates transaction hash
 */
export const isValidTxHash = (hash: string): boolean => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if value is within range
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates hex string
 */
export const isValidHex = (hex: string): boolean => {
  return /^0x[0-9A-Fa-f]*$/.test(hex);
};

export default {
  isValidAddress,
  isValidAmount,
  isValidInterval,
  sanitizeInput,
  isValidTxHash,
  isValidEmail,
  isValidUrl,
  isInRange,
  isValidHex,
};
