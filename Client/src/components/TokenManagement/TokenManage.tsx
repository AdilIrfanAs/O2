import { useState, useEffect ,ChangeEvent } from "react";
import { Container, Form } from "react-bootstrap";
import { Wallet } from "../../utils/SolanaConnection/SolanaWallet";
import { OnboardingButton } from "../../utils/web3Connection/MetaMask.web3";
import { GetCurrencyAmount } from "../../utils/api/Web3.api";
import { ToastContainer, toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import {
  getbalance,
  Approve,
  DepositOutlandOdyssey,
} from "../../utils/web3Connection/web3";
import {
  DepositOutlandOdysseySolana,
  getSolanaTokenBalance,
} from "../../utils/SolanaConnection/SolanaPhantom";
import {token } from "../../utils/sharedVariable"
import {
  getSolflareTokenBalance,
  DepositOutlandOdysseySolflare,
} from "../../utils/SolanaConnection/SolanaSolflare";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import {
  DepositToOutlandOdyssey,
  TransferBSCToken,
  TransferSolToken,
  TransferToWallet,
} from "../../utils/api/Web3.api";
declare var window: any;
const TokenManage = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [OutlandOdyssey, setOutlandOdyssey] = useState(null);
  const [address, setAddress] = useState(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [transactionsValue, setTransactionsValue] = useState("Deposit");
  const [showWalletOption, setShowWalletOption] = useState(null);
  const hasDecimal = (num) => {
    return !!(num % 1);
  };
  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };
  const getCurrencyAmount = async () => {
    if (token) {
      const response = await GetCurrencyAmount(token);
      setOutlandOdyssey(response.data.FunctionResult.amount);
    }
  };
  const handleTransactionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransactionsValue(e.target.value);
  };

  const handleTransaction = async (e: any) => {
    e.preventDefault();
    const Solana = localStorage.getItem("publickey");
    const Binance = localStorage.getItem("walletAddress");
    if (transactionsValue === "Deposit") {
      if (selectedValue === "Binance") {
        const windowSelectedAddress = window.ethereum.selectedAddress;
        const BSCLocalStorageAddress = localStorage.getItem("walletAddress");
        if (windowSelectedAddress != BSCLocalStorageAddress)
          return toast.error("Connect your wallet");
        const accountBalance: number = await getbalance(Binance);
        const tansferToken: number = amount * 1000000000000000000;
        if (!tansferToken || amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (tansferToken > accountBalance) {
          toast.error("You have insufficient tokens");
        } else {
          let ApproveToken = " ";
          setLoader(true);
          ApproveToken = await Approve(amount);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else {
            const transferToken: any = await DepositOutlandOdyssey(
              amount,
              "6229dca1da80b808ccb6e57d",
              Binance
            );
            if (transferToken) {
              const GetUpdateCurrncy = await DepositToOutlandOdyssey(amount);
              setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
            }
            setLoader(false);
            setAmount(0);
          }
        }
      } else if (selectedValue === "Solana") {
        const address = localStorage.getItem("publickey");
        let Walletname = JSON.parse(localStorage.getItem("walletName"));
        const wallet = localStorage.getItem("walletAddress");
        if (!address && !Walletname) return toast.error("Connect your wallet");

        let solanaTokenBalance = null;
        if (Walletname === "Phantom") {
          solanaTokenBalance = await getSolanaTokenBalance(address);
        } else {
          solanaTokenBalance = await getSolflareTokenBalance(address);
        }
        const tansferToken: number = amount * 1000000000;

        if (!amount || amount <= 0) {
          toast.error("Please Enter Valid Amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else if (tansferToken > solanaTokenBalance) {
          toast.error("You have insufficient tokens");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          if (Walletname === "Phantom") {
            ApproveToken = await DepositOutlandOdysseySolana(
              Solana,
              "6229dca1da80b808ccb6e57d",
              amount
            );
            if (!ApproveToken) {
              setLoader(false);
              setAmount(0);
              toast.error("Your Transaction is rejected. Please try again");
            } else if (ApproveToken) {
              const GetUpdateCurrncy = await DepositToOutlandOdyssey(amount);
              setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
              setLoader(false);
            }
            setAmount(0);
          } else {
            ApproveToken = await DepositOutlandOdysseySolflare(
              Solana,
              "6229dca1da80b808ccb6e57d",
              amount
            );
            if (!ApproveToken) {
              setLoader(false);
              setAmount(0);
              toast.error("Your Transaction is rejected. Please try again");
            } else if (ApproveToken) {
              const GetUpdateCurrncy = await DepositToOutlandOdyssey(amount);
              setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
              setLoader(false);
            }
            setAmount(0);
            window.scroll(0, 0);
          }
        }
      }
    } else if (transactionsValue === "withdraw") {
      if (selectedValue === "Binance") {
        const windowSelectedAddress: any = window.ethereum.selectedAddress;
        const BSCLocalStorageAddress = localStorage.getItem("walletAddress");
        if (windowSelectedAddress != BSCLocalStorageAddress)
          return toast.error("Connect your wallet");
        if (amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          const Binance: any = windowSelectedAddress;
          const payload: any = {
            amount,
            Binance,
          };
          toast.success("Your transaction is being processed. Please wait");
          ApproveToken = await TransferBSCToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else {
            setLoader(false);
            setAmount(0);
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            setOutlandOdyssey(GetUpdateCurrncy?.data.FunctionResult.amount);
            //  const GetUpdateCurrncy = await getCurrencyAmount();
          }
        }
      } else if (selectedValue === "Solana") {
        const address = localStorage.getItem("publickey");
        let Walletname = JSON.parse(localStorage.getItem("walletName"));
        if (!address && !Walletname) return toast.error("Connect your wallet");
        if (amount <= 0) {
          toast.error("Please enter valid amount");
        } else if (hasDecimal(amount)) {
          toast.error("Decimal numbers are not allowed");
        } else {
          let ApproveToken: any = " ";
          setLoader(true);
          const Solana = address;
          const payload: any = {
            amount,
            Solana,
          };
          toast.success("Your transaction is being processed. Please wait");
          ApproveToken = await TransferSolToken(payload);
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          } else {
            setLoader(false);
            setAmount(0);
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            setOutlandOdyssey(GetUpdateCurrncy.data.FunctionResult.amount);
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
    getCurrencyAmount();
    if (isMobile) {
      const option = scopePollingDetectionStrategy();
      setShowWalletOption(option);
    }
  }, []);

  return (
    <div>
      <section className="token-management">
        <Container>
          <div className="custom-container">
            <h2 className="mb-3">Tokens Management</h2>
            <div className="box-wrapper">
              <fieldset>
                <legend className="token-counts">Wallet</legend>

                <div className="fields-wrapper">
                  <div className="field-wrapper">
                    {/* <label htmlFor="currency" className="form-label">
                      Wallet
                    </label> */}
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
                            checked={selectedValue === "Binance" ? true : false}
                            style={{ marginRight: "5px" }}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => e}
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
                            checked={selectedValue === "Solana" ? true : false}
                            style={{ marginRight: "5px" }}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => e}
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
                              onChange={(e: ChangeEvent<HTMLInputElement>) => e}
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
                              onChange={(e: ChangeEvent<HTMLInputElement>) => e}
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
                            <OnboardingButton />
                          </div>
                        ) : (
                          <Wallet />
                        )}
                      </div>
                    ) : null}

                    {loader ? <FullPageLoader /> : null}
                    <div>
                      {selectedValue ? (
                        <div className="outland-wraper">
                          <legend className="amount-text">
                            OutlandOdyssey Amount:{" "}
                            {OutlandOdyssey ? (
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
