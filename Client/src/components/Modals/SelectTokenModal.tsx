import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import Eth from "../../assets/images/eth.png";
import Usd from "../../assets/images/usd.png";
import Dai from "../../assets/images/dai.png";
import Tet from "../../assets/images/tet.png";
import Bin from "../../assets/images/bin.png";
import Cha from "../../assets/images/cha.png";
import GastToken from "../../assets/images/GastToken.png";
import Binaace from "../../assets/images/Binaace.png";
import AavaToken from "../../assets/images/AavaToken.png";
import GraphToken from "../../assets/images/GraphToken.png";

const  SelectTokenModal =() => {
    const [show, setShow] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <div className="model-wraper btn-wrapper d-flex justify-content-center align-items-center mt-4">
                <Button className="select-a-token btn btn-secondary" onClick={handleShow}>
                    Select a Token
                    <span className="ms-md-2 ms-1">
                        <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                </Button>
                <Modal show={show} onHide={handleClose} className="swap_model_info">
                    <Modal.Body>
                        <div className="d-flex align-items-center model--info">
                            <div className=" d-flex flex-fill arrowLeft">
                                <a href="#" target="_blank">
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </a>
                            </div>
                            <div className=" d-flex flex-fill token-text">
                                <h4>Select a Token</h4>
                            </div>
                        </div>
                        <div className="d-felx model--info2">
                            <div className="form-group has-search">
                                <span className="form-control-feedback">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input type="text" className="form-control" placeholder="Search by name or paste address" />
                            </div>
                        </div>
                        <div className="info--part">
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Eth} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Ethereum</h6>
                                        <p>ETH</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right"></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Usd} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>USA Coin</h6>
                                        <p>USDC</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right"></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Dai} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Dai Stablecoin</h6>
                                        <p>Dai</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Tet} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Tether USD</h6>
                                        <p>USDT</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right"></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Dai} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Dai Stablecoin</h6>
                                        <p>Dai</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Usd} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>USA Coin</h6>
                                        <p>USDC</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right"></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Eth} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Ethereum</h6>
                                        <p>ETH</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right"></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Bin} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Binance USD</h6>
                                        <p>BUSD</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Cha} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Chain Link</h6>
                                        <p>Link</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={GastToken} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Chai Gastoken</h6>
                                        <p>CHI</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={Binaace} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Yearn.finance</h6>
                                        <p>YFI</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={AavaToken} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Aava Token</h6>
                                        <p>AAVE</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="lower-section">
                                <div className="d-flex ms-2 ms-md-4 me-md-4 me-2">
                                    <span className="logo-area">
                                        <img src={GraphToken} alt="" />
                                    </span>
                                    <div className="description d-flex flex-fill">
                                        <h6>Graph Token</h6>
                                        <p>GRT</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <h6 className="text-right">0</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}

export default SelectTokenModal;
