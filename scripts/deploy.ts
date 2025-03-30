import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy MockUSDC
  console.log("\n1. Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy PaymentManager
  console.log("\n2. Deploying PaymentManager...");
  const PaymentManager = await ethers.getContractFactory("PaymentManager");
  const paymentManager = await PaymentManager.deploy();
  await paymentManager.waitForDeployment();
  const paymentManagerAddress = await paymentManager.getAddress();
  console.log("PaymentManager deployed to:", paymentManagerAddress);

  // Deploy SubscriptionVault
  console.log("\n3. Deploying SubscriptionVault...");
  const SubscriptionVault = await ethers.getContractFactory("SubscriptionVault");
  const subscriptionVault = await SubscriptionVault.deploy();
  await subscriptionVault.waitForDeployment();
  const subscriptionVaultAddress = await subscriptionVault.getAddress();
  console.log("SubscriptionVault deployed to:", subscriptionVaultAddress);

  // Deploy RefundHandler
  console.log("\n4. Deploying RefundHandler...");
  const RefundHandler = await ethers.getContractFactory("RefundHandler");
  const refundHandler = await RefundHandler.deploy();
  await refundHandler.waitForDeployment();
  const refundHandlerAddress = await refundHandler.getAddress();
  console.log("RefundHandler deployed to:", refundHandlerAddress);

  // Authorize PaymentManager in SubscriptionVault
  console.log("\n5. Setting up permissions...");
  const authTx = await subscriptionVault.setAuthorizedManager(
    paymentManagerAddress,
    true
  );
  await authTx.wait();
  console.log("PaymentManager authorized in SubscriptionVault");

  console.log("\n=== Deployment Summary ===");
  console.log("MockUSDC:", mockUSDCAddress);
  console.log("PaymentManager:", paymentManagerAddress);
  console.log("SubscriptionVault:", subscriptionVaultAddress);
  console.log("RefundHandler:", refundHandlerAddress);
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


