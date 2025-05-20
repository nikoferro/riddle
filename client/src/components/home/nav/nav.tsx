"use client";

import React from "react";
import { getShortAddress } from "@/lib/utils";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import { ModeToggle } from "./mode-toggle";

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  const metamaskConnector = connectors.find(
    (connector) => connector.type === "metaMask"
  );
  return metamaskConnector ? (
    <Button
      key={metamaskConnector.uid}
      variant="outline"
      onClick={() => connect({ connector: metamaskConnector })}
    >
      Connect Wallet
    </Button>
  ) : null;
}

function DisconnectWallet() {
  const { disconnect } = useDisconnect();
  return (
    <Button variant="outline" onClick={() => disconnect()}>
      Disconnect Wallet
    </Button>
  );
}

function Nav() {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedBalance =
    isClient && balance ? Number(balance.formatted).toFixed(4) : null;

  return (
    <div className="flex flex-col sm:flex-row justify-end p-4 gap-2 sm:gap-6">
      <div className="flex flex-wrap justify-end items-center gap-4 sm:gap-6">
        {isClient && balance && (
          <div className="flex items-center">
            <span className="text-xs font-bold text-default-800">
              {formattedBalance} Sepolia ETH
            </span>
          </div>
        )}
        {isClient && address && (
          <div className="flex items-center gap-2">
            <span
              className={`${
                isConnected ? "animate-pulse bg-green-500" : "bg-red-500"
              } w-2 h-2 rounded-full`}
            ></span>
            <span className="text-xs font-bold text-default-800">
              {getShortAddress(address)}
            </span>
          </div>
        )}
        {isClient && (isConnected ? <DisconnectWallet /> : <ConnectWallet />)}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Nav;
