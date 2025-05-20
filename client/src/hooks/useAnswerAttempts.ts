import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "../lib/graphql-client";

export interface AnswerAttempt {
  id: string;
  user: string;
  correct: boolean;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  answerInput: string;
}

interface AnswerAttemptsResponse {
  answerAttempts: AnswerAttempt[];
}

const ANSWER_ATTEMPTS = gql`
  query AnswerAttempts($first: Int!, $skip: Int!, $minBlockNumber: String!) {
    answerAttempts(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
      where: { blockNumber_gte: $minBlockNumber }
    ) {
      id
      user
      correct
      blockNumber
      blockTimestamp
      transactionHash
      answerInput
    }
  }
`;

export function useAnswerAttempts(
  page = 1,
  pageSize = 10,
  minBlockNumber?: string
) {
  const skip = (page - 1) * pageSize;

  const query = useQuery({
    queryKey: ["answerAttempts", page, pageSize, minBlockNumber],
    queryFn: async () => {
      if (!minBlockNumber) {
        return [];
      }
      try {
        const data = await graphQLClient.request<AnswerAttemptsResponse>(
          ANSWER_ATTEMPTS,
          {
            first: pageSize,
            skip,
            minBlockNumber,
          }
        );
        if (
          !data ||
          !data.answerAttempts ||
          !Array.isArray(data.answerAttempts)
        ) {
          console.error("Invalid response structure:", data);
          throw new Error("Invalid response structure from GraphQL API");
        }

        return data.answerAttempts || [];
      } catch (error) {
        console.error("GraphQL request failed:", error);
        throw error;
      }
    },
    enabled: !!minBlockNumber,
    refetchOnWindowFocus: false,
  });

  if (query.error) {
    console.error("Query error:", query.error);
  }

  return query;
}
