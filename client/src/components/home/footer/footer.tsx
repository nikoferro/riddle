"use client";

import React from "react";
import { useBlock } from "wagmi";

function BlockSkeleton() {
  return (
    <div className="flex items-center justify-center text-xs gap-2">
      <span className="animate-pulse bg-muted w-2 h-2 rounded-full"></span>
      <div className="font-bold text-default-800">
        Block:{" "}
        <span className="animate-pulse bg-muted h-3 w-16 inline-block rounded"></span>
      </div>
    </div>
  );
}

function Nav() {
  const block = useBlock({
    watch: true,
  });

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const blockNumber = isClient ? block.data?.number : null;

  return (
    <div className="flex justify-end items-center bg-muted/50 p-2 border-t border-muted-foreground/20">
      {isClient ? (
        blockNumber ? (
          <div className="flex items-center justify-center text-xs gap-2">
            <span
              className={`${
                true ? "animate-pulse bg-green-500" : "bg-red-500"
              } w-2 h-2 rounded-full`}
            ></span>
            <div className="font-bold text-default-800">
              Block:{" "}
              <a
                href={`https://sepolia.etherscan.io/block/${blockNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {blockNumber}
              </a>
            </div>
          </div>
        ) : (
          <BlockSkeleton />
        )
      ) : (
        <BlockSkeleton />
      )}
    </div>
  );
}

export default Nav;
