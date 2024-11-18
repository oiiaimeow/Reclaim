import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Setting up roles and permissions...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment addresses
  const deploymentPath = "deployments/latest.json";
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  // Get contracts
  const accessControl = await ethers.getContractAt(
    "ReclaimAccessControl",
    deployment.ReclaimAccessControl
  );

  const vault = await ethers.getContractAt(
    "SubscriptionVault",
    deployment.SubscriptionVault
  );

  // Authorize PaymentManager in Vault
  console.log("Authorizing PaymentManager in SubscriptionVault...");
  await vault.setAuthorizedManager(deployment.PaymentManager, true);
  console.log("✅ PaymentManager authorized\n");

  // Grant roles (example addresses - replace with actual addresses)
  const MANAGER_ADDRESS = process.env.MANAGER_ADDRESS || deployer.address;
  const OPERATOR_ADDRESS = process.env.OPERATOR_ADDRESS || deployer.address;
  const PAUSER_ADDRESS = process.env.PAUSER_ADDRESS || deployer.address;

  console.log("Granting roles...");
  
  if (MANAGER_ADDRESS !== deployer.address) {
    await accessControl.grantManagerRole(MANAGER_ADDRESS);
    console.log(`✅ Manager role granted to ${MANAGER_ADDRESS}`);
  }

  if (OPERATOR_ADDRESS !== deployer.address) {
    await accessControl.grantOperatorRole(OPERATOR_ADDRESS);
    console.log(`✅ Operator role granted to ${OPERATOR_ADDRESS}`);
  }

  if (PAUSER_ADDRESS !== deployer.address) {
    await accessControl.grantPauserRole(PAUSER_ADDRESS);
    console.log(`✅ Pauser role granted to ${PAUSER_ADDRESS}`);
  }

  console.log("\n✅ Roles and permissions configured successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

