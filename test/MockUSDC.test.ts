import { expect } from "chai";
import { ethers } from "hardhat";
import { MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-toolbox/node_modules/@nomicfoundation/hardhat-ethers/signers";

describe("MockUSDC", function () {
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await mockUSDC.name()).to.equal("Mock USD Coin");
      expect(await mockUSDC.symbol()).to.equal("USDC");
    });

    it("Should have 6 decimals", async function () {
      expect(await mockUSDC.decimals()).to.equal(6);
    });

    it("Should mint initial supply to owner", async function () {
      const balance = await mockUSDC.balanceOf(owner.address);
      expect(balance).to.equal(ethers.parseUnits("1000000", 6));
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockUSDC.mint(user.address, mintAmount);

      const balance = await mockUSDC.balanceOf(user.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should revert if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await expect(
        mockUSDC.connect(user).mint(user.address, mintAmount)
      ).to.be.reverted;
    });
  });

  describe("Faucet", function () {
    it("Should allow anyone to use faucet", async function () {
      const faucetAmount = ethers.parseUnits("5000", 6);
      await mockUSDC.connect(user).faucet(faucetAmount);

      const balance = await mockUSDC.balanceOf(user.address);
      expect(balance).to.equal(faucetAmount);
    });

    it("Should revert if faucet amount exceeds limit", async function () {
      const tooMuch = ethers.parseUnits("15000", 6);
      await expect(
        mockUSDC.connect(user).faucet(tooMuch)
      ).to.be.revertedWith("Faucet limit exceeded");
    });
  });
});

