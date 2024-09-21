import { expect } from "chai";
import { ethers } from "hardhat";
import { PriceOracle, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PriceOracle", function () {
  let priceOracle: PriceOracle;
  let tokenA: MockUSDC;
  let tokenB: MockUSDC;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy PriceOracle
    const PriceOracleFactory = await ethers.getContractFactory("PriceOracle");
    priceOracle = await PriceOracleFactory.deploy();
    await priceOracle.waitForDeployment();

    // Deploy mock tokens
    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    tokenA = await MockUSDCFactory.deploy("Token A", "TKA");
    await tokenA.waitForDeployment();

    tokenB = await MockUSDCFactory.deploy("Token B", "TKB");
    await tokenB.waitForDeployment();
  });

  describe("Price Updates", function () {
    it("Should update price correctly", async function () {
      const price = ethers.parseEther("1.5");

      await expect(
        priceOracle.updatePrice(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          price
        )
      )
        .to.emit(priceOracle, "PriceUpdated")
        .withArgs(await tokenA.getAddress(), await tokenB.getAddress(), price, await ethers.provider.getBlock("latest").then(b => b!.timestamp));

      const storedPrice = await priceOracle.getPrice(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );
      expect(storedPrice).to.equal(price);
    });

    it("Should reject invalid price updates", async function () {
      await expect(
        priceOracle.updatePrice(
          ethers.ZeroAddress,
          await tokenB.getAddress(),
          ethers.parseEther("1")
        )
      ).to.be.revertedWith("Invalid token");

      await expect(
        priceOracle.updatePrice(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          0
        )
      ).to.be.revertedWith("Invalid price");
    });

    it("Should only allow owner to update prices", async function () {
      await expect(
        priceOracle
          .connect(user)
          .updatePrice(
            await tokenA.getAddress(),
            await tokenB.getAddress(),
            ethers.parseEther("1")
          )
      ).to.be.reverted;
    });
  });

  describe("Price Queries", function () {
    beforeEach(async function () {
      await priceOracle.updatePrice(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("2")
      );
    });

    it("Should get price correctly", async function () {
      const price = await priceOracle.getPrice(
        await tokenA.getAddress(),
        await tokenB.getAddress()
      );
      expect(price).to.equal(ethers.parseEther("2"));
    });

    it("Should validate price expiration", async function () {
      // Fast forward time beyond validity period
      await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]); // 25 hours
      await ethers.provider.send("evm_mine", []);

      await expect(
        priceOracle.getPrice(
          await tokenA.getAddress(),
          await tokenB.getAddress()
        )
      ).to.be.revertedWith("Price expired");
    });

    it("Should check price validity", async function () {
      expect(
        await priceOracle.isPriceValid(
          await tokenA.getAddress(),
          await tokenB.getAddress()
        )
      ).to.be.true;

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      expect(
        await priceOracle.isPriceValid(
          await tokenA.getAddress(),
          await tokenB.getAddress()
        )
      ).to.be.false;
    });
  });

  describe("Amount Conversion", function () {
    beforeEach(async function () {
      await priceOracle.updatePrice(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        ethers.parseEther("2")
      );
    });

    it("Should convert amounts correctly", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = await priceOracle.convertAmount(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA
      );

      expect(amountB).to.equal(ethers.parseEther("200"));
    });

    it("Should return same amount for same token", async function () {
      const amount = ethers.parseEther("100");
      const converted = await priceOracle.convertAmount(
        await tokenA.getAddress(),
        await tokenA.getAddress(),
        amount
      );

      expect(converted).to.equal(amount);
    });

    it("Should reject conversion with expired price", async function () {
      await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        priceOracle.convertAmount(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          ethers.parseEther("100")
        )
      ).to.be.revertedWith("Price expired");
    });
  });
});

