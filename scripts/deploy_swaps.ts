import { ethers } from "hardhat";

async function main() {
  const NFTSwap = await ethers.getContractFactory("NFTSwap");
  const swap = await NFTSwap.deploy();
  await swap.deployed();
  console.log("NFTSwap deployed to:", swap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
