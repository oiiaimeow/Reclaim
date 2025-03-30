import { expect } from "chai";
import { ethers } from "hardhat";
import { RefundHandler, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("RefundHandler", function () {
  let refundHandler: RefundHandler;
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let subscriber: SignerWithAddress;

  const SUBSCRIPTION_AMOUNT = ethers.parseUnits("10", 6); // 10 USDC
  const SUBSCRIPTION_ID = 1;

  beforeEach(async function () {
    [owner, creator, subscriber] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy RefundHandler
    const RefundHandler = await ethers.getContractFactory("RefundHandler");
    refundHandler = await RefundHandler.deploy();
    await refundHandler.waitForDeployment();

    // Mint tokens to creator for refunds
    await mockUSDC.mint(creator.address, ethers.parseUnits("1000", 6));
  });

  describe("Refund Policy Management", function () {
    it("Should have default refund policy", async function () {
      const policy = await refundHandler.defaultRefundPolicy();
      expect(policy.refundWindowDays).to.equal(7);
      expect(policy.refundPercentage).to.equal(100);
      expect(policy.isActive).to.be.true;
    });

    it("Should allow owner to update default policy", async function () {
      await refundHandler.setDefaultRefundPolicy(14, 80);

      const policy = await refundHandler.defaultRefundPolicy();
      expect(policy.refundWindowDays).to.equal(14);
      expect(policy.refundPercentage).to.equal(80);
    });

    it("Should revert if percentage exceeds 100", async function () {
      await expect(
        refundHandler.setDefaultRefundPolicy(7, 150)
      ).to.be.revertedWith("Percentage must be <= 100");
    });

    it("Should allow creators to set custom policy", async function () {
      await refundHandler.connect(creator).setCreatorRefundPolicy(30, 50);

      const policy = await refundHandler.getRefundPolicy(creator.address);
      expect(policy.refundWindowDays).to.equal(30);
      expect(policy.refundPercentage).to.equal(50);
    });

    it("Should emit RefundPolicyUpdated event", async function () {
      await expect(refundHandler.connect(creator).setCreatorRefundPolicy(30, 50))
        .to.emit(refundHandler, "RefundPolicyUpdated")
        .withArgs(creator.address, 30, 50);
    });
  });

  describe("Refund Requests", function () {
    let subscriptionStartTime: number;

    beforeEach(async function () {
      subscriptionStartTime = await time.latest();
    });

    it("Should create refund request within window", async function () {
      const tx = await refundHandler
        .connect(subscriber)
        .requestRefund(
          SUBSCRIPTION_ID,
          subscriber.address,
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          subscriptionStartTime
        );

      const receipt = await tx.wait();
      expect(receipt).to.not.be.null;

      const refundRequest = await refundHandler.getRefundRequest(0);
      expect(refundRequest.subscriber).to.equal(subscriber.address);
      expect(refundRequest.creator).to.equal(creator.address);
      expect(refundRequest.amount).to.equal(SUBSCRIPTION_AMOUNT);
    });

    it("Should calculate refund amount based on policy", async function () {
      // Set creator policy to 50% refund
      await refundHandler.connect(creator).setCreatorRefundPolicy(7, 50);

      await refundHandler
        .connect(subscriber)
        .requestRefund(
          SUBSCRIPTION_ID,
          subscriber.address,
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          subscriptionStartTime
        );

      const refundRequest = await refundHandler.getRefundRequest(0);
      expect(refundRequest.amount).to.equal(SUBSCRIPTION_AMOUNT / 2n);
    });

    it("Should revert if refund window expired", async function () {
      // Fast forward 8 days (beyond 7-day default window)
      await time.increase(8 * 24 * 60 * 60);

      await expect(
        refundHandler
          .connect(subscriber)
          .requestRefund(
            SUBSCRIPTION_ID,
            subscriber.address,
            creator.address,
            await mockUSDC.getAddress(),
            SUBSCRIPTION_AMOUNT,
            subscriptionStartTime
          )
      ).to.be.revertedWith("Refund window expired");
    });

    it("Should revert if refund already requested", async function () {
      await refundHandler
        .connect(subscriber)
        .requestRefund(
          SUBSCRIPTION_ID,
          subscriber.address,
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          subscriptionStartTime
        );

      await expect(
        refundHandler
          .connect(subscriber)
          .requestRefund(
            SUBSCRIPTION_ID,
            subscriber.address,
            creator.address,
            await mockUSDC.getAddress(),
            SUBSCRIPTION_AMOUNT,
            subscriptionStartTime
          )
      ).to.be.revertedWith("Refund already requested");
    });

    it("Should revert if not subscriber", async function () {
      const [, , , unauthorized] = await ethers.getSigners();

      await expect(
        refundHandler
          .connect(unauthorized)
          .requestRefund(
            SUBSCRIPTION_ID,
            subscriber.address,
            creator.address,
            await mockUSDC.getAddress(),
            SUBSCRIPTION_AMOUNT,
            subscriptionStartTime
          )
      ).to.be.revertedWith("Only subscriber can request refund");
    });

    it("Should emit RefundRequested event", async function () {
      await expect(
        refundHandler
          .connect(subscriber)
          .requestRefund(
            SUBSCRIPTION_ID,
            subscriber.address,
            creator.address,
            await mockUSDC.getAddress(),
            SUBSCRIPTION_AMOUNT,
            subscriptionStartTime
          )
      ).to.emit(refundHandler, "RefundRequested");
    });
  });

  describe("Refund Processing", function () {
    let refundId: number;
    let subscriptionStartTime: number;

    beforeEach(async function () {
      subscriptionStartTime = await time.latest();
      const tx = await refundHandler
        .connect(subscriber)
        .requestRefund(
          SUBSCRIPTION_ID,
          subscriber.address,
          creator.address,
          await mockUSDC.getAddress(),
          SUBSCRIPTION_AMOUNT,
          subscriptionStartTime
        );

      await tx.wait();
      refundId = 0;

      // Approve refund handler to spend creator's tokens
      await mockUSDC
        .connect(creator)
        .approve(await refundHandler.getAddress(), SUBSCRIPTION_AMOUNT);
    });

    it("Should allow creator to approve refund", async function () {
      const subscriberBalanceBefore = await mockUSDC.balanceOf(subscriber.address);

      await refundHandler.connect(creator).processRefund(refundId, true);

      const subscriberBalanceAfter = await mockUSDC.balanceOf(subscriber.address);
      expect(subscriberBalanceAfter - subscriberBalanceBefore).to.equal(
        SUBSCRIPTION_AMOUNT
      );

      const refundRequest = await refundHandler.getRefundRequest(refundId);
      expect(refundRequest.status).to.equal(3); // Processed
    });

    it("Should allow creator to reject refund", async function () {
      await refundHandler.connect(creator).processRefund(refundId, false);

      const refundRequest = await refundHandler.getRefundRequest(refundId);
      expect(refundRequest.status).to.equal(2); // Rejected
    });

    it("Should allow owner to process refund", async function () {
      await refundHandler.connect(owner).processRefund(refundId, true);

      const refundRequest = await refundHandler.getRefundRequest(refundId);
      expect(refundRequest.status).to.equal(3); // Processed
    });

    it("Should revert if unauthorized tries to process", async function () {
      const [, , , unauthorized] = await ethers.getSigners();

      await expect(
        refundHandler.connect(unauthorized).processRefund(refundId, true)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should revert if already processed", async function () {
      await refundHandler.connect(creator).processRefund(refundId, true);

      await expect(
        refundHandler.connect(creator).processRefund(refundId, true)
      ).to.be.revertedWith("Already processed");
    });

    it("Should emit RefundProcessed event", async function () {
      await expect(refundHandler.connect(creator).processRefund(refundId, true))
        .to.emit(refundHandler, "RefundProcessed");
    });
  });

  describe("View Functions", function () {
    it("Should calculate refund amount correctly", async function () {
      await refundHandler.connect(creator).setCreatorRefundPolicy(7, 75);

      const refundAmount = await refundHandler.calculateRefundAmount(
        creator.address,
        SUBSCRIPTION_AMOUNT
      );

      expect(refundAmount).to.equal((SUBSCRIPTION_AMOUNT * 75n) / 100n);
    });

    it("Should use default policy if creator has none", async function () {
      const refundAmount = await refundHandler.calculateRefundAmount(
        creator.address,
        SUBSCRIPTION_AMOUNT
      );

      expect(refundAmount).to.equal(SUBSCRIPTION_AMOUNT); // 100% default
    });
  });
});


