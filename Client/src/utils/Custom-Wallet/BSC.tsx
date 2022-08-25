import React, { useState, useEffect, useRef } from "react";
import {
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import LoginPage from "./Login";
import { getbalance, getBscBalance } from "../../utils/web3Connection/web3";
import SignUpPage from "./SignUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const BscWalletv2 = () => {
  const [show, setShow] = useState(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const [exportShow, setExportShow] = useState(false);
  const [tokenBalance, setTokenbalance] = useState("");
  const [balance, setbalance] = useState("");
  const textAreaRef = useRef(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleExportClose = () => setExportShow(false);
  const handleExportShow = () => setExportShow(true);
  const setModelValue = async (value: any, address: any) => {
    setShow(value);
    setWalletKeys(address);
    const Tokenbalance: any =
      (await getbalance(address?.wallet?.bsc?.public_key)) /
      1000000000000000000;
    setTokenbalance(Tokenbalance);
    const balance: any =
      (await getBscBalance(address?.wallet?.bsc?.public_key)) /
      1000000000000000000;
    setbalance(balance);
  };
  const disconnect = () => {
    localStorage.removeItem("BSCWalletKeys");
    toast.success("Disconnected");
    setWalletKeys(null);
  };
  const getSolanabalance = async (data) => {
    const Tokenbalance: any =
      (await getbalance(data?.wallet?.bsc?.public_key)) / 1000000000000000000;
    setTokenbalance(Tokenbalance);
    const balance: any =
      (await getBscBalance(data?.wallet?.bsc?.public_key)) /
      1000000000000000000;
    setbalance(balance);
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("BSCWalletKeys"));
    setWalletKeys(data);
    getSolanabalance(data);
  }, []);
  return (
    <div>
      {walletKeys ? (
        <DropdownButton
          id="dropdown-basic-button"
          title={`${walletKeys?.wallet?.bsc?.public_key.substring(
            0,
            9
          )} ... ${walletKeys?.wallet?.bsc?.public_key.substring(35, 44)}`}
        >
          <Dropdown.Item
            onClick={() => {
              navigator.clipboard.writeText(
                walletKeys?.wallet?.bsc?.public_key
              );
              toast.success("copied");
            }}
          >
            Copy address
          </Dropdown.Item>
          <Dropdown.Item>{balance} BNB</Dropdown.Item>
          <Dropdown.Item>{tokenBalance} O2Token</Dropdown.Item>{" "}
          <Dropdown.Item onClick={handleExportShow}>
            Export Private key
          </Dropdown.Item>
          <Dropdown.Item onClick={disconnect}>Disconnect</Dropdown.Item>
        </DropdownButton>
      ) : (
        <Button
          className="select-wallet-btn btn btn-primary"
          onClick={handleShow}
        >
          Connect
        </Button>
      )}
      <Modal show={show}>
        <Modal.Header closeButton onHide={handleClose}></Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="login"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="login" title="Login">
              <LoginPage modelhandler={setModelValue} network={"1"} />
            </Tab>
            <Tab eventKey="signUp" title="SignUp">
              <SignUpPage modelhandler={setModelValue} network={"1"} />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal show={exportShow} onHide={handleExportClose}>
        <Modal.Body>
          <Form.Control
            as="textarea"
            value={walletKeys?.wallet?.bsc?.private_key}
            style={{ height: "100px" }}
            ref={textAreaRef}
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              navigator.clipboard.writeText(
                walletKeys?.wallet?.bsc?.private_key
              );
              textAreaRef.current.select();
              toast.success("copied");
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-center">
            {" "}
            <Button className="btn text-center" onClick={handleExportClose}>
              Ok, I've written this down
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BscWalletv2;
