import React, { useState, useEffect } from "react";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";
import WalletLoginpage from "./WalletLogin";
import WalletSignUppage from "./walletSignUp";
import { Wallets } from "../../../utils/sharedVariable"
const  Wallet =(props: any) => {
  const [show, setShow] = useState(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const setModelValue = async (value: any, address: any) => {
    setShow(value);
    setWalletKeys(address);
    props.GetWalletHandler(address)
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const data = Wallets
    setWalletKeys(data);
  }, []);
  return (
    <div>
      {walletKeys ? (
        <p className=" btn btn-primary">Connected</p>
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
              <WalletLoginpage modelhandler={setModelValue} />
            </Tab>
            <Tab eventKey="signUp" title="SignUp">
              <WalletSignUppage modelhandler={setModelValue} />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default Wallet;
