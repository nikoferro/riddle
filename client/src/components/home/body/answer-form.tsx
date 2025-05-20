import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRiddle } from "@/context/riddle-context";
import { useSubmitAnswer } from "@/hooks/useSubmitAnswer";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { TransactionStatus } from "./transaction-status";

export const AnswerForm = () => {
  const { contract, attempts } = useRiddle();
  const {
    submitAnswer,
    isLoading: submitAnswerLoading,
    txHash,
    error: submitAnswerError,
  } = useSubmitAnswer();

  const { address, chain } = useAccount();
  const [answer, setAnswer] = useState("");
  const [formError, setFormError] = useState<{
    error: string;
    timestamp: number;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitAnswer(answer);
    if (result.success) {
      setIsSuccess(true);
      setIsWinner(result.isWinner);
      attempts.refetch();
    }
  };

  useEffect(() => {
    if (contract.winner && !isWinner) {
      attempts.refetch();
    }
  }, [contract.winner, isWinner, attempts]);

  useEffect(() => {
    if (submitAnswerError) {
      setFormError(submitAnswerError);
      setIsSuccess(false);
      setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
  }, [submitAnswerError]);

  if (contract.isLoading) {
    return null;
  }

  if (!contract.isActive && !contract.winner) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 md:px-0">
        <div className="w-full max-w-xl text-center text-muted-foreground">
          The riddle is currently inactive.
        </div>
      </div>
    );
  }

  if (contract.winner && !isWinner) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 md:px-0">
        <p className="text-foreground text-xl font-bold">
          This riddle has been solved!
        </p>
        <div className="flex flex-col items-center gap-2 text-center bg-green-500/10 px-8 py-4 rounded-lg">
          <p className="text-foreground text-xl font-bold">
            Correct answer:{" "}
            <span className="text-green-500">
              {attempts.data?.[0]?.answerInput}
            </span>
          </p>
        </div>
        <div className="w-full max-w-xl text-center">
          <p className="font-medium text-xs text-muted-foreground">
            Winner: {contract.winner}
          </p>
        </div>
      </div>
    );
  }

  if (isWinner) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 md:px-0">
        <div className="flex flex-col items-center gap-2 text-center bg-green-500/10 px-8 py-4 rounded-lg">
          <p className="text-foreground text-xl font-bold">
            Congratulations! You&apos;ve won! 🎉
          </p>
          <p className="text-foreground">
            Your answer was correct:{" "}
            <span className="text-green-500">{answer}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 px-4 md:px-0"
    >
      <div className="w-full max-w-xl">
        <Input
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full h-12 text-lg"
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full max-w-xl h-12 text-lg font-medium"
        disabled={submitAnswerLoading || !address || !answer}
        title={
          !address
            ? "Connect your wallet to submit an answer"
            : chain?.id !== sepolia.id
            ? "Please switch to Sepolia network"
            : ""
        }
      >
        {submitAnswerLoading ? "Submitting..." : "Submit Answer"}
      </Button>

      <TransactionStatus
        isLoading={submitAnswerLoading}
        txHash={txHash}
        error={formError}
        isSuccess={isSuccess}
        isWinner={isWinner}
      />
    </form>
  );
};
