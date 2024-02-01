import { expect } from "chai";
import { ethers } from "hardhat";
import { SubscriptionVault, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";

describe("SubscriptionVault", function () {
  let vault: SubscriptionVault;
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let manager: SignerWithAddress;

  const DEPOSIT_AMOUNT = ethers.parseUnits("100", 6); // 100 USDC

  beforeEach(async function () {
    [owner, user, manager] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy SubscriptionVault
    const SubscriptionVault = await ethers.getContractFactory("SubscriptionVault");
    vault = await SubscriptionVault.deploy();
    await vault.waitForDeployment();

    // Mint tokens to user
    await mockUSDC.mint(user.address, ethers.parseUnits("1000", 6));
  });

  describe("Deposits", function () {
    it("Should allow users to deposit tokens", async function () {
      await mockUSDC
        .connect(user)
        .approve(await vault.getAddress(), DEPOSIT_AMOUNT);

      await vault
        .connect(user)
        .deposit(await mockUSDC.getAddress(), DEPOSIT_AMOUNT);

      const balance = await vault.getTotalBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(balance).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should revert deposit with zero amount", async function () {
      await expect(
        vault.connect(user).deposit(await mockUSDC.getAddress(), 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should revert deposit with invalid token address", async function () {
      await expect(
        vault.connect(user).deposit(ethers.ZeroAddress, DEPOSIT_AMOUNT)
      ).to.be.revertedWith("Invalid token address");
    });

    it("Should emit Deposited event", async function () {
      await mockUSDC
        .connect(user)
        .approve(await vault.getAddress(), DEPOSIT_AMOUNT);

      await expect(
        vault.connect(user).deposit(await mockUSDC.getAddress(), DEPOSIT_AMOUNT)
      )
        .to.emit(vault, "Deposited")
        .withArgs(
          user.address,
          await mockUSDC.getAddress(),
          DEPOSIT_AMOUNT,
          await ethers.provider.getBlock("latest").then((b) => b!.timestamp + 1)
        );
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await mockUSDC
        .connect(user)
        .approve(await vault.getAddress(), DEPOSIT_AMOUNT);
      await vault
        .connect(user)
        .deposit(await mockUSDC.getAddress(), DEPOSIT_AMOUNT);
    });

    it("Should allow users to withdraw available balance", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);
      const balanceBefore = await mockUSDC.balanceOf(user.address);

      await vault
        .connect(user)
        .withdraw(await mockUSDC.getAddress(), withdrawAmount);

      const balanceAfter = await mockUSDC.balanceOf(user.address);
      expect(balanceAfter - balanceBefore).to.equal(withdrawAmount);
    });

    it("Should revert withdrawal exceeding available balance", async function () {
      const tooMuchAmount = ethers.parseUnits("150", 6);

      await expect(
        vault.connect(user).withdraw(await mockUSDC.getAddress(), tooMuchAmount)
      ).to.be.revertedWith("Insufficient available balance");
    });

    it("Should emit Withdrawn event", async function () {
      const withdrawAmount = ethers.parseUnits("50", 6);

      await expect(
        vault.connect(user).withdraw(await mockUSDC.getAddress(), withdrawAmount)
      ).to.emit(vault, "Withdrawn");
    });
  });

  describe("Fund Locking", function () {
    beforeEach(async function () {
      await mockUSDC
        .connect(user)
        .approve(await vault.getAddress(), DEPOSIT_AMOUNT);
      await vault
        .connect(user)
        .deposit(await mockUSDC.getAddress(), DEPOSIT_AMOUNT);

      // Authorize manager
      await vault.setAuthorizedManager(manager.address, true);
    });

    it("Should allow authorized manager to lock funds", async function () {
      const lockAmount = ethers.parseUnits("30", 6);

      await vault
        .connect(manager)
        .lockFunds(user.address, await mockUSDC.getAddress(), lockAmount);

      const lockedBalance = await vault.getLockedBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(lockedBalance).to.equal(lockAmount);
    });

    it("Should revert locking if not authorized", async function () {
      const [, , , unauthorized] = await ethers.getSigners();
      const lockAmount = ethers.parseUnits("30", 6);

      await expect(
        vault
          .connect(unauthorized)
          .lockFunds(user.address, await mockUSDC.getAddress(), lockAmount)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should revert locking more than available balance", async function () {
      const tooMuchAmount = ethers.parseUnits("150", 6);

      await expect(
        vault
          .connect(manager)
          .lockFunds(user.address, await mockUSDC.getAddress(), tooMuchAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should allow unlocking funds", async function () {
      const lockAmount = ethers.parseUnits("30", 6);

      await vault
        .connect(manager)
        .lockFunds(user.address, await mockUSDC.getAddress(), lockAmount);

      await vault
        .connect(manager)
        .unlockFunds(user.address, await mockUSDC.getAddress(), lockAmount);

      const lockedBalance = await vault.getLockedBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(lockedBalance).to.equal(0);
    });
  });

  describe("Authorization", function () {
    it("Should allow owner to authorize managers", async function () {
      await vault.setAuthorizedManager(manager.address, true);

      const isAuthorized = await vault.authorizedManagers(manager.address);
      expect(isAuthorized).to.be.true;
    });

    it("Should allow owner to revoke manager authorization", async function () {
      await vault.setAuthorizedManager(manager.address, true);
      await vault.setAuthorizedManager(manager.address, false);

      const isAuthorized = await vault.authorizedManagers(manager.address);
      expect(isAuthorized).to.be.false;
    });

    it("Should revert if non-owner tries to authorize", async function () {
      await expect(
        vault.connect(user).setAuthorizedManager(manager.address, true)
      ).to.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await mockUSDC
        .connect(user)
        .approve(await vault.getAddress(), DEPOSIT_AMOUNT);
      await vault
        .connect(user)
        .deposit(await mockUSDC.getAddress(), DEPOSIT_AMOUNT);

      await vault.setAuthorizedManager(manager.address, true);
      await vault
        .connect(manager)
        .lockFunds(
          user.address,
          await mockUSDC.getAddress(),
          ethers.parseUnits("30", 6)
        );
    });

    it("Should return correct total balance", async function () {
      const total = await vault.getTotalBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(total).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should return correct locked balance", async function () {
      const locked = await vault.getLockedBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(locked).to.equal(ethers.parseUnits("30", 6));
    });

    it("Should return correct available balance", async function () {
      const available = await vault.getAvailableBalance(
        user.address,
        await mockUSDC.getAddress()
      );
      expect(available).to.equal(ethers.parseUnits("70", 6));
    });
  });
});

