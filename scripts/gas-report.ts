import { ethers } from "hardhat";

async function main() {
  console.log("Generating gas usage report...\n");

  const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
  const deployTx = await MockUSDCFactory.getDeployTransaction("Mock USDC", "USDC");
  console.log("MockUSDC deployment gas:", deployTx.data?.length);

  console.log("\n✅ Gas report generated");
}

main().catch(console.error);

