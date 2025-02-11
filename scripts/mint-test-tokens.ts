import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting test tokens with:", deployer.address);

  const deploymentPath = "deployments/latest.json";
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const usdc = await ethers.getContractAt("MockUSDC", deployment.MockUSDC);

  const amount = ethers.parseEther("10000");
  await usdc.mint(deployer.address, amount);

  console.log(`✅ Minted ${ethers.formatEther(amount)} USDC`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

