import { ethers } from "hardhat";

/**
 * Example script to interact with deployed contracts
 * Update addresses and parameters before running
 */

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", signer.address);

  // Contract addresses (update these after deployment)
  const PAYMENT_MANAGER_ADDRESS = process.env.PAYMENT_MANAGER_ADDRESS || "";
  const MOCK_USDC_ADDRESS = process.env.MOCK_USDC_ADDRESS || "";

  if (!PAYMENT_MANAGER_ADDRESS || !MOCK_USDC_ADDRESS) {
    throw new Error("Contract addresses not configured");
  }

  // Get contract instances
  const PaymentManager = await ethers.getContractFactory("PaymentManager");
  const paymentManager = PaymentManager.attach(PAYMENT_MANAGER_ADDRESS);

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = MockUSDC.attach(MOCK_USDC_ADDRESS);

  console.log("\n=== Contract Information ===");
  console.log("PaymentManager:", await paymentManager.getAddress());
  console.log("MockUSDC:", await mockUSDC.getAddress());

  // Example 1: Check USDC balance
  const balance = await mockUSDC.balanceOf(signer.address);
  console.log("\n=== USDC Balance ===");
  console.log("Balance:", ethers.formatUnits(balance, 6), "USDC");

  // Example 2: Mint USDC (if needed)
  if (balance < ethers.parseUnits("100", 6)) {
    console.log("\n=== Minting USDC ===");
    const mintAmount = ethers.parseUnits("1000", 6);
    const mintTx = await mockUSDC.faucet(mintAmount);
    await mintTx.wait();
    console.log("Minted 1000 USDC");
  }

  // Example 3: Get user's subscriptions
  console.log("\n=== Your Subscriptions ===");
  const subscriptions = await paymentManager.getSubscriberSubscriptions(
    signer.address
  );
  console.log("Number of subscriptions:", subscriptions.length);

  for (const subId of subscriptions) {
    const sub = await paymentManager.getSubscription(subId);
    console.log(`\nSubscription #${subId}:`);
    console.log("  Creator:", sub.creator);
    console.log("  Amount:", ethers.formatUnits(sub.amount, 6), "USDC");
    console.log("  Active:", sub.isActive);
  }

  // Example 4: Create a subscription (commented out for safety)
  /*
  console.log("\n=== Creating Subscription ===");
  const creatorAddress = "0x..."; // Update with actual creator address
  const subscriptionAmount = ethers.parseUnits("10", 6); // 10 USDC
  const subscriptionInterval = 30 * 24 * 60 * 60; // 30 days

  // Approve USDC spending
  const approveTx = await mockUSDC.approve(
    await paymentManager.getAddress(),
    subscriptionAmount * 2n
  );
  await approveTx.wait();
  console.log("Approved USDC spending");

  // Create subscription
  const createTx = await paymentManager.createSubscription(
    creatorAddress,
    await mockUSDC.getAddress(),
    subscriptionAmount,
    subscriptionInterval
  );
  const receipt = await createTx.wait();
  console.log("Subscription created!");
  console.log("Transaction hash:", receipt.hash);
  */

  console.log("\nInteraction script completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


