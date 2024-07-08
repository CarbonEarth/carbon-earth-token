import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CarbonEarthToken } from "../typechain-types";
import { expect } from "chai";

describe("CarbonEarthToken", function () {
  let carbonEarthToken: CarbonEarthToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    const CarbonEarthTokenFactory = await ethers.getContractFactory("CarbonEarthToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    carbonEarthToken = (await CarbonEarthTokenFactory.deploy()) as CarbonEarthToken;
    await carbonEarthToken.waitForDeployment();
  });

  it("Should have correct initial supply", async function () {
    const ownerBalance = await carbonEarthToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.parseEther("200000000"));
  });

  it("Should return the correct total supply", async function () {
    const totalSupply = await carbonEarthToken.totalSupply();
    expect(totalSupply).to.equal(ethers.parseEther("200000000"));
  });

  it("Should transfer tokens correctly", async function () {
    await carbonEarthToken.transfer(addr1.address, ethers.parseEther("100"));
    const addr1Balance = await carbonEarthToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("100"));

    const ownerBalance = await carbonEarthToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.parseEther("199999900"));
  });

  it("Should emit Transfer event on transfer", async function () {
    await expect(carbonEarthToken.transfer(addr1.address, ethers.parseEther("100")))
      .to.emit(carbonEarthToken, "Transfer")
      .withArgs(owner.address, addr1.address, ethers.parseEther("100"));
  });

  it("Should approve tokens correctly", async function () {
    await carbonEarthToken.approve(addr1.address, ethers.parseEther("100"));
    const allowance = await carbonEarthToken.allowance(owner.address, addr1.address);
    expect(allowance).to.equal(ethers.parseEther("100"));
  });

  it("Should emit Approval event on approve", async function () {
    await expect(carbonEarthToken.approve(addr1.address, ethers.parseEther("100")))
      .to.emit(carbonEarthToken, "Approval")
      .withArgs(owner.address, addr1.address, ethers.parseEther("100"));
  });

  it("Should handle allowance correctly", async function () {
    await carbonEarthToken.approve(addr1.address, ethers.parseEther("100"));
    await carbonEarthToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("50"));
    const addr2Balance = await carbonEarthToken.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });

  it("Should revert transferFrom when allowance is exceeded", async function () {
    await carbonEarthToken.approve(addr1.address, ethers.parseEther("100"));
    await expect(
      carbonEarthToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("150"))
    ).to.be.revertedWithCustomError(carbonEarthToken, "ERC20InsufficientAllowance");
  });

  it("Should transfer ownership correctly", async function () {
    await carbonEarthToken.transferOwnership(addr1.address);
    expect(await carbonEarthToken.owner()).to.equal(addr1.address);
  });

  it("Should only allow owner to transfer ownership", async function () {
    await expect(carbonEarthToken.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWithCustomError(carbonEarthToken, "OwnableUnauthorizedAccount");
  });

});
