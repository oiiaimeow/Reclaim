import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking balances for:", deployer.address);
  
  const ethBalance = await ethers.provider.getBalance(deployer.address);
  console.log("ETH Balance:", ethers.formatEther(ethBalance));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

