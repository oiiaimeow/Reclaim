import { ethers } from "hardhat";

export const SUBSCRIPTION_AMOUNTS = {
  SMALL: ethers.parseEther("10"),
  MEDIUM: ethers.parseEther("50"),
  LARGE: ethers.parseEther("100"),
};

export const SUBSCRIPTION_INTERVALS = {
  DAILY: 86400,
  WEEKLY: 604800,
  MONTHLY: 2592000,
  YEARLY: 31536000,
};

export async function deployTestContracts() {
  const [owner, creator, subscriber] = await ethers.getSigners();

  const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDCFactory.deploy("Mock USDC", "USDC");

  const PaymentManagerFactory = await ethers.getContractFactory("PaymentManager");
  const paymentManager = await PaymentManagerFactory.deploy();

  const VaultFactory = await ethers.getContractFactory("SubscriptionVault");
  const vault = await VaultFactory.deploy();

  return { owner, creator, subscriber, usdc, paymentManager, vault };
}

export async function createTestSubscription(
  paymentManager: any,
  creator: string,
  token: string,
  subscriber: any
) {
  const amount = SUBSCRIPTION_AMOUNTS.MEDIUM;
  const interval = SUBSCRIPTION_INTERVALS.MONTHLY;

  const tx = await paymentManager
    .connect(subscriber)
    .createSubscription(creator, token, amount, interval);
    
  const receipt = await tx.wait();
  return receipt;
}

