import Tabs from "./Tabs";
import { useEffect, useState } from "react";

const SeedTokenTransfer = (props: any) => {

  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
  const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
  const [updateBalance, setUpdateBalance] = useState<number>(0);
  const [o2ContractTokens, setO2ContractToken] = useState<number>(0);
  const [bscBalance, setBscBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
  const [shillToken, setShillToken] = useState<number>(0);
  const [solanaShillToken, setSolanaShillToken] = useState<number>(0)
  const [o2AvailableTokens, setO2AvailableTokens] = useState<number>(0)
  const [shillAvailableTokens, setShillAvailableTokens] = useState<number>(0)
  const balanceUpdate = (data: any) => {
    setUpdateBalance(data);
    props.BalanceUpdate(data);
  };

  useEffect(() => {

    setSelectedWallet(props.SelectedWallet);
    setWalletAddress(props.WalletAddress);
    setBscTokenbalance(props.BscTokenBalance);
    setSolTokenbalance(props.SolTokenBalance);
    setO2ContractToken(props.O2ContractToken);
    setBscBalance(props.BscBalance);
    setSolBalance(props.SolBalance);
    setO2SolContractToken(props.O2SolContractToken);
    setShillToken(props.ShillToken);
    setSolanaShillToken(props.SolanaShillToken);
    setO2AvailableTokens(props.O2AvailableTokens)
    setShillAvailableTokens(props.ShillAvailableTokens)
  }, [props.SelectedWallet,
  props.WalletAddress,
  props.BscTokenBalance,
  props.SolTokenBalance,
  props.BscBalance,
  props.SolBalance,
  props.O2ContractToken,
  props.O2SolContractToken,
  props.ShillToken,
  props.SolanaShillToken,
  props.O2AvailableTokens,
  props.ShillAvailableTokens]);

  return (
    <>
      <Tabs
        selectedWallet={selectedWallet}
        WalletAddress={walletAddress}
        BscTokenBalance={bscTokenBalance}
        SolTokenBalance={solTokenBalance}
        BalanceUpdate={balanceUpdate}
        SolBalance={solBalance}
        BscBalance={bscBalance}
        O2ContractToken={o2ContractTokens}
        O2SolContractToken={o2SolContractToken}
        ShillToken={shillToken}
        SolanaShillToken={solanaShillToken}
        ShillAvailableTokens={shillAvailableTokens}
        O2AvailableTokens={o2AvailableTokens}
        WalletUpdate={props.WalletUpdate}
      />
    </>
  );
}

export default SeedTokenTransfer;
