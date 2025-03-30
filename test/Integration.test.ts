import { expect } from "chai";
import { ethers } from "hardhat";
import { PaymentManager, SubscriptionVault, RefundHandler, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Integration Tests", function () {
  let paymentManager: PaymentManager;
  let subscriptionVault: SubscriptionVault;
  let refundHandler: RefundHandler;
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let subscriber: SignerWithAddress;

  const SUBSCRIPTION_AMOUNT = ethers.parseUnits("10", 6);
  const SUBSCRIPTION_INTERVAL = 30 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, creator, subscriber] = await ethers.getSigners();

    // Deploy all contracts
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    const PaymentManager = await ethers.getContractFactory("PaymentManager");
    paymentManager = await PaymentManager.deploy();
    await paymentManager.waitForDeployment();

    const SubscriptionVault = await ethers.getContractFactory("SubscriptionVault");
    subscriptionVault = await SubscriptionVault.deploy();
    await subscriptionVault.waitForDeployment();

    const RefundHandler = await ethers.getContractFactory("RefundHandler");
    refundHandler = await RefundHandler.deploy();
    await refundHandler.waitForDeployment();

    // Setup permissions
    await subscriptionVault.setAuthorizedManager(
      await paymentManager.getAddress(),
      true
    );

    // Mint tokens to subscriber
    await mockUSDC.mint(subscriber.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(creator.address, ethers.parseUnits("1000", 6));
  });

  describe("Full Subscription Flow", function () {
    it("Should handle complete subscription lifecycle", async function () {
      // Approve payment manager
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT * 3n);

      // Create subscription
      const tx = await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      await tx.wait();

      // Verify subscription created
      const subscription = await paymentManager.getSubscription(0);
      expect(subscription.subscriber).to.equal(subscriber.address);
      expect(subscription.creator).to.equal(creator.address);
      expect(subscription.isActive).to.be.true;

      // Verify first payment
      const creatorBalance = await mockUSDC.balanceOf(creator.address);
      expect(creatorBalance).to.equal(
        ethers.parseUnits("1000", 6) + SUBSCRIPTION_AMOUNT
      );

      // Fast forward to next payment
      await time.increase(SUBSCRIPTION_INTERVAL);

      // Process next payment
      await paymentManager.connect(subscriber).processPayment(0);

      // Verify second payment
      const creatorBalanceAfter = await mockUSDC.balanceOf(creator.address);
      expect(creatorBalanceAfter).to.equal(
        ethers.parseUnits("1000", 6) + SUBSCRIPTION_AMOUNT * 2n
      );

      // Cancel subscription
      await paymentManager.connect(subscriber).cancelSubscription(0);

      // Verify cancellation
      const cancelledSubscription = await paymentManager.getSubscription(0);
      expect(cancelledSubscription.isActive).to.be.false;
    });

    it("Should handle vault deposits and withdrawals", async function () {
      const depositAmount = ethers.parseUnits("100", 6);

      // Approve vault
      await mockUSDC
        .connect(subscriber)
        .approve(await subscriptionVault.getAddress(), depositAmount);

      // Deposit
      await subscriptionVault
        .connect(subscriber)
        .deposit(await mockUSDC.getAddress(), depositAmount);

      // Check balance
      const balance = await subscriptionVault.getTotalBalance(
        subscriber.address,
        await mockUSDC.getAddress()
      );
      expect(balance).to.equal(depositAmount);

      // Withdraw
      const withdrawAmount = ethers.parseUnits("50", 6);
      await subscriptionVault
        .connect(subscriber)
        .withdraw(await mockUSDC.getAddress(), withdrawAmount);

      // Check final balance
      const finalBalance = await subscriptionVault.getTotalBalance(
        subscriber.address,
        await mockUSDC.getAddress()
      );
      expect(finalBalance).to.equal(depositAmount - withdrawAmount);
    });

    it("Should process refund request and approval", async function () {
      // Create subscription first
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT);

      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      const subscription = await paymentManager.getSubscription(0);

      // Request refund
      const refundTx = await refundHandler
        .connect(subscriber)
        .requestRefund(
          0,
          subscriber.address,
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          subscription.startTime
        );

      await refundTx.wait();

      // Approve refund from creator
      await mockUSDC
        .connect(creator)
        .approve(await refundHandler.getAddress(), SUBSCRIPTION_AMOUNT);

      const subscriberBalanceBefore = await mockUSDC.balanceOf(subscriber.address);

      await refundHandler.connect(creator).processRefund(0, true);

      // Verify refund processed
      const subscriberBalanceAfter = await mockUSDC.balanceOf(subscriber.address);
      expect(subscriberBalanceAfter - subscriberBalanceBefore).to.equal(
        SUBSCRIPTION_AMOUNT
      );

      const refundRequest = await refundHandler.getRefundRequest(0);
      expect(refundRequest.status).to.equal(3); // Processed
    });
  });

  describe("Multi-Creator Subscriptions", function () {
    it("Should handle multiple subscriptions from one subscriber", async function () {
      const [, creator1, creator2] = await ethers.getSigners();

      // Approve for multiple subscriptions
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT * 4n);

      // Create first subscription
      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator1.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      // Create second subscription
      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator2.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      // Verify subscriber has 2 subscriptions
      const subscriptions = await paymentManager.getSubscriberSubscriptions(
        subscriber.address
      );
      expect(subscriptions.length).to.equal(2);
    });

    it("Should track creator subscriptions correctly", async function () {
      const [, , subscriber2] = await ethers.getSigners();

      // Mint tokens to second subscriber
      await mockUSDC.mint(subscriber2.address, ethers.parseUnits("100", 6));

      // Approve for subscriptions
      await mockUSDC
        .connect(subscriber)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT);

      await mockUSDC
        .connect(subscriber2)
        .approve(await paymentManager.getAddress(), SUBSCRIPTION_AMOUNT);

      // Create subscriptions from different subscribers
      await paymentManager
        .connect(subscriber)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      await paymentManager
        .connect(subscriber2)
        .createSubscription(
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          SUBSCRIPTION_INTERVAL
        );

      // Verify creator has 2 subscribers
      const creatorSubs = await paymentManager.getCreatorSubscriptions(
        creator.address
      );
      expect(creatorSubs.length).to.equal(2);
    });
  });
});


