import { ethers } from 'ethers';

export function validateAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

export function validateAmount(amount: string, min: number = 0, max: number = Infinity): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > min && num <= max;
}

export function validateInterval(interval: number): boolean {
  const oneDay = 86400;
  return interval >= oneDay;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

