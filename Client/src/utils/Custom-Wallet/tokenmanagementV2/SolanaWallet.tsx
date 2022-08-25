import { useState, useEffect, useRef } from "react";
import {
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  getSolanaTokenBalance,
  getSPlTokenBalance,
} from "./../../SolanaConnection/SolanaPhantom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Wallets ,expire } from "../../../utils/sharedVariable"
const SolanaWalletv2 = (props: any) => {
  const [show, setShow] = useState(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const [exportShow, setExportShow] = useState(false);
  const [tokenBalance, setTokenbalance] = useState("");
  const [balance, setbalance] = useState("");
  const [exprieDate, setExpireDate] = useState(1652093420);
  const textAreaRef = useRef(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleExportClose = () => setExportShow(false);
  const handleExportShow = () => setExportShow(true);
  const setModelValue = async (value: any, address: any) => {
    setShow(value);
    setWalletKeys(address);
    const tokenbalance: any =
      (await getSolanaTokenBalance(address?.wallet?.sol?.public_key)) /
      1000000000;
    setTokenbalance(tokenbalance);
    const balance: any =
      (await getSPlTokenBalance(address?.wallet?.sol?.public_key)) / 1000000000;
    setbalance(balance);
  };
  const disconnect = () => {
    localStorage.removeItem("Wallets");
    localStorage.removeItem("authorization");
    localStorage.removeItem("expire");
    toast.success("Disconnected");
    setWalletKeys(null);
    props.disconectHandler(null);
  };
  const getSolanabalance = async (data) => {
    const Tokenbalance: any =
      (await getSolanaTokenBalance(data?.wallet?.sol?.public_key)) / 1000000000;
    const balance: any =
      (await getSPlTokenBalance(data?.wallet?.sol?.public_key)) / 1000000000;
    setbalance(balance);
    setTokenbalance(Tokenbalance);
  };
  useEffect(() => {
    const data = Wallets
    setWalletKeys(data);
    setExpireDate(expire);
    getSolanabalance(data);
  }, []);
  useEffect(() => {
    getSolanabalance(walletKeys);
  }, [props.updateBalance]);
  return (
    <div>
      {walletKeys ? (
        <DropdownButton
          id="dropdown-basic-button"
          title={`${walletKeys?.wallet?.sol?.public_key.substring(
            0,
            9
          )} ... ${walletKeys?.wallet?.sol?.public_key.substring(35, 44)}`}
        >
          <Dropdown.Item
            onClick={() => {
              navigator.clipboard.writeText(
                walletKeys?.wallet?.sol?.public_key
              );
              toast.success("copied");
            }}
          >
            Copy address
          </Dropdown.Item>
          <Dropdown.Item>{balance} Sol</Dropdown.Item>
          <Dropdown.Item>{tokenBalance} O2Token</Dropdown.Item>
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
      <Modal show={exportShow} onHide={handleExportClose}>
        <Modal.Body>
          <Form.Control
            as="textarea"
            // placeholder={DiscordData?.sol?.mnemonic}
            value={walletKeys?.wallet?.sol?.private_key}
            style={{ height: "100px" }}
            ref={textAreaRef}
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              navigator.clipboard.writeText(
                walletKeys?.wallet?.sol?.private_key
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

export default SolanaWalletv2;
