import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Replace with your NFT contract(s) that should be in the allowlist
  const initialAllowlist = [
    "0xFD6a239deC8463A527081B85b198Ed1D74460c7d"
  ];
  const names = ["MyNFT"];

  const Swap = await ethers.getContractFactory("NftNftSwapAllowlist");
  const swap = await Swap.deploy(initialAllowlist, names);

  await swap.waitForDeployment();
  console.log("Swap contract deployed at:", await swap.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
