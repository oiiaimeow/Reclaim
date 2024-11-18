import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Setting up price oracle...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment addresses
  const deploymentPath = "deployments/latest.json";
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const priceOracle = await ethers.getContractAt(
    "PriceOracle",
    deployment.PriceOracle
  );

  // Token addresses (replace with actual addresses for your network)
  const USDC_ADDRESS = deployment.MockUSDC;
  const USDT_ADDRESS = process.env.USDT_ADDRESS || deployment.MockUSDC;
  const DAI_ADDRESS = process.env.DAI_ADDRESS || deployment.MockUSDC;

  console.log("Setting up token pair prices...\n");

  // USDC/USDT - 1:1
  console.log("Setting USDC/USDT price (1:1)...");
  await priceOracle.updatePrice(
    USDC_ADDRESS,
    USDT_ADDRESS,
    ethers.parseEther("1")
  );
  console.log("✅ USDC/USDT price set");

  // USDC/DAI - 1:1
  console.log("Setting USDC/DAI price (1:1)...");
  await priceOracle.updatePrice(
    USDC_ADDRESS,
    DAI_ADDRESS,
    ethers.parseEther("1")
  );
  console.log("✅ USDC/DAI price set");

  // ETH/USDC - Example: 2000 USDC per ETH
  const ETH_ADDRESS = "0x0000000000000000000000000000000000000000"; // Native ETH placeholder
  console.log("Setting ETH/USDC price (2000 USDC per ETH)...");
  await priceOracle.updatePrice(
    ETH_ADDRESS,
    USDC_ADDRESS,
    ethers.parseEther("2000")
  );
  console.log("✅ ETH/USDC price set");

  console.log("\n✅ Price oracle configured successfully!");
  console.log("\nNote: Remember to update these prices regularly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

