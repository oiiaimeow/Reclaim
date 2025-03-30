import { run } from "hardhat";

async function main() {
  console.log("Verifying contracts on Etherscan...");

  const contracts = [
    {
      name: "MockUSDC",
      address: process.env.MOCK_USDC_ADDRESS || "",
      args: [],
    },
    {
      name: "PaymentManager",
      address: process.env.PAYMENT_MANAGER_ADDRESS || "",
      args: [],
    },
    {
      name: "SubscriptionVault",
      address: process.env.SUBSCRIPTION_VAULT_ADDRESS || "",
      args: [],
    },
    {
      name: "RefundHandler",
      address: process.env.REFUND_HANDLER_ADDRESS || "",
      args: [],
    },
  ];

  for (const contract of contracts) {
    if (!contract.address) {
      console.log(`Skipping ${contract.name} - no address provided`);
      continue;
    }

    try {
      console.log(`\nVerifying ${contract.name} at ${contract.address}...`);
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.args,
      });
      console.log(`${contract.name} verified successfully`);
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`${contract.name} is already verified`);
      } else {
        console.error(`Error verifying ${contract.name}:`, error.message);
      }
    }
  }

  console.log("\nVerification process completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


