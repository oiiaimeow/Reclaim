import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Starting subscription monitoring...\n");

  const deploymentPath = "deployments/latest.json";
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const paymentManager = await ethers.getContractAt(
    "PaymentManager",
    deployment.PaymentManager
  );

  // Monitor events
  paymentManager.on("SubscriptionCreated", (id, subscriber, creator) => {
    console.log(`\n🆕 New Subscription Created:`);
    console.log(`  ID: ${id}`);
    console.log(`  Subscriber: ${subscriber}`);
    console.log(`  Creator: ${creator}`);
  });

  paymentManager.on("PaymentProcessed", (id, subscriber, creator, amount) => {
    console.log(`\n💰 Payment Processed:`);
    console.log(`  Subscription ID: ${id}`);
    console.log(`  Amount: ${ethers.formatEther(amount)} tokens`);
  });

  paymentManager.on("SubscriptionCancelled", (id, subscriber) => {
    console.log(`\n❌ Subscription Cancelled:`);
    console.log(`  ID: ${id}`);
    console.log(`  Subscriber: ${subscriber}`);
  });

  console.log("✅ Monitoring active. Press Ctrl+C to stop.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

