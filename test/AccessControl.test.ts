import { expect } from "chai";
import { ethers } from "hardhat";
import { ReclaimAccessControl } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ReclaimAccessControl", function () {
  let accessControl: ReclaimAccessControl;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [admin, user1, user2, user3] = await ethers.getSigners();

    const AccessControlFactory = await ethers.getContractFactory(
      "ReclaimAccessControl"
    );
    accessControl = await AccessControlFactory.deploy(admin.address);
    await accessControl.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set admin correctly", async function () {
      expect(await accessControl.isAdmin(admin.address)).to.be.true;
    });

    it("Should grant DEFAULT_ADMIN_ROLE to admin", async function () {
      const DEFAULT_ADMIN_ROLE = await accessControl.DEFAULT_ADMIN_ROLE();
      expect(await accessControl.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to
        .be.true;
    });
  });

  describe("Manager Role", function () {
    it("Should grant manager role", async function () {
      await accessControl.grantManagerRole(user1.address);
      expect(await accessControl.isManager(user1.address)).to.be.true;
    });

    it("Should revoke manager role", async function () {
      await accessControl.grantManagerRole(user1.address);
      await accessControl.revokeManagerRole(user1.address);
      expect(await accessControl.isManager(user1.address)).to.be.false;
    });

    it("Should only allow admin to grant manager role", async function () {
      await expect(
        accessControl.connect(user1).grantManagerRole(user2.address)
      ).to.be.reverted;
    });
  });

  describe("Operator Role", function () {
    it("Should grant operator role", async function () {
      await accessControl.grantOperatorRole(user1.address);
      expect(await accessControl.isOperator(user1.address)).to.be.true;
    });

    it("Should revoke operator role", async function () {
      await accessControl.grantOperatorRole(user1.address);
      await accessControl.revokeOperatorRole(user1.address);
      expect(await accessControl.isOperator(user1.address)).to.be.false;
    });

    it("Should only allow admin to grant operator role", async function () {
      await expect(
        accessControl.connect(user1).grantOperatorRole(user2.address)
      ).to.be.reverted;
    });
  });

  describe("Pauser Role", function () {
    it("Should grant pauser role", async function () {
      await accessControl.grantPauserRole(user1.address);
      expect(await accessControl.isPauser(user1.address)).to.be.true;
    });

    it("Should revoke pauser role", async function () {
      await accessControl.grantPauserRole(user1.address);
      await accessControl.revokePauserRole(user1.address);
      expect(await accessControl.isPauser(user1.address)).to.be.false;
    });

    it("Should only allow admin to grant pauser role", async function () {
      await expect(
        accessControl.connect(user1).grantPauserRole(user2.address)
      ).to.be.reverted;
    });
  });

  describe("Multiple Roles", function () {
    it("Should allow user to have multiple roles", async function () {
      await accessControl.grantManagerRole(user1.address);
      await accessControl.grantOperatorRole(user1.address);
      await accessControl.grantPauserRole(user1.address);

      expect(await accessControl.isManager(user1.address)).to.be.true;
      expect(await accessControl.isOperator(user1.address)).to.be.true;
      expect(await accessControl.isPauser(user1.address)).to.be.true;
    });

    it("Should revoke individual roles independently", async function () {
      await accessControl.grantManagerRole(user1.address);
      await accessControl.grantOperatorRole(user1.address);

      await accessControl.revokeManagerRole(user1.address);

      expect(await accessControl.isManager(user1.address)).to.be.false;
      expect(await accessControl.isOperator(user1.address)).to.be.true;
    });
  });

  describe("Role Checks", function () {
    it("Should return false for users without roles", async function () {
      expect(await accessControl.isManager(user1.address)).to.be.false;
      expect(await accessControl.isOperator(user1.address)).to.be.false;
      expect(await accessControl.isPauser(user1.address)).to.be.false;
    });

    it("Should correctly identify admin", async function () {
      expect(await accessControl.isAdmin(admin.address)).to.be.true;
      expect(await accessControl.isAdmin(user1.address)).to.be.false;
    });
  });
});

