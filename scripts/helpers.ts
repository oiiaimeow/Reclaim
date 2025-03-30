import { ethers } from "ethers";

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: bigint, decimals: number = 6): string {
  return ethers.formatUnits(amount, decimals);
}

export function parseAmount(amount: string, decimals: number = 6): bigint {
  return ethers.parseUnits(amount, decimals);
}

export async function waitForTransaction(tx: any, confirmations: number = 2) {
  console.log(`Transaction sent: ${tx.hash}`);
  console.log(`Waiting for ${confirmations} confirmations...`);
  const receipt = await tx.wait(confirmations);
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  return receipt;
}


