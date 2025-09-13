import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const { MONAD_RPC, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    monadTestnet: {
      url: MONAD_RPC || "https://testnet-rpc.monad.xyz",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      // chainId:  (optional; leave unset if unsure)
    },
  },
};
export default config;
