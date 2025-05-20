import OnchainRiddleABI from "@/abis/OnchainRiddle.json";
import { config } from "@/config/wagmi-config";
import { CONTRACT_ADDRESS, WINNER_TOPIC } from "@/constants/contract";
import { graphQLClient } from "@/lib/graphql-client";
import { getShortAddress } from "@/lib/utils";
import { gql } from "graphql-request";
import { useCallback, useState } from "react";
import { BaseError, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { sendTransaction, waitForTransactionReceipt } from "wagmi/actions";
import { sepolia } from "wagmi/chains";
import { useLatestRiddle } from "./useLatestRiddle";

interface AnswerAttemptsResponse {
  answerAttempts: {
    user: string;
  }[];
}

const CHECK_DUPLICATE_QUERY = gql`
  query HasAnswerBeenSubmitted($answer: String!, $minBlockNumber: String!) {
    answerAttempts(
      where: { answerInput: $answer, blockNumber_gte: $minBlockNumber }
    ) {
      user
    }
  }
`;

export function useSubmitAnswer() {
  const { address, isConnected, chain } = useAccount();
  const { data: latestRiddle } = useLatestRiddle();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<{
    error: string;
    timestamp: number;
  } | null>(null);

  const submitAnswer = useCallback(
    async (
      answer: string
    ): Promise<{
      success: boolean;
      error: string | null;
      isWinner: boolean;
    }> => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);

      if (!isConnected || !address) {
        setError({ error: "Wallet not connected", timestamp: Date.now() });
        setIsLoading(false);
        return {
          success: false,
          error: "Wallet not connected",
          isWinner: false,
        };
      }
      if (chain?.id !== sepolia.id) {
        setError({
          error: "Please switch to Sepolia network",
          timestamp: Date.now(),
        });
        setIsLoading(false);
        return {
          success: false,
          error: "Please switch to Sepolia network",
          isWinner: false,
        };
      }
      const normalizedAnswer = answer.trim().toLowerCase();

      try {
        const data = await graphQLClient.request<AnswerAttemptsResponse>(
          CHECK_DUPLICATE_QUERY,
          {
            answer: normalizedAnswer,
            minBlockNumber: latestRiddle?.blockNumber,
          }
        );

        if (data.answerAttempts.length > 0) {
          setError({
            error: `Answer already submitted by user ${getShortAddress(
              data.answerAttempts[0].user
            )}`,
            timestamp: Date.now(),
          });
          setIsLoading(false);
          return {
            success: false,
            error: "Answer already submitted",
            isWinner: false,
          };
        }

        const hash = await sendTransaction(config, {
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: encodeFunctionData({
            abi: OnchainRiddleABI.abi,
            functionName: "submitAnswer",
            args: [normalizedAnswer],
          }),
        });

        setTxHash(hash);

        const receipt = await waitForTransactionReceipt(config, {
          hash,
        });

        const winnerEvent = receipt.logs.find(
          (log) => log.topics[0] === WINNER_TOPIC
        );

        const isWinner = !!winnerEvent;

        setIsLoading(false);
        return {
          success: receipt.status === "success",
          error: null,
          isWinner,
        };
      } catch (error: unknown) {
        setIsLoading(false);
        if (error instanceof BaseError) {
          setError({
            error: error.shortMessage,
            timestamp: Date.now(),
          });
          return {
            success: false,
            error: error.shortMessage,
            isWinner: false,
          };
        }
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error";
        setError({
          error: errorMessage,
          timestamp: Date.now(),
        });
        return {
          success: false,
          error: errorMessage,
          isWinner: false,
        };
      }
    },
    [address, isConnected, chain?.id, latestRiddle]
  );

  return {
    submitAnswer,
    isLoading,
    txHash,
    error,
  };
}
