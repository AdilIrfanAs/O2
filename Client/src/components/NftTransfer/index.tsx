import NftTransfer from "./NftTransfer";
import Header from "../Header/Header";
import { useState, useEffect } from "react";
const Index = (props: any) => {
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [bscTokenBalance, setBscTokenbalance] = useState("");
    const [solTokenBalance, setSolTokenbalance] = useState("");
    const [updateBalance, setUpdateBalance] = useState("");
    const [o2ContractTokens, setO2ContractToken] = useState("");
    const [bscBalance, setBscBalance] = useState("");
    const [solBalance, setSolBalance] = useState("");
    const [o2SolContractToken, setO2SolContractToken] = useState("");
    const [shillToken, setShillToken] = useState("");
    const [solanaShillToken, setSolanaShillToken] = useState(null);
    
    const balanceUpdate = (data: any) => {
        setUpdateBalance(data);
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
    }, [props.SelectedWallet,
    props.WalletAddress,
    props.BscTokenBalance,
    props.SolTokenBalance,
    props.BscBalance,
    props.SolBalance,
    props.O2ContractToken,
    props.O2SolContractToken,
    props.ShillToken,
    props.SolanaShillToken]);
    return (
        <div>
            {/* <Header SelectedWallet={SelectedWallet} UpdateBalance={updateBalance} /> */}
            <NftTransfer
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
                SolanaShillToken={solanaShillToken} />
        </div>
    );
};

export default Index;