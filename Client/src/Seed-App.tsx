import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Acitivity from "./components/SeedActivity/Acitivity";
import SeedTokenTransfer from "./components/SeedTokenTransfer/SeedTokenTransfer";
import TransferToGame from "./components/SeedTokenTransfer/TokenTransferToGame/TransferToGame";
import Outh from "./components/Outh/Outh";
import NftDetails from "./components/SeedActivity/Nfts/index";
import NftTransfer from "./components/NftTransfer/index";
import NftTransfer2 from "./components/NftTransfer2/index";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
const SeedApp = () => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
  const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
  const [updateBalance, setUpdateBalance] = useState('');
  const [loggedout, setLoggedout] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [o2ContractTokens, setO2ContractToken] = useState<number>(0);
  const [bscBalance, setBscBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
  const [shillToken, setShillToken] = useState<number>(0);
  const [solanaShillToken, setSolanaShillToken] = useState<number>(0);
  const [o2AvailableTokens, setO2AvailableTokens] = useState<number>(0)
  const [shillAvailableTokens, setShillAvailableTokens] = useState<number>(0)
  const SelectedWallet = (
    data: any,
    walletKey: any,
    bscTokenBalance: number,
    solTokenBalance: number,
    bscBalance: number,
    solBalance: number,
    o2ContractToken: number,
    o2SolContractToken: number,
    shillToken: number,
    solanaShillToken: number,
    o2AvailableTokens: number,
    shillAvailableTokens: number

  ) => {
    setSelectedWallet(data);
    setWalletAddress(walletKey);
    setBscTokenbalance(bscTokenBalance);
    setSolTokenbalance(solTokenBalance);
    setO2ContractToken(o2ContractToken);
    setBscBalance(bscBalance);
    setSolBalance(solBalance);
    setO2SolContractToken(o2SolContractToken);
    setShillToken(shillToken);
    setSolanaShillToken(solanaShillToken);
    setO2AvailableTokens(o2AvailableTokens)
    setShillAvailableTokens(shillAvailableTokens)
  };

  const handleLoggedOut = (loggedout: boolean) => {
    if (loggedout === false) {
      setLoggedout(loggedout);
      setLoggedIn(true)
    }
    else {
      setLoggedout(loggedout);
      setLoggedIn(false)

    }
  };

  const balanceUpdate = (data: any) => {
    setUpdateBalance(data);
  };
  const walletUpdate = (data: any) => {
    setSelectedWallet(data)
  }
  const handleLoggedIn = (loggedIn: boolean) => {
    if (loggedIn === true) {
      setLoggedout(false);
      setLoggedIn(loggedIn)
    }
    else {
      setLoggedout(loggedIn);
      setLoggedIn(false)
    }
  };
  useEffect(() => {
    let user: any = JSON.parse(localStorage.getItem('Wallets'))
    if (user?.wallet?._id) {
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
  }, [])

  return (
    <Router>
      {loggedIn ?
        <Header
          SelectedWallet={SelectedWallet}
          UpdateBalance={updateBalance}
          OuthHandler={handleLoggedOut}
          OuthLoggedInHandler={handleLoggedIn}
          UpdateWallet={selectedWallet}
        />
        : null}
      <Routes>

        {
          loggedIn ?
            <>
              <Route path="/" element={<Acitivity
                LoggedIn={loggedIn}
                Loggedout={loggedout}
                SelectedWallet={selectedWallet}
              />} />
              <Route path="/SeedTokenTransfer" element={<SeedTokenTransfer
                SelectedWallet={selectedWallet}
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
                O2AvailableTokens={o2AvailableTokens}
                ShillAvailableTokens={shillAvailableTokens}
                WalletUpdate={walletUpdate}
              />} />
              <Route path="/SeedNftTransfer" element={<NftTransfer
                SelectedWallet={selectedWallet}
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


              />} />
              <Route path="/SeedNftTransfer2" element={<NftTransfer2
                SelectedWallet={selectedWallet}
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

              />} />
              <Route path="/TransferToGame" element={<TransferToGame />} />
              <Route path="/nft-details/:id" element={<NftDetails />} />
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </>
            :
            <>
              <Route path="/login" element={<Outh OuthHandler={handleLoggedOut} />} />
              <Route
                path="*"
                element={<Navigate to="/login" replace />}
              />

            </>
        }

      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default SeedApp;

