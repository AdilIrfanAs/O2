import { useState, useEffect, useRef } from "react";
import {
  DropdownButton,
  Dropdown,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  getBSCBalanceandToken,
} from "./../../web3Connection/web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Wallets, expire } from "../../../utils/sharedVariable"

const BscWalletv2 = (props: any) => {
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
  const disconnect = () => {
    localStorage.removeItem("Wallets");
    localStorage.removeItem("authorization");
    toast.success("Disconnected");
    setWalletKeys(null);
    props.disconectHandler(null);
  };
  const getBinacebalance = async (data) => {
    const Tokenbalance: any = await getBSCBalanceandToken(
      data?.wallet?.bsc?.public_key
    );
    setTokenbalance(Tokenbalance.token);
    setbalance(Tokenbalance.bscBalance);
  };
  useEffect(() => {
    const data = Wallets
    setWalletKeys(data);
    getBinacebalance(data);
  }, []);
  useEffect(() => {
    if (props.updateBalance) {
      const data = Wallets
      getBinacebalance(data);
    }
  }, [props.updateBalance]);
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
      <Modal show={exportShow} onHide={handleExportClose}>
        <Modal.Body>
          <Form.Control
            as="textarea"
            // placeholder={DiscordData?.bsc?.mnemonic}
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
