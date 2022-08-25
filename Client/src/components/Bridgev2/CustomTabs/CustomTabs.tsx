import { getSolanaTokenBalance } from "../../../utils/SolanaConnection/SolanaPhantom";
import Accordion from "react-bootstrap/Accordion";
import { FC, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
  getbalance,
} from "../../../utils/web3Connection/web3";
import {
  SendCustomBSCToken,
  ExchangeTokentansfer,
  SendSolToken,
  SendBSCToken,
  SendCustomSolanaToken,
} from "../../../utils/api/Web3.api";
import FullPageLoader from "../../FullPageLoader/fullPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../utils/Custom-Wallet/SolanaWalletv2";
import BSCWallet from "../../../utils/Custom-Wallet/BSC";
import {Wallets} from "../../../utils/sharedVariable"
declare var window: any;

const CustomTabs: FC<any> = ({
  targetWallet,
  selectedWallet,
  walletAddress,
}: any) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const history = useNavigate();
  const tansferToken = async (e: any) => {
    e.preventDefault();
    if (selectedWallet === "Binance Smart Chain") {
      const solanaWallet = JSON.parse(localStorage.getItem("Wallets"));
      const BscWallet: any = JSON.parse(localStorage.getItem("Wallets"));
      if (!BscWallet?.wallet?.bsc?.public_key)
        return toast.error("Connect your source wallet");
      if (!solanaWallet?.wallet?.sol?.public_key) {
        return toast.error("Connect your target wallet");
      }
      const BscwalletAddress = BscWallet?.wallet?.bsc?.public_key;
      const walletId: number = BscWallet?.wallet?._id;
      const to = solanaWallet?.wallet?.sol?.public_key;
      const accountBalance: number = await getbalance(BscwalletAddress);
      const tansferToken: number = amount * 1000000000000000000;
      if (!tansferToken || amount <= 0) {
        toast.error("Please enter valid amount");
      } else if (tansferToken > accountBalance) {
        toast.error("You have insufficient tokens");
      } else {
        let ApproveToken: any = " ";
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
        } else {
          let txHash: string = ApproveToken?.receipt?.transactionHash;
          const address = BscWallet?.wallet?.bsc?.public_key;
          payload = {
            txHash,
            amount,
            address,
            to,
            fromCurrency: "BSC", //BSC, SOL
            toCurrency: "SOL", //BSC, SOL
            walletId,
            status: false,
          };
          const exchange: any = await ExchangeTokentansfer(payload);
          let exchangeId = exchange.data.data._id;
          if (exchange) {
            toast.success("Tokens are trasferring to target account.");
            payload = {
              to,
              amount,
              exchangeId,
            };
            const result = await SendSolToken(payload);
            if (result) {
              toast.success("Tokens are transferred successfully");
              setLoader(false);
              setAmount(0);
              window.scroll(0, 0);
              history("/bridge-v2");
            } else {
              toast.error(exchange?.message);
              setLoader(false);
              setAmount(0);
              window.scroll(0, 0);
              history("/bridge-v2");
            }
          } else {
            toast.error(exchange?.message);
            setLoader(false);
            setAmount(0);
            window.scroll(0, 0);
            history("/bridge-v2");
          }
        }
      }
    } else if (selectedWallet === "Solana") {
      const solanaWallet = JSON.parse(localStorage.getItem("Wallets"));
      if (!solanaWallet?.wallet?.sol?.public_key)
        return toast.error("Connect your source wallet");
      const address = solanaWallet?.wallet?.sol?.public_key;
      const BscWallet: any = JSON.parse(localStorage.getItem("Wallets"));
      if (!BscWallet) {
        return toast.error("Connect your target wallet");
      }
      const walletId: number = solanaWallet?.wallet?._id;
      const to = BscWallet?.wallet?.bsc?.public_key;
      const solanaTokenBalance = await getSolanaTokenBalance(address);
      const tansferToken: number = amount * 1000000000;
      if (!amount || amount <= 0) {
        toast.error("Please Enter Valid Amount");
      } else if (tansferToken > solanaTokenBalance) {
        toast.error("You have insufficient tokens");
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
        } else {
          let txHash: string = ApproveToken?.receipt?.transactionHash;
          const address = solanaWallet?.wallet?.sol?.public_key;
          payload = {
            txHash,
            amount,
            address,
            to,
            fromCurrency: "BSC", //BSC, SOL
            toCurrency: "SOL", //BSC, SOL
            walletId,
            status: false,
          };
          const exchange: any = await ExchangeTokentansfer(payload);
          let exchangeId = exchange.data.data._id;
          if (exchange) {
            toast.success("Tokens are trasferring to target account.");
            payload = {
              to,
              amount,
              exchangeId,
            };
            const result = await SendBSCToken(payload);
            if (result) {
              toast.success("Tokens are transferred successfully");
              setLoader(false);
              setAmount(0);
              window.scroll(0, 0);
              history("/bridge-v2");
            } else {
              toast.error(exchange?.message);
              setLoader(false);
              setAmount(0);
              window.scroll(0, 0);
              history("/bridge-v2");
            }
          } else {
            toast.error(exchange?.message);
            setLoader(false);
            setAmount(0);
            window.scroll(0, 0);
            history("/bridge-v2");
          }
        }
      }
    }
  };

  useEffect(() => {
    setAmount(0);
  }, [targetWallet]);
  return (
    <div className="tabs-for-tokens ">
      {loader ? (
        <FullPageLoader />
      ) : (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="1" className="mt-4" id="target">
            <Accordion.Header>2. Target</Accordion.Header>
            <Accordion.Body>
              {targetWallet === "Select options" ? (
                <p>Please select your target option</p>
              ) : (
                <div className="row mt-2">
                  <div className="col-md-6">
                    <Form.Group
                      className="mb-3 styled-input-fields"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control type="text" value={targetWallet} readOnly/>
                    </Form.Group>
                  </div>
                  {targetWallet === "Binance Smart Chain" ||
                  targetWallet === "Solana" ? (
                    <div className="btn-wrapper d-flex justify-content-center">
                      {targetWallet === "Binance Smart Chain" ? (
                        <div>
                          <BSCWallet />
                        </div>
                      ) : (
                        <CustomButton />
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="mt-4">
            <Accordion.Header>3. send Tokens</Accordion.Header>
            <Accordion.Body>
              {targetWallet === "Select options" ||
              selectedWallet === "Select options" ? (
                <p>Please select your target option </p>
              ) : (
                <form>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <Form.Group
                        className="mb-3 styled-input-fields"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control
                          type="number"
                          placeholder="Enter the amount"
                          value={amount}
                          onChange={(e: any) => setAmount(e.target.value)}
                          min="0"
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      onClick={tansferToken}
                      className="select-wallet-btn btn btn-primary"
                    >
                      {" "}
                      Submit{" "}
                    </button>
                  </div>
                </form>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
      <ToastContainer />
    </div>
  );
};

export default CustomTabs;
