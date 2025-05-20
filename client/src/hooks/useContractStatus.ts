import { useReadContract, useWatchContractEvent } from "wagmi";
import OnchainRiddleABI from "@/abis/OnchainRiddle.json";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { zeroAddress } from "viem";
import { useState, useEffect } from "react";
import { Log } from "viem";

type WinnerEventLog = Log & {
  args: {
    user: `0x${string}`;
  };
};

export function useContractStatus() {
  const [localWinner, setLocalWinner] = useState<`0x${string}` | null>(null);

  const { data: isActive, isLoading: isActiveLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: OnchainRiddleABI.abi,
    functionName: "isActive",
  });

  const { data: winner, isLoading: isWinnerLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: OnchainRiddleABI.abi,
    functionName: "winner",
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: OnchainRiddleABI.abi,
    eventName: "Winner",
    onLogs: (logs) => {
      const winnerLog = logs[0] as WinnerEventLog;
      if (winnerLog?.args?.user) {
        setLocalWinner(winnerLog.args.user);
      }
    },
  });

  useEffect(() => {
    if (winner) {
      setLocalWinner(winner === zeroAddress ? null : (winner as `0x${string}`));
    }
  }, [winner]);

  return {
    isActive: isActive as boolean,
    winner: localWinner,
    isLoading: isActiveLoading || isWinnerLoading,
  };
}
