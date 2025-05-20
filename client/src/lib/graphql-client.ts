import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/graphql"
);
