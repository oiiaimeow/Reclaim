import { expect } from "chai";
import { ethers } from "hardhat";
import { PaymentManager, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";

describe("PaymentManager", function () {
  let paymentManager: PaymentManager;
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let subscriber: SignerWithAddress;

  const SUBSCRIPTION_AMOUNT = ethers.parseUnits("10", 6); // 10 USDC
  const SUBSCRIPTION_INTERVAL = 30 * 24 * 60 * 60; // 30 days in seconds

  beforeEach(async function () {
    [owner, creator, subscriber] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy PaymentManager
    const PaymentManager = await ethers.getContractFactory("PaymentManager");
    paymentManager = await PaymentManager.deploy();
    await paymentManager.waitForDeployment();

    // Mint tokens to subscriber
    await mockUSDC.mint(subscriber.address, ethers.parseUnits("1000", 6));
  });

  describe("Subscription Creation", function () {
    it("Should create a new subscription successfully", async function () {
      // Approve PaymentManager to spend tokens
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT * 2n);

      // Create subscription
      const tx = await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      const receipt = await tx.wait();
      expect(receipt).to.not.be.null;

      // Verify subscription details
      const subscription = await paymentManager.getSubscription(0);
      expect(subscription.subscriber).to.equal(subscriber.address);
      expect(subscription.creator).to.equal(creator.address);
      expect(subscription.amount).to.equal(SUBSCRIPTION_AMOUNT);
      expect(subscription.isActive).to.be.true;
    });

    it("Should revert with invalid creator address", async function () {
      await expect(
        paymentManager
          .connect(subscriber)
          .createSubscription(
            ethers.ZeroAddress,
            await mockUSDC.getAddress(),
            SUBSCRIPTION_AMOUNT,
            SUBSCRIPTION_INTERVAL
          )
      ).to.be.revertedWith("Invalid creator address");
    });

    it("Should revert with zero amount", async function () {
      await expect(
        paymentManager
          .connect(subscriber)
          .createSubscription(
            creator.address,
            await mockUSDC.getAddress(),
            0,
            SUBSCRIPTION_INTERVAL
          )
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should transfer first payment to creator", async function () {
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT);

      const creatorBalanceBefore = await mockUSDC.balanceOf(creator.address);

      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      const creatorBalanceAfter = await mockUSDC.balanceOf(creator.address);
      expect(creatorBalanceAfter - creatorBalanceBefore).to.equal(
        SUBSCRIPTION_AMOUNT
      );
    });
  });

  describe("Subscription Cancellation", function () {
    let subscriptionId: number;

    beforeEach(async function () {
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT);

      const tx = await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      await tx.wait();
      subscriptionId = 0;
    });

    it("Should allow subscriber to cancel subscription", async function () {
      await paymentManager.connect(subscriber).cancelSubscription(subscriptionId);

      const subscription = await paymentManager.getSubscription(subscriptionId);
      expect(subscription.isActive).to.be.false;
    });

    it("Should allow creator to cancel subscription", async function () {
      await paymentManager.connect(creator).cancelSubscription(subscriptionId);

      const subscription = await paymentManager.getSubscription(subscriptionId);
      expect(subscription.isActive).to.be.false;
    });

    it("Should revert if unauthorized user tries to cancel", async function () {
      const [, , , unauthorized] = await ethers.getSigners();

      await expect(
        paymentManager.connect(unauthorized).cancelSubscription(subscriptionId)
      ).to.be.revertedWith("Only subscriber or creator can cancel");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT * 3n);

      // Create multiple subscriptions
      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );
    });

    it("Should return creator subscriptions", async function () {
      const subscriptions = await paymentManager.getCreatorSubscriptions(
        creator.address
      );
      expect(subscriptions.length).to.equal(2);
    });

    it("Should return subscriber subscriptions", async function () {
      const subscriptions = await paymentManager.getSubscriberSubscriptions(
        subscriber.address
      );
      expect(subscriptions.length).to.equal(2);
    });
  });
});


