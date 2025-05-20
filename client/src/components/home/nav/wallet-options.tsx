import { useConnect } from "wagmi";
import { Button } from "@/components/ui/button";

function WalletOptions() {
  const { connectors, connect } = useConnect();

  const metamaskConnector = connectors.find(
    (connector) => connector.type === "metaMask"
  );

  return metamaskConnector ? (
    <Button
      key={metamaskConnector.uid}
      onClick={() => connect({ connector: metamaskConnector })}
    >
      Connect Wallet
    </Button>
  ) : null;
}

export default WalletOptions;
