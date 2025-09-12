// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const feeRecipient = "0x87F961d576ef426ec411FE4BBf5aBec4Fd747A4A";
  const flatFeeWei = ethers.parseEther("0.1"); // 0.1 MON

  const NftSwap = await ethers.getContractFactory("NftSwap");
  const swap = await NftSwap.deploy(feeRecipient, flatFeeWei);
  await swap.waitForDeployment();

  console.log("NftSwap deployed to:", await swap.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });
