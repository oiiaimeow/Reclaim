import { expect } from "chai";
import { ethers } from "hardhat";
import { SubscriptionFactory, PaymentManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SubscriptionFactory", function () {
  let factory: SubscriptionFactory;
  let owner: SignerWithAddress;
  let creator1: SignerWithAddress;
  let creator2: SignerWithAddress;
  let user: SignerWithAddress;

  const deploymentFee = ethers.parseEther("0.01");
  const protocolFeePercentage = 250; // 2.5%

  beforeEach(async function () {
    [owner, creator1, creator2, user] = await ethers.getSigners();

    const FactoryFactory = await ethers.getContractFactory(
      "SubscriptionFactory"
    );
    factory = await FactoryFactory.deploy(
      deploymentFee,
      protocolFeePercentage
    );
    await factory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct deployment fee", async function () {
      expect(await factory.deploymentFee()).to.equal(deploymentFee);
    });

    it("Should set correct protocol fee percentage", async function () {
      expect(await factory.protocolFeePercentage()).to.equal(
        protocolFeePercentage
      );
    });

    it("Should set correct owner", async function () {
      expect(await factory.owner()).to.equal(owner.address);
    });
  });

  describe("Payment Manager Deployment", function () {
    it("Should deploy payment manager with correct fee", async function () {
      await expect(
        factory.connect(creator1).deployPaymentManager({
          value: deploymentFee,
        })
      ).to.emit(factory, "ManagerDeployed");
    });

    it("Should reject deployment with insufficient fee", async function () {
      await expect(
        factory.connect(creator1).deployPaymentManager({
          value: ethers.parseEther("0.005"),
        })
      ).to.be.revertedWith("Insufficient deployment fee");
    });

    it("Should transfer ownership to creator", async function () {
      const tx = await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
      const receipt = await tx.wait();

      const event = receipt?.logs.find(
        (log: any) =>
          factory.interface.parseLog(log)?.name === "ManagerDeployed"
      );
      const parsedEvent = factory.interface.parseLog(event!);
      const managerAddress = parsedEvent?.args[1];

      const PaymentManagerFactory = await ethers.getContractFactory(
        "PaymentManager"
      );
      const manager = PaymentManagerFactory.attach(
        managerAddress
      ) as PaymentManager;

      expect(await manager.owner()).to.equal(creator1.address);
    });

    it("Should refund excess payment", async function () {
      const excessAmount = ethers.parseEther("0.02");
      const balanceBefore = await ethers.provider.getBalance(creator1.address);

      const tx = await factory.connect(creator1).deployPaymentManager({
        value: excessAmount,
      });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(creator1.address);
      const expectedBalance = balanceBefore - deploymentFee - gasUsed;

      // Allow small difference due to gas estimation
      expect(balanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
    });

    it("Should track deployed managers", async function () {
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });

      const managers = await factory.getCreatorManagers(creator1.address);
      expect(managers.length).to.equal(2);
    });

    it("Should track total manager count", async function () {
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
      await factory.connect(creator2).deployPaymentManager({
        value: deploymentFee,
      });

      expect(await factory.getManagerCount()).to.equal(2);
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to update deployment fee", async function () {
      const newFee = ethers.parseEther("0.02");
      await factory.setDeploymentFee(newFee);
      expect(await factory.deploymentFee()).to.equal(newFee);
    });

    it("Should only allow owner to update deployment fee", async function () {
      await expect(
        factory.connect(creator1).setDeploymentFee(ethers.parseEther("0.02"))
      ).to.be.reverted;
    });

    it("Should allow owner to update protocol fee", async function () {
      const newPercentage = 500; // 5%
      await factory.setProtocolFeePercentage(newPercentage);
      expect(await factory.protocolFeePercentage()).to.equal(newPercentage);
    });

    it("Should reject protocol fee above 10%", async function () {
      await expect(factory.setProtocolFeePercentage(1001)).to.be.revertedWith(
        "Fee cannot exceed 10%"
      );
    });

    it("Should only allow owner to update protocol fee", async function () {
      await expect(
        factory.connect(creator1).setProtocolFeePercentage(500)
      ).to.be.reverted;
    });
  });

  describe("Fee Withdrawal", function () {
    beforeEach(async function () {
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
      await factory.connect(creator2).deployPaymentManager({
        value: deploymentFee,
      });
    });

    it("Should allow owner to withdraw fees", async function () {
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const factoryBalance = await ethers.provider.getBalance(
        await factory.getAddress()
      );

      const tx = await factory.withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);
      const expectedBalance = balanceBefore + factoryBalance - gasUsed;

      expect(balanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
    });

    it("Should only allow owner to withdraw fees", async function () {
      await expect(factory.connect(creator1).withdrawFees()).to.be.reverted;
    });

    it("Should reject withdrawal with no fees", async function () {
      await factory.withdrawFees(); // Withdraw all fees

      await expect(factory.withdrawFees()).to.be.revertedWith(
        "No fees to withdraw"
      );
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
      await factory.connect(creator2).deployPaymentManager({
        value: deploymentFee,
      });
      await factory.connect(creator1).deployPaymentManager({
        value: deploymentFee,
      });
    });

    it("Should return all managers", async function () {
      const allManagers = await factory.getAllManagers();
      expect(allManagers.length).to.equal(3);
    });

    it("Should return managers for specific creator", async function () {
      const creator1Managers = await factory.getCreatorManagers(
        creator1.address
      );
      const creator2Managers = await factory.getCreatorManagers(
        creator2.address
      );

      expect(creator1Managers.length).to.equal(2);
      expect(creator2Managers.length).to.equal(1);
    });

    it("Should return correct manager count", async function () {
      expect(await factory.getManagerCount()).to.equal(3);
    });

    it("Should return empty array for creator with no managers", async function () {
      const managers = await factory.getCreatorManagers(user.address);
      expect(managers.length).to.equal(0);
    });
  });

  describe("Events", function () {
    it("Should emit ManagerDeployed event", async function () {
      await expect(
        factory.connect(creator1).deployPaymentManager({
          value: deploymentFee,
        })
      )
        .to.emit(factory, "ManagerDeployed")
        .withArgs(
          creator1.address,
          await ethers.provider.getBlockNumber().then(() => true), // manager address
          await ethers.provider.getBlockNumber().then(() => true) // timestamp
        );
    });

    it("Should emit DeploymentFeeUpdated event", async function () {
      const newFee = ethers.parseEther("0.02");
      await expect(factory.setDeploymentFee(newFee))
        .to.emit(factory, "DeploymentFeeUpdated")
        .withArgs(newFee);
    });

    it("Should emit ProtocolFeeUpdated event", async function () {
      const newPercentage = 500;
      await expect(factory.setProtocolFeePercentage(newPercentage))
        .to.emit(factory, "ProtocolFeeUpdated")
        .withArgs(newPercentage);
    });
  });
});

