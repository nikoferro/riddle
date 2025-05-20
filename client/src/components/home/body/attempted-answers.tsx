import { useRiddle } from "@/context/riddle-context";
import { motion } from "framer-motion";

const AttemptedAnswers = () => {
  const { attempts } = useRiddle();
  if (attempts.error) {
    return (
      <div className="text-destructive text-center">
        Error loading attempted answers. Please try again later.
      </div>
    );
  }

  return attempts.data && attempts.data.length > 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      className="space-y-4"
    >
      <>
        <div className="max-w-sm mx-auto h-px bg-muted" />
        <div className="space-y-4">
          <p className="text-lg font-medium text-foreground/80 text-center">
            Previously Attempted Answers:{" "}
            {attempts.data.map((attempt, i) => (
              <span key={attempt.id}>
                <a
                  href={`https://sepolia.etherscan.io/tx/${attempt.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-foreground transition-colors"
                >
                  {attempt.answerInput}
                </a>
                {i < attempts.data.length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>
      </>
    </motion.div>
  ) : null;
};

export default AttemptedAnswers;
