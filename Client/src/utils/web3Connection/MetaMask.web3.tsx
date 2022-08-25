import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
const ONBOARD_TEXT: string = "Click here to install MetaMask!";
const CONNECT_TEXT: string = "Connect";
const CONNECTED_TEXT: string = "Connected";

declare var window: any;
export const OnboardingButton: React.FC = () => {
  const [buttonText, setButtonText] = React.useState<string>(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState<boolean>(false);
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();
  let WalletAddress: string | null = localStorage.getItem("walletAddress");

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current?.startOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, []);
  React.useEffect(() => {
    function handleNewAccounts(newAccounts: any) {
      setAccounts(newAccounts);
    }

    if (MetaMaskOnboarding.isMetaMaskInstalled() && WalletAddress) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: any) => {
          localStorage.setItem("walletAddress", newAccounts);
          setAccounts(newAccounts);
        });
    } else if ("ethereum#initialized") {
      window.open("https://metamask.app.link/dapp");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: any) => {
          localStorage.setItem("walletAddress", newAccounts);
          setAccounts(newAccounts);
        });
    } else {
      onboarding.current?.startOnboarding();
    }
  };
  const disconnectMetaMask = () => {
    localStorage.removeItem("walletAddress");
    setAccounts([]);
  };

  return (
    <>
      {WalletAddress && window.ethereum.selectedAddress ? (
        <button
          type="submit"
          className="disconnect-wallet btn btn-secondary"
          onClick={disconnectMetaMask}
        >
          Disconnect {WalletAddress.substring(0, 4)}...
          {WalletAddress.substring(38, 42)}
        </button>
      ) : (
        <button
          disabled={isDisabled}
          onClick={onClick}
          className="select-wallet-btn btn btn-primary"
        >
          {" "}
          Connect{" "}
        </button>
      )}
    </>
  );
};
