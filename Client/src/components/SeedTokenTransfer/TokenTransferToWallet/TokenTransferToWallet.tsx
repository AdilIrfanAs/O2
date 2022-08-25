import { useState, useEffect, ChangeEvent } from "react";
import "../TokenTransferToGame/TokenTransferToGame.css";
import { Form, Dropdown } from "react-bootstrap";
import tokenImg from "../../../assets/images/green-coin.svg";
import { toast } from "react-toastify";
import transectionComplete from "../../../assets/images/transection-complete.png";
import tokenBg from "../../../assets/images/token-trans-bg2.png"
import "fa-icons";
import "font-awesome/css/font-awesome.min.css";
import { FaCheck } from "react-icons/fa";
import {
  TransferBSCToken, TransferSolToken, TransferToWallet, withdrawFees, SendCustomSolanaToken, withdrawFeesOfSolanaWallet, SendCustomBSCToken
} from "../../../utils/api/Web3.api";
import { Link } from "react-router-dom";
import LoaderAnim from "../../../assets/images/loader-anim.png";
import SolanaIcon from "../../../assets/images/solana.svg";
import BinanceIcon from "../../../assets/images/binance.svg"
import LoaderArrow from "../../../assets/images/loader-arrow.svg";
import { Wallets } from "../../../utils/sharedVariable"
const TokenTransferToWallet = (props: any) => {
  const [submitChange, setSubmitChange] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [WalletAddress, setWalletAddress] = useState(null);
  const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
  const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [bscBalance, setBscBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
  const [submitSuccessfull, setSubmitSuccessfull] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [selectTokenOption, setSelectTokenOption] = useState<string>("");
  const [availableTokens, setAvailableTokens] = useState<number>(0);
  const [shillToken, setShillToken] = useState<number>(0);
  const [solanaShillToken, setSolanaShillToken] = useState<number>(0);

  const hasDecimal = (num) => {
    return !!(num % 1);
  };

  const handleOptionsClick = (options: string) => {
    setSelectTokenOption(options);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setSubmitSuccessfull(false);
    setTransferAmount(amount);
    let minShillamount: number = 0.5;

    if (selectedWallet === "Binance") {

      const walletId: number = Wallets?.wallet?._id;
      const Binance = Wallets?.wallet?.bsc.public_key;

      if (!amount || amount <= 0) {
        toast.error("Please enter valid amount");
      } else if (hasDecimal(amount)) {
        toast.error("Decimal numbers are not allowed");
      } else if (Number(amount) > Number(availableTokens)) {
        toast.error("You have insufficient O2 tokens");
      } else if (shillToken < minShillamount) {
        toast.error("You have insufficient shill tokens");
      } else {
        let ApproveToken: any = " ";
        let payload: any = {
          amount,
          Binance,
          walletId,
        };
        toast.success("Your transaction is being processed. Please wait ");
        setSubmitChange(true);
        ApproveToken = await TransferBSCToken(payload);

        if (!ApproveToken) {
          setAmount(0);
          toast.error("Your transaction is rejected. Please try again");
          setSubmitChange(false);
        } else if (ApproveToken) {
          const withdrawFeesResponse = await withdrawFees(walletId);

          if (!withdrawFeesResponse) {
            await SendCustomBSCToken(payload);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
            setSubmitChange(false);
          } else {
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            if (GetUpdateCurrncy?.data.FunctionResult.isSuccess) {
              setAvailableTokens(GetUpdateCurrncy?.data.FunctionResult.amount);
              setSubmitChange(false);
              props.BalanceUpdate(true);
              setSubmitSuccessfull(true);
            }
            else {
              await SendCustomBSCToken(payload);
              setAmount(0);
              toast.error("Your transaction is rejected. Please try again");
              setSubmitChange(false);
            }
          }
        }
      }
    } else if (selectedWallet === "Solana") {
      const walletId: number = Wallets?.wallet?._id;
      const Solana = Wallets?.wallet?.sol.public_key;

      if (!amount || amount <= 0) {
        toast.error("Please enter valid amount");
      } else if (hasDecimal(amount)) {
        toast.error("Decimal numbers are not allowed");
      } else if (Number(amount) > Number(availableTokens)) {
        toast.error("You have insufficient tokens");
      } else if (solanaShillToken < minShillamount) {
        toast.error("You have insufficient shill tokens");
      } else {
        let ApproveToken: any = " ";
        let payload: any = {
          amount,
          Solana,
          walletId,
        };
        toast.success("Your transaction is being processed. Please wait ");
        setSubmitChange(true);
        ApproveToken = await TransferSolToken(payload);

        if (!ApproveToken) {
          setAmount(0);
          toast.error("Your transaction is rejected. Please try again");
          setSubmitChange(false);
        } else if (ApproveToken) {
          const withdrawFeeResponse = await withdrawFeesOfSolanaWallet(
            walletId,
            false
          );
          if (!withdrawFeeResponse) {
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
            setSubmitChange(false);
          } else {
            const GetUpdateCurrncy: any = await TransferToWallet(amount);
            if (GetUpdateCurrncy?.data.FunctionResult.isSuccess) {
              setAvailableTokens(GetUpdateCurrncy?.data.FunctionResult.amount);
              setSubmitChange(false);
              props.BalanceUpdate(true);
              setSubmitSuccessfull(true);
            }
            else {
              toast.error("Your transaction is rejected. Please try again");
              await withdrawFeesOfSolanaWallet(
                walletId,
                true
              );
              await SendCustomSolanaToken(payload)
              setSubmitChange(false);
              props.BalanceUpdate(true);
              setSubmitSuccessfull(true);
            }
          }
        }
      }
    }
  };

  const handleMax = () => {
    if (selectedWallet === "Binance") {
      setAmount(availableTokens);
    } else {
      setAmount(availableTokens);
    }
  };

  useEffect(() => {
    if (selectedWallet === "Binance") {
      let wallet = props.WalletAddress;
      setWalletAddress(wallet?.wallet?.bsc.public_key);
      setBscTokenbalance(props.BscTokenBalance);
      setBscBalance(props.BscBalance);
      setAmount(0);
      props.BalanceUpdate(false);
      setShillToken(props.ShillToken);
    } else {
      let wallet = props.WalletAddress;
      setWalletAddress(wallet?.wallet?.sol.public_key);
      setSolTokenbalance(props.SolTokenBalance);
      setSolBalance(props.SolBalance);
      setO2SolContractToken(props.O2SolContractToken);
      setSolanaShillToken(props.SolanaShillToken);
      setAmount(0);
      props.BalanceUpdate(false);
    }
    setAvailableTokens(props.O2AvailableTokens)
  }, [
    selectedWallet, props.SolTokenBalance, props.BscTokenBalance, props.BscBalance, props.SolBalance, props.O2AvailableTokens,
    props.O2SolContractToken, props.O2ContractToken, props.ShillToken, props.SolanaShillToken, props.ShillAvailableTokens,
  ]);

  useEffect(() => {
    setSelectedWallet(props.selectedWallet);
  }, [props.selectedWallet]);

  return (
    <>
      <div>
        <div
          className={` ${submitChange
            ? "transferheight"
            : submitSuccessfull === true
              ? "transferheight"
              : ""
            }`}
        >
          <div className="token-transfer-form fram position-relative">
            <h3 className="fram-title theme-color">
              Withdraw Token
            </h3>
            <Form className="fram-content">
              <div className="wrap-token">
                <div className="wrap-token-title text-center">
                  <p>
                    Input your token withdraw amount.
                  </p>
                </div>
              </div>
              <div className="form-group d-flex flex-column mb-sm-4 mb-2 position-relative">
                <label>Wallet Address</label>
                <div className="input-shell d-flex justify-content-between align-items-center mb-2 border-0">
                  <div className="amount-field">
                    <input
                      className="border-0 bg-transparent w-100 p-0"
                      type="text"
                      placeholder="Wallet Address"
                      value={WalletAddress}
                      readOnly
                      defaultChecked
                    />
                  </div>
                  <Dropdown className="input-dropdown  mx-auto position-sm-relative">
                    <div className="dropdown-button--bg">
                      <Dropdown.Toggle
                        className="d-flex justify-content-between align-items-center p-0"
                        variant="default"
                        id="dropdown-basic"
                      >
                        <div className="d-flex align-items-center ms-3">
                          <figure className="mb-0 me-md-3 me-2">
                            <img src={selectedWallet == "Binance" ? BinanceIcon : SolanaIcon} />
                          </figure>
                          <p className="text-uppercase text-white">{selectedWallet}</p>
                        </div>
                      </Dropdown.Toggle>
                    </div>
                    <Dropdown.Menu className="dropdown-button--bg position-absolute w-100">
                      <div className="img-input px-0 w-100">
                        <Dropdown.Item
                          className="d-flex justify-content-between align-items-center pe-3 py-2"
                          onClick={() => props.WalletUpdate("Binance")}
                        >
                          <div className="d-flex align-items-center">
                            <figure className="mb-0 me-md-3 me-2">
                              <img src={BinanceIcon} alt="binance icon" />
                            </figure>
                            <p className="text-uppercase text-white">Binance</p>
                          </div>
                          <span className="text-white">
                            <FaCheck />
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="d-flex justify-content-between align-items-center pe-3 py-2"
                          onClick={() => props.WalletUpdate("Solana")}
                        >
                          <div className="d-flex align-items-center">
                            <figure className="mb-0 me-md-3 me-2">
                              <img src={SolanaIcon} alt="Solana icon" />
                            </figure>
                            <p className="text-uppercase text-white">Solana</p>
                          </div>
                          <span className="text-white">
                            <FaCheck />
                          </span>
                        </Dropdown.Item>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="form-group d-flex flex-column mb-sm-5 mb-3 position-relative">
                <label>
                  <div className="d-flex justify-content-between align-items-center">
                    <p>Amount</p>
                    <span className="small-text">≈$XXX,XXX,XXX.XX</span>
                  </div>
                </label>
                <div className="input-shell d-flex justify-content-between align-items-center mb-2">
                  <div className="amount-field">
                    <input
                      className="border-0 bg-transparent w-100 p-0"
                      type="number"
                      placeholder="Input Amount to deposit"
                      value={amount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setAmount(Number(e.target.value));
                      }}
                    />
                  </div>
                  <Dropdown className="input-dropdown mx-auto position-sm-relative">
                    <div className="dropdown-button--bg">
                      <Dropdown.Toggle
                        className="d-flex justify-content-between align-items-center p-0"
                        variant="default"
                        id="dropdown-basic"
                      >
                        <div className="d-flex align-items-center ms-3">
                          <figure className="mb-0 me-md-3 me-2">
                            <img src={tokenImg} alt="token icon" />
                          </figure>
                          <p className="text-uppercase text-white">O2</p>
                        </div>
                      </Dropdown.Toggle>
                    </div>

                    <Dropdown.Menu className="dropdown-button--bg position-absolute ">
                      <div className="img-input px-0  w-100">
                        <Dropdown.Item
                          className="d-flex justify-content-between align-items-center pe-3 py-2"
                          onClick={() => handleOptionsClick("O2")}
                        >
                          <div className="d-flex align-items-center">
                            <figure className="mb-0 me-md-3 me-2">
                              <img src={tokenImg} alt="token icon" />
                            </figure>
                            <p className="text-uppercase text-white">O2</p>
                          </div>
                          <span className="text-white">
                            <FaCheck />
                          </span>
                        </Dropdown.Item>
                        {/* <Dropdown.Item
                        className="d-flex justify-content-between align-items-center px-3 py-2"
                        onClick={() => handleOptionsClick("O2")}
                      >
                        <div className="d-flex align-items-center ms-1">
                          <figure className="mb-0 me-md-3 me-2">
                            <img src={tokenImg}></img>
                          </figure>
                          <p className="text-uppercase text-white">O2</p>
                        </div>
                        <span className="text-white">
                          <FaCheck />
                        </span>
                      </Dropdown.Item> */}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="small-text">
                    Available in wallet:{" "}
                    {availableTokens - amount}
                  </span>
                  <span
                    className="theme-color theme-border-b text-uppercase x-small-font"
                    onClick={handleMax}
                  >
                    max
                  </span>
                </div>

                <label>Transaction Fee</label>
                <div className="dark-bar">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <figure className="mb-0 me-md-4 me-2">
                        <img src={tokenImg}></img>
                      </figure>
                      <p>Amount of O2 in wallet</p>
                    </div>
                    <span className="small-text">
                      {" "}
                      {selectedWallet === "Binance"
                        ? bscTokenBalance
                        : solTokenBalance}{" "}
                      O2
                    </span>
                  </div>
                </div>
              </div>
              <Link
                className="token-trans-link text-center position-relative me-0"
                to="/SeedTokenTransfer" onClick={submit}
              >
                <figure className="mb-0">
                  <img className="img-fluid" src={tokenBg} alt="token-bg" />
                </figure>
                <span>Withdraw Token to Wallet</span>
              </Link>
            </Form>
          </div>
          <div className="fram-title mb-md-5 mb-3">
            <h3>Withdrawing token</h3>
          </div>
        </div>
        <div>
          <div
            className={`transfer-token token-transfer-form fram position-relative mb-5 ${submitChange || submitSuccessfull ? "transfer-token-block" : ""
              }`}
          >
            <h3 className="fram-title">
              TRANSFER TOKEN TO WALLET
            </h3>
            <p className="fram-content text-center">
              You will transfer {transferAmount} (O2) from your game account to &nbsp;
              {selectedWallet === "Binance"
                ? process.env.REACT_APP_BSC_O2_CONTRACT_ADDRESS
                : process.env.REACT_APP_SOL_O2_PUBLIC_KEY}
              .
            </p>
          </div>
        </div>
        {submitSuccessfull === false ? (
          <div>
            <div
              className={`loader token-transfer-form fram position-relative mb-5  ${submitChange ? "setheight" : ""
                }`}
            >
              <h3 className="fram-title">
                WITHDRAWING TOKEN{" "}
              </h3>
              <div className="loader-header">
                <p>Complete transaction in your wallet app/extention.</p>
              </div>
              <div className="main-loader position-relative">
                <div className="loader-image rotate text-center">
                  <img src={LoaderAnim} alt="" />
                </div>
                <div className="loader-arrow">
                  <img src={LoaderArrow} alt="" />
                </div>
              </div>
              <p className="loader-text text-center fram-content">
                Tokens will be sent into the wallet once the transaction is
                complete.
              </p>
            </div>
            <h3 className={`fram-title mb-5 transfer-token ${submitChange ? "transfer-token-block" : ""
              }`}>
              Token Withdrawing Status
            </h3>
          </div>
        ) : submitSuccessfull === true ? (
          <div>
            <div className="token-transfer-form fram position-relative mb-5">
              <h3 className="fram-title">Withdrawing TOKEN </h3>
              <p className="fram-content text-center">Transaction successfull!</p>
            </div>
            <div className="transection-complete token-transfer-form fram position-relative">
              <h3 className="fram-title">
                TOKEN WITHDRAWING STATUS
              </h3>
              <div className="fram-content">
                <div className="transection-complete-header">
                  <p className="text-center">
                    {transferAmount} O2 have been deposited into your
                    game wallet.
                  </p>
                </div>
                <div className="transection-complete-tick position-relative">
                  <div className="tick-img text-center">
                    <img src={transectionComplete} alt="Tick Image" />
                  </div>
                  <div>
                    <Link to="/" className="token-trans-link position-relative d-block"
                      onClick={() => {
                        setSubmitSuccessfull(false);
                        setSubmitChange(false);
                        setAmount(0);
                      }}>
                      <figure className="mb-0">
                        <img className="img-fluid" src={tokenBg} alt="token-bg" />
                      </figure>
                      <span>Home</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default TokenTransferToWallet;
