import {
  createPublicClient,
  createWalletClient,
  http,
  Hash,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { riddles } from "./constants/riddles.js";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const OnchainRiddle = JSON.parse(
  (
    await readFile(new URL("./abis/OnchainRiddle.json", import.meta.url))
  ).toString()
);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.RPC_URL;

// validate env variables
if (!CONTRACT_ADDRESS || !DEPLOYER_PRIVATE_KEY || !RPC_URL) {
  throw new Error("Missing environment variables");
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(RPC_URL),
});

const contract = {
  address: CONTRACT_ADDRESS,
  abi: OnchainRiddle.abi,
} as const;

async function getCurrentRiddle() {
  try {
    const riddle = await publicClient.readContract({
      ...contract,
      functionName: "riddle",
      args: [],
    });
    return riddle;
  } catch (error) {
    console.error("Error getting current riddle:", error);
    return "";
  }
}

async function getNextRiddle() {
  const currentRiddle = await getCurrentRiddle();

  const index = riddles.findIndex(({ riddle }) => riddle === currentRiddle);

  if (index === -1) {
    return riddles[0];
  }

  if (index === riddles.length - 1) {
    return null;
  }

  return riddles[index + 1];
}

function hashAnswer(answer: string): Hash {
  return keccak256(toBytes(answer.toLowerCase()));
}

async function submitRiddle() {
  const nextRiddle = await getNextRiddle();

  if (!nextRiddle) {
    console.log("Last riddle was solved. No more riddles to submit.");
    return;
  }

  const { riddle, answer } = nextRiddle;

  const answerHash = hashAnswer(answer);

  try {
    const hash = await walletClient.writeContract({
      ...contract,
      functionName: "setRiddle",
      args: [riddle, answerHash],
    });

    console.log(`Submitted new riddle: ${riddle}`);
    console.log(`Transaction hash: ${hash}`);
  } catch (error) {
    console.error("Error submitting riddle:", error);
  }
}

async function checkActiveRiddle() {
  try {
    const isActive = await publicClient.readContract({
      ...contract,
      functionName: "isActive",
      args: [],
    });

    return isActive;
  } catch (error) {
    console.error("Error checking active riddle:", error);
    return false;
  }
}

// start the bot
async function startBot() {
  console.log("Starting riddle bot...");

  const hasActiveRiddle = await checkActiveRiddle();
  if (!hasActiveRiddle) {
    console.log("No active riddle found, submitting one...");
    await submitRiddle();
  }

  publicClient.watchContractEvent({
    ...contract,
    eventName: "Winner",
    onLogs: async (logs) => {
      console.log("Winner found! Checking if we should submit a new riddle...");
      await submitRiddle();
    },
  });

  console.log("Bot is running and monitoring for winners...");
}

// Start the bot
startBot().catch(console.error);
