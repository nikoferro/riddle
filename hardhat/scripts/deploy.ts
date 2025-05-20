import dotenv from "dotenv";
import hre from "hardhat";
import { createWalletClient, formatEther, http, walletActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import OnchainRiddleArtifact from "../artifacts/contracts/OnchainRiddle.sol/OnchainRiddle.json";

dotenv.config();

async function main() {
  console.log("🚀 Starting deployment process...");

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in .env file");
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = await hre.viem.getPublicClient();
  const walletClient = createWalletClient({
    account,
    chain: publicClient.chain,
    transport: http(),
  }).extend(walletActions);

  console.log(`📝 Deploying from account: ${account.address}`);

  const balance = await publicClient.getBalance({
    address: account.address,
  });
  console.log(`💰 Deployer balance: ${formatEther(balance)} ETH`);

  console.log(`🔄 Deploying OnchainRiddle`);

  const deployHash = await walletClient.deployContract({
    abi: OnchainRiddleArtifact.abi,
    bytecode: OnchainRiddleArtifact.bytecode as `0x${string}`,
  });

  console.log(`⏱️ Waiting for transaction to be mined: ${deployHash}`);
  const transactionReceipt = await publicClient.waitForTransactionReceipt({
    hash: deployHash,
  });

  console.log(
    `✅ OnchainRiddle deployed to: ${transactionReceipt.contractAddress}`
  );
  console.log(`🔍 Gas used: ${transactionReceipt.gasUsed}`);

  return transactionReceipt.contractAddress;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
