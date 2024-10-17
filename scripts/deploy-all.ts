import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment of all Reclaim contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address))
  );
  console.log();

  // Deploy AccessControl
  console.log("Deploying ReclaimAccessControl...");
  const AccessControlFactory = await ethers.getContractFactory(
    "ReclaimAccessControl"
  );
  const accessControl = await AccessControlFactory.deploy(deployer.address);
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("ReclaimAccessControl deployed to:", accessControlAddress);
  console.log();

  // Deploy PriceOracle
  console.log("Deploying PriceOracle...");
  const PriceOracleFactory = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracleFactory.deploy();
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle deployed to:", priceOracleAddress);
  console.log();

  // Deploy SubscriptionVault
  console.log("Deploying SubscriptionVault...");
  const VaultFactory = await ethers.getContractFactory("SubscriptionVault");
  const vault = await VaultFactory.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("SubscriptionVault deployed to:", vaultAddress);
  console.log();

  // Deploy RefundHandler
  console.log("Deploying RefundHandler...");
  const RefundHandlerFactory = await ethers.getContractFactory(
    "RefundHandler"
  );
  const refundHandler = await RefundHandlerFactory.deploy();
  await refundHandler.waitForDeployment();
  const refundHandlerAddress = await refundHandler.getAddress();
  console.log("RefundHandler deployed to:", refundHandlerAddress);
  console.log();

  // Deploy PaymentManager
  console.log("Deploying PaymentManager...");
  const PaymentManagerFactory = await ethers.getContractFactory(
    "PaymentManager"
  );
  const paymentManager = await PaymentManagerFactory.deploy();
  await paymentManager.waitForDeployment();
  const paymentManagerAddress = await paymentManager.getAddress();
  console.log("PaymentManager deployed to:", paymentManagerAddress);
  console.log();

  // Deploy SubscriptionFactory
  console.log("Deploying SubscriptionFactory...");
  const deploymentFee = ethers.parseEther("0.01"); // 0.01 ETH
  const protocolFeePercentage = 250; // 2.5%
  const FactoryFactory = await ethers.getContractFactory(
    "SubscriptionFactory"
  );
  const factory = await FactoryFactory.deploy(
    deploymentFee,
    protocolFeePercentage
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("SubscriptionFactory deployed to:", factoryAddress);
  console.log();

  // Deploy MockUSDC (for testing)
  console.log("Deploying MockUSDC...");
  const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDCFactory.deploy("Mock USDC", "USDC");
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCAddress);
  console.log();

  // Setup authorizations
  console.log("Setting up authorizations...");
  await vault.setAuthorizedManager(paymentManagerAddress, true);
  console.log("PaymentManager authorized in SubscriptionVault");
  console.log();

  // Summary
  console.log("=== Deployment Summary ===");
  console.log("ReclaimAccessControl:", accessControlAddress);
  console.log("PriceOracle:", priceOracleAddress);
  console.log("SubscriptionVault:", vaultAddress);
  console.log("RefundHandler:", refundHandlerAddress);
  console.log("PaymentManager:", paymentManagerAddress);
  console.log("SubscriptionFactory:", factoryAddress);
  console.log("MockUSDC:", mockUSDCAddress);
  console.log();

  console.log("✅ All contracts deployed successfully!");

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    ReclaimAccessControl: accessControlAddress,
    PriceOracle: priceOracleAddress,
    SubscriptionVault: vaultAddress,
    RefundHandler: refundHandlerAddress,
    PaymentManager: paymentManagerAddress,
    SubscriptionFactory: factoryAddress,
    MockUSDC: mockUSDCAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployments/latest.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n📝 Deployment addresses saved to deployments/latest.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

