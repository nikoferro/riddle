import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { graphQLClient } from "../lib/graphql-client";
import { gql } from "graphql-request";

export interface RiddleSet {
  id: string;
  riddle: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface LatestRiddleResponse {
  riddleSets: RiddleSet[];
}

const LATEST_RIDDLE = gql`
  query LatestRiddle {
    riddleSets(first: 1, orderBy: blockNumber, orderDirection: desc) {
      id
      riddle
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export function useLatestRiddle(): UseQueryResult<RiddleSet | null> {
  const query = useQuery<RiddleSet | null>({
    queryKey: ["latestRiddle"],
    queryFn: async () => {
      try {
        const data = await graphQLClient.request<LatestRiddleResponse>(
          LATEST_RIDDLE
        );

        if (!data || !data.riddleSets || !Array.isArray(data.riddleSets)) {
          throw new Error("Invalid response structure from GraphQL API");
        }

        if (data.riddleSets.length === 0) {
          return null;
        }

        return data.riddleSets[0];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (query.error) {
    console.error("Query error:", query.error);
  }

  return query;
}
