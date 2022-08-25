import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DiscordCallback } from "../api/Web3.api";
import { DropdownButton, Dropdown, Modal, Button, Form } from "react-bootstrap";
import Wallet from "./SolanaWalletv2";
const Discord_Callback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [DiscordData, setDiscordData] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const code: any = searchParams.get("code");

  const Data = async () => {
    const response = await DiscordCallback(code);
    if (response) {
      localStorage.setItem("myData", JSON.stringify(response));
      setDiscordData(response);
    } else {
      const data = JSON.parse(localStorage.getItem("myData"));
      setDiscordData(data);
    }
  };

  const disconnect = () => {
    localStorage.removeItem("myData");
    setDiscordData(null);
  };
  useEffect(() => {
    Data();
  }, []);
  return (
    <div>
      {DiscordData ? (
        <DropdownButton
          id="dropdown-basic-button"
          title={DiscordData?.keys?.public_key.substring(0, 8)}
        >
          <Dropdown.Item href="#/action-1"></Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              navigator.clipboard.writeText(DiscordData?.keys?.public_key);
            }}
          >
            Copy address
          </Dropdown.Item>
          <Dropdown.Item onClick={handleShow}>Export Seed Pharse</Dropdown.Item>
          <Dropdown.Item onClick={disconnect}>Disconnect</Dropdown.Item>
        </DropdownButton>
      ) : (
        <Wallet />
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form.Control
            as="textarea"
            value={DiscordData?.keys?.mnemonic}
            style={{ height: "100px" }}
          />
          <span
            onClick={() => {
              navigator.clipboard.writeText(DiscordData?.keys?.mnemonic);
            }}
          >
            copy
          </span>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-center">
            {" "}
            <Button className="btn text-center" onClick={handleClose}>
              Ok, I've written this down
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Discord_Callback;
