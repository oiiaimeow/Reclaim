import { run } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Starting contract verification...\n");

  // Load deployment addresses
  const deploymentPath = "deployments/latest.json";
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const contracts = [
    {
      name: "ReclaimAccessControl",
      address: deployment.ReclaimAccessControl,
      constructorArguments: [deployment.deployer],
    },
    {
      name: "PriceOracle",
      address: deployment.PriceOracle,
      constructorArguments: [],
    },
    {
      name: "SubscriptionVault",
      address: deployment.SubscriptionVault,
      constructorArguments: [],
    },
    {
      name: "RefundHandler",
      address: deployment.RefundHandler,
      constructorArguments: [],
    },
    {
      name: "PaymentManager",
      address: deployment.PaymentManager,
      constructorArguments: [],
    },
    {
      name: "SubscriptionFactory",
      address: deployment.SubscriptionFactory,
      constructorArguments: ["10000000000000000", 250], // 0.01 ETH, 2.5%
    },
    {
      name: "MockUSDC",
      address: deployment.MockUSDC,
      constructorArguments: ["Mock USDC", "USDC"],
    },
  ];

  for (const contract of contracts) {
    try {
      console.log(`Verifying ${contract.name}...`);
      
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArguments,
      });

      console.log(`✅ ${contract.name} verified successfully\n`);
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`ℹ️  ${contract.name} already verified\n`);
      } else {
        console.error(`❌ Error verifying ${contract.name}:`, error.message);
        console.log();
      }
    }
  }

  console.log("Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

