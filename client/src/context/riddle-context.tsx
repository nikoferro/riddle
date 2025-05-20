import { createContext, useContext, ReactNode } from "react";
import { useLatestRiddle, RiddleSet } from "@/hooks/useLatestRiddle";
import { useContractStatus } from "@/hooks/useContractStatus";
import { useAnswerAttempts, AnswerAttempt } from "@/hooks/useAnswerAttempts";

interface RiddleContextType {
  riddle: {
    data: RiddleSet | null | undefined;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
  };
  contract: {
    isActive: boolean;
    winner: string | null;
    isLoading: boolean;
  };
  attempts: {
    data: AnswerAttempt[];
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
  };
}

const RiddleContext = createContext<RiddleContextType | null>(null);

export function RiddleProvider({ children }: { children: ReactNode }) {
  const riddle = useLatestRiddle();
  const contract = useContractStatus();
  const attempts = useAnswerAttempts(1, 5, riddle.data?.blockNumber);

  return (
    <RiddleContext.Provider
      value={{
        riddle: {
          data: riddle.data,
          isLoading: riddle.isLoading,
          error: riddle.error,
          refetch: riddle.refetch,
        },
        contract: {
          isActive: contract.isActive,
          winner: contract.winner,
          isLoading: contract.isLoading,
        },
        attempts: {
          data: attempts.data || [],
          isLoading: attempts.isLoading,
          error: attempts.error,
          refetch: attempts.refetch,
        },
      }}
    >
      {children}
    </RiddleContext.Provider>
  );
}

export const useRiddle = () => {
  const context = useContext(RiddleContext);
  if (!context) {
    throw new Error("useRiddle must be used within a RiddleProvider");
  }
  return context;
};
