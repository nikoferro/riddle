import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL as string,
      },
      mining: {
        auto: true,
        // Produce new block every 3 minutes to resolve next issues
        // https://github.com/NomicFoundation/hardhat/issues/2053
        // https://github.com/ethers-io/ethers.js/issues/2338
        // https://github.com/ethers-io/ethers.js/discussions/4116
        interval: 3 * 60 * 1000, // should be less then 5 minutes to make event subscription work
      },
    },
    sepolia: {
      url: process.env.RPC_URL as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  },
};

export default config;
