import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const feeRecipient = process.env.FEE_RECIPIENT!;
  const flatFeeWei = ethers.parseEther("0.1"); // 0.1 MON

  const NftSwap = await ethers.getContractFactory("NftSwap");
  const swap = await NftSwap.deploy(feeRecipient, flatFeeWei);
  await swap.waitForDeployment();

  const addr = await swap.getAddress();
  console.log("NftSwap deployed to:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
