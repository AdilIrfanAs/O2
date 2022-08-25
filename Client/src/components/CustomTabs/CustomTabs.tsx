import { Wallet } from "../../utils/SolanaConnection/SolanaWallet";
import {
  sendSPLToken,
  getSolanaTokenBalance,
} from "../../utils/SolanaConnection/SolanaPhantom";
import { OnboardingButton } from "../../utils/web3Connection/MetaMask.web3";
import Accordion from "react-bootstrap/Accordion";
import { FC, useState, useEffect } from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { getbalance, Approve, Transfer } from "../../utils/web3Connection/web3";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSolflareTokenBalance,
  sendTokenfromSolFlare,
} from "../../utils/SolanaConnection/SolanaSolflare";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

declare var window: any;

const CustomTabs: FC<any> = ({
  targetWallet,
  selectedWallet,
  walletAddress,
}: any) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [targetWalletAddress, setTargetWalletAddress] = useState<string | null>(
    null
  );
  const history = useNavigate();
  const tansferToken = async (e: any) => {
    e.preventDefault();
    const wallet = localStorage.getItem("publickey");
    const walletName = localStorage.getItem("walletName");
    if (selectedWallet === "Binance Smart Chain") {
      const windowSelectedAddress = window.ethereum.selectedAddress;
      const BSCLocalStorageAddress = localStorage.getItem("walletAddress");
      if (windowSelectedAddress != BSCLocalStorageAddress)
        return toast.error("Connect your source wallet");
      if (isMobile === true && !targetWalletAddress) {
        return toast.error("Enter your target address");
      } else if (isMobile === false && !wallet && !walletName) {
        return toast.error("Connect your target wallet");
      }

      const address = localStorage.getItem("publickey") || targetWalletAddress;
      const accountBalance: number = await getbalance(walletAddress);
      const tansferToken: number = amount * 1000000000000000000;
      if (!tansferToken || amount <= 0) {
        toast.error("Please enter valid amount");
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
          const transferToken = await Transfer(
            amount,
            "6229dca1da80b808ccb6e57d",
            address
          );
          if (!transferToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your transaction is rejected. Please try again");
          }
          setLoader(false);
          setAmount(0);
          window.scroll(0, 0);
          history("/");
        }
      }
    } else if (selectedWallet === "Solana") {
      if (!localStorage.getItem("publickey"))
        return toast.error("Connect your source wallet");
      const address = localStorage.getItem("publickey");
      const wallet = localStorage.getItem("walletAddress");
      let Walletname = JSON.parse(localStorage.getItem("walletName"));
      if (isMobile === true && !targetWalletAddress) {
        return toast.error("Enter your target address");
      } else if (isMobile === false && !wallet) {
        return toast.error("Connect your target wallet");
      }
      const MetaMaskAddress =
        targetWalletAddress || window.ethereum.selectedAddress;
      let solanaTokenBalance = null;
      if (Walletname === "Phantom") {
        solanaTokenBalance = await getSolanaTokenBalance(address);
      } else {
        solanaTokenBalance = await getSolflareTokenBalance(address);
      }
      const tansferToken: number = amount * 1000000000;
      if (!amount || amount <= 0) {
        toast.error("Please Enter Valid Amount");
      } else if (tansferToken > solanaTokenBalance) {
        toast.error("You have insufficient tokens");
      } else {
        let ApproveToken: any = " ";
        setLoader(true);
        if (Walletname === "Phantom") {
          ApproveToken = await sendSPLToken(
            address,
            "6229dca1da80b808ccb6e57d",

            amount,
            MetaMaskAddress
          );
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your Transaction is rejected. Please try again");
          } else if (ApproveToken) {
            setLoader(false);
          }
          setAmount(0);
          window.scroll(0, 0);
          history("/");
        } else {
          ApproveToken = await sendTokenfromSolFlare(
            address,
            "6229dca1da80b808ccb6e57d",
            amount,
            MetaMaskAddress
          );
          if (!ApproveToken) {
            setLoader(false);
            setAmount(0);
            toast.error("Your Transaction is rejected. Please try again");
          } else if (ApproveToken) {
            setLoader(false);
          }
          setAmount(0);
          window.scroll(0, 0);
          history("/");
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
                    {isMobile ? (
                      <p className="justify-content">
                        {" "}
                        The network you have selected is {targetWallet}.Please
                        ensure that the target address supports the{" "}
                        {targetWallet}.You will lose your assets if the choosen
                        platform does not support retrieval.
                      </p>
                    ) : null}
                    <Form.Group
                      className="mb-3 styled-input-fields"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control type="text" value={targetWallet} readOnly />
                    </Form.Group>
                  </div>
                  {isMobile ? (
                    <form>
                      {" "}
                      <Form.Group
                        className="mb-3 styled-input-fields"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control
                          type="text"
                          value={targetWalletAddress}
                          onChange={(e: any) => {
                            e.preventDefault();
                            setTargetWalletAddress(e.target.value);
                          }}
                          required
                        />
                      </Form.Group>
                    </form>
                  ) : (
                    <div>
                      {" "}
                      {targetWallet === "Binance Smart Chain" ||
                        targetWallet === "Solana" ? (
                        <div className="btn-wrapper d-flex justify-content-center">
                          {targetWallet === "Binance Smart Chain" ? (
                            <div>
                              <OnboardingButton />
                            </div>
                          ) : (
                            <Wallet />
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
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
                          onChange={(e) => setAmount(Number(e.target.value))}
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
