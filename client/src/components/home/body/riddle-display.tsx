import { useRiddle } from "@/context/riddle-context";
import { motion } from "framer-motion";

export const RiddleSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 bg-muted animate-pulse rounded-md mx-auto" />
      <div className="h-12 md:h-16 w-3/4 bg-muted animate-pulse rounded-md mx-auto" />
    </div>
  );
};

export const RiddleDisplay = () => {
  const { riddle } = useRiddle();
  if (riddle.isLoading) {
    return <RiddleSkeleton />;
  }

  if (riddle.error) {
    return (
      <div className="text-destructive text-center">
        Error loading riddle. Please try again later.
      </div>
    );
  }

  if (!riddle.data) {
    return (
      <div className="text-muted-foreground text-center">
        No riddle available at the moment.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2 className="text-lg text-muted-foreground text-center font-medium mb-4">
          Current Riddle
        </h2>
        <p className="text-3xl md:text-4xl text-center font-bold leading-tight tracking-tight max-w-xl mx-auto">
          {riddle.data.riddle}
        </p>
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span>
              Posted{" "}
              {new Date(
                Number(riddle.data.blockTimestamp) * 1000
              ).toLocaleString()}
            </span>
            <span className="text-muted-foreground/50">•</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${riddle.data.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-foreground transition-colors text-blue-400"
            >
              View on Etherscan
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
