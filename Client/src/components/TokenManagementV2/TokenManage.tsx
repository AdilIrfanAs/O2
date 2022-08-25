import { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { GetCurrencyAmount } from "../../utils/api/Web3.api";
import { ToastContainer, toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { getBSCBalanceandToken } from "../../utils/web3Connection/web3";
import {
  getSolanaTokenBalance,
  getSPlTokenBalance,
} from "../../utils/SolanaConnection/SolanaPhantom";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import {
  DepositToOutlandOdyssey,
  TransferBSCToken,
  TransferSolToken,
  TransferToWallet,
  SendCustomBSCToken,
  SendCustomSolanaToken,
} from "../../utils/api/Web3.api";
import BSCWallet from "../../utils/Custom-Wallet/tokenmanagementV2/BSCwallet";
import Wallet from "../../utils/Custom-Wallet/tokenmanagementV2/Wallet";
import SolanaWallet from "../../utils/Custom-Wallet/tokenmanagementV2/SolanaWallet";
import {token, Wallets } from "../../utils/sharedVariable"
declare var window: any;
const TokenManage = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [OutlandOdyssey, setOutlandOdyssey] = useState(null);
  const [address, setAddress] = useState(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [transactionsValue, setTransactionsValue] = useState("Deposit");
  const [showWalletOption, setShowWalletOption] = useState(null);
  const [updateBalance, setUpdateBalance] = useState(false);
  const hasDecimal = (num) => {
    return !!(num % 1);
  };
  const setModelValue = async (address: any) => {
    setAddress(address);
  };
  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };
  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };
  const getCurrencyAmount = async () => {
    if (token) {
      const response = await GetCurrencyAmount(token);
      response?.data?.FunctionResult?.amount
        ? setOutlandOdyssey(response.data.FunctionResult.amount)
        : setOutlandOdyssey(0);
    }
  };
  const handleTransactionChange = (e: any) => {
    setTransactionsValue(e.target.value);
  };

  const handleTransaction = async (e: any) => {
    e.preventDefault();
    setUpdateBalance(false);
  
    const walletId: number = Wallets?.wallet?._id;
    const Solana = Wallets?.wallet?.sol?.public_key;
    const Binance = Wallets?.wallet?.bsc?.public_key;
    if (transactionsValue === "Deposit") {
      if (selectedValue === "Binance") {
        if (!Binance) return toast.error("Connect your wallet");
        const accountBalance: any = await getBSCBalanceandToken(Binance);
        const tansferToken: number = amount;
        if (!tansferToken || amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (
          tansferToken > accountBalance?.token &&
          accountBalance?.bscBalance
        ) {
          toast.error("You have insufficient tokens");
        } else {
          let ApproveToken = " ";
          setLoader(true);
          let payload: any = {
            amount,
            walletId,
          };
          toast.success("Your transaction is being processed. Please wait ");
          ApproveToken = await SendCustomBSCToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else if (ApproveToken) {
            const GetUpdateCurrncy = await DepositToOutlandOdyssey(amount);
            setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
            setUpdateBalance(true);
            setAmount(0);
            setLoader(false);
          }
        }
      } else if (selectedValue === "Solana") {
        if (!Solana) return toast.error("Connect your wallet");
        let solanaTokenBalance = null;
        solanaTokenBalance = await getSolanaTokenBalance(Solana);
        const solanaBalance: any =
          (await getSPlTokenBalance(Solana)) / 1000000000;
        const tansferToken: number = amount * 1000000000;
        if (!amount || amount <= 0) {
          toast.error("Please Enter Valid Amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (tansferToken > solanaTokenBalance) {
          toast.error("You have insufficient tokens");
        } else if (solanaBalance === 0) {
          toast.error("You have insufficient Sol");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          let payload: any = {
            amount,
            walletId,
          };
          toast.success("Your transaction is being processed. Please wait ");
          ApproveToken = await SendCustomSolanaToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else if (ApproveToken) {
            const GetUpdateCurrncy = await DepositToOutlandOdyssey(amount);
            setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
            setUpdateBalance(true);
            setLoader(false);
            setAmount(0);
          }
        }
      }
    } else if (transactionsValue === "withdraw") {
      if (selectedValue === "Binance") {
        if (!Binance) return toast.error("Connect your wallet");
        if (amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (amount > OutlandOdyssey) {
          toast.error("you have insufficient tokens to withdraw");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          const payload: any = {
            amount,
            Binance,
            walletId,
          };
          toast.success("Your transaction is being processed. Please wait");
          ApproveToken = await TransferBSCToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else {
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
            setUpdateBalance(true);
            setLoader(false);
            setAmount(0);
          }
        }
      } else if (selectedValue === "Solana") {
        if (!Solana) return toast.error("Connect your wallet");
        if (amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (amount > OutlandOdyssey) {
          toast.error("you have insufficient tokens to withdraw");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          const payload: any = {
            amount,
            Solana,
            walletId,
          };
          toast.success("Your transaction is being processed. Please wait");
          ApproveToken = await TransferSolToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else {
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
            setUpdateBalance(true);
            setLoader(false);
            setAmount(0);
          }
        }
      }
    }
  };
  const scopePollingDetectionStrategy = () => {
    if (window.solana?.isPhantom) {
      return "Phantom";
    } else if (window.ethereum?.isMetaMask) {
      return "MetaMask";
    } else if (window.solflare?.isSolflare || window.SolflareApp) {
      return "Solflare";
    }
    return false;
  };
  useEffect(() => {
    if (isMobile) {
      const option = scopePollingDetectionStrategy();
      setShowWalletOption(option);
    }
    const wallet = Wallets
    setAddress(wallet);
  }, [address?.wallet?.bsc?.public_key]);
  useEffect(() => {
    getCurrencyAmount();
  }, [address?.wallet?.bsc?.public_key]);
  return (
    <div>
      <section className="token-management">
        <Container>
          <div className="custom-container">
            <h2 className="mb-3">Tokens Management</h2>
            <div className="box-wrapper">
              <fieldset>
                <legend className="token-counts">Wallet</legend>
                {!address ? (
                  <div className=" d-flex justify-content-center">
                    <Wallet GetWalletHandler={setModelValue} />
                  </div>
                ) : (
                  <div className="fields-wrapper">
                    <div className="field-wrapper">
                      <div className=" d-flex justify-content-center">
                        <Wallet GetWalletHandler={setModelValue} />
                      </div>
                      <div
                        className="token-radio-buttons jss108 d-flex"
                        onChange={handleChange}
                      >
                        {showWalletOption === "MetaMask" ? (
                          <div className="d-flex align-items-center me-5">
                            <input
                              type="radio"
                              value="Binance"
                              name="wallet"
                              checked={
                                selectedValue === "Binance" ? true : false
                              }
                              style={{ marginRight: "5px" }}
                              onChange={(e: any) => e}
                            />
                            Binance
                          </div>
                        ) : showWalletOption === "Phantom" ||
                          showWalletOption === "Solflare" ? (
                          <div className="d-flex align-items-center">
                            <input
                              type="radio"
                              value="Solana"
                              name="wallet"
                              checked={
                                selectedValue === "Solana" ? true : false
                              }
                              style={{ marginRight: "5px" }}
                              onChange={(e: any) => e}
                            />{" "}
                            Solana
                          </div>
                        ) : (
                          <>
                            {" "}
                            <div className="d-flex align-items-center me-5">
                              <input
                                type="radio"
                                value="Binance"
                                name="wallet"
                                checked={
                                  selectedValue === "Binance" ? true : false
                                }
                                style={{ marginRight: "5px" }}
                                onChange={(e: any) => e}
                              />
                              Binance
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                type="radio"
                                value="Solana"
                                name="wallet"
                                checked={
                                  selectedValue === "Solana" ? true : false
                                }
                                style={{ marginRight: "5px" }}
                                onChange={(e: any) => e}
                              />{" "}
                              Solana
                            </div>
                          </>
                        )}
                      </div>
                      {selectedValue === "Binance" ||
                      selectedValue === "Solana" ? (
                        <div className="btn-wrapper d-flex justify-content-center">
                          {selectedValue === "Binance" ? (
                            <div>
                              <BSCWallet
                                disconectHandler={setModelValue}
                                updateBalance={updateBalance}
                              />
                            </div>
                          ) : (
                            <SolanaWallet
                              disconectHandler={setModelValue}
                              updateBalance={updateBalance}
                            />
                          )}
                        </div>
                      ) : null}

                      {loader ? <FullPageLoader /> : null}
                      <div>
                        {selectedValue ? (
                          <div className="outland-wraper">
                            <legend className="amount-text">
                              OutlandOdyssey Amount:{" "}
                              {OutlandOdyssey || OutlandOdyssey === 0 ? (
                                OutlandOdyssey
                              ) : (
                                <div className="spinner-border" role="status">
                                  <span className="sr-only"></span>
                                </div>
                              )}
                            </legend>
                            <div className="col-6 mt-3">
                              <Form>
                                <Form.Group
                                  className="mb-3 styled-input-fields"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="text"
                                    value={amount}
                                    placeholder="Enter amount"
                                    onChange={handleAmountChange}
                                  />
                                </Form.Group>
                                <div
                                  className="transfer-wallet-radio"
                                  onChange={handleTransactionChange}
                                >
                                  <div className="d-flex align-items-center me-5">
                                    <input
                                      type="radio"
                                      value="Deposit"
                                      checked={
                                        transactionsValue === "Deposit"
                                          ? true
                                          : false
                                      }
                                      style={{ marginRight: "5px" }}
                                      name="wallet"
                                    />
                                    Deposit-To-OutlandOdyssey
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      value="withdraw"
                                      name="wallet"
                                      style={{ marginRight: "5px" }}
                                      checked={
                                        transactionsValue === "withdraw"
                                          ? true
                                          : false
                                      }
                                    />
                                    Transfer-To-Wallet
                                  </div>
                                </div>
                                {/* <div className="d-flex justify-content-center align-items-center"> */}
                                <button
                                  className="select-wallet-btn btn btn-primary"
                                  onClick={handleTransaction}
                                >
                                  Submit
                                </button>
                                {/* </div> */}
                              </Form>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3">Select the Wallet </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </fieldset>
            </div>
          </div>
          <ToastContainer />
        </Container>
      </section>
    </div>
  );
};

export default TokenManage;
