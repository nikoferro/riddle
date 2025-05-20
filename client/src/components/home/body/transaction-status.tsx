import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface TransactionStatusProps {
  isLoading: boolean;
  txHash: `0x${string}` | null;
  error: { error: string; timestamp: number } | null;
  isSuccess: boolean;
  isWinner: boolean;
}

export const TransactionStatus = ({
  isLoading,
  txHash,
  error,
  isSuccess,
  isWinner,
}: TransactionStatusProps) => {
  if (!isLoading && !txHash && !error) return null;

  const EtherscanLink = ({ hash }: { hash: `0x${string}` }) => (
    <a
      href={`https://sepolia.etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      View on Etherscan
    </a>
  );

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xl">
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm animate-pulse">
            Transaction in progress...
          </span>
          {txHash && <EtherscanLink hash={txHash} />}
        </div>
      )}

      {txHash && isSuccess && (
        <div className="flex flex-col items-center gap-2">
          {isWinner ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Correct answer!</span>
              <span className="text-sm font-bold">You won! 🎉</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Incorrect answer. Try again!</span>
            </div>
          )}
          <EtherscanLink hash={txHash} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span className="text-sm">{error.error}</span>
        </div>
      )}
    </div>
  );
};
