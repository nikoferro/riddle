import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const resp = await fetch(
      "https://api.studio.thegraph.com/query/28347/onchainriddle/version/latest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUBGRAPH_KEY}`,
        },
        body,
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Graph API error:", errorText);
      return NextResponse.json({ error: errorText }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GraphQL route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
