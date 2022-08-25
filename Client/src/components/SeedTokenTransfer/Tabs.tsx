import { useState, useEffect } from "react";
import TokenTransferToGame from "./TokenTransferToGame/TokenTransferToGame";
import TokenTransferToWallet from "./TokenTransferToWallet/TokenTransferToWallet";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./tabs.css";
import coin1 from "../../assets/images/coin1.png";
import coin2 from "../../assets/images/coin2.png";
const Tabs = (props: any) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
  const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
  const [o2ContractToken, setO2ContractToken] = useState<number>(0);
  const [bscBalance, setBscBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
  const [shillToken, setShillToken] = useState<number>(0);
  const [solanaShillToken, setSolanaShillToken] = useState<number>(0);
  const [o2AvailableTokens, setO2AvailableTokens] = useState<number>(0)
  const [shillAvailableTokens, setShillAvailableTokens] = useState<number>(0)
  const handleTab1 = () => {
    setActiveTab("tab1");
  };

  const handleTab2 = () => {
    setActiveTab("tab2");
  };

  const balanceUpdate = (data: any) => {
    props.BalanceUpdate(data);
  };

  useEffect(() => {
    setSelectedWallet(props.selectedWallet);
    setWalletAddress(props.WalletAddress);
    setSolTokenbalance(props.SolTokenBalance);
    setBscTokenbalance(props.BscTokenBalance);
    setO2ContractToken(props.O2ContractToken);
    setBscBalance(props.BscBalance);
    setSolBalance(props.SolBalance);
    setO2SolContractToken(props.O2SolContractToken);
    setShillToken(props.ShillToken);
    setSolanaShillToken(props.SolanaShillToken);
    setO2AvailableTokens(props.O2AvailableTokens)
    setShillAvailableTokens(props.ShillAvailableTokens)
  }, [
    props.selectedWallet,
    props.SolTokenBalance,
    props.BscTokenBalance,
    props.O2ContractToken,
    props.SolBalance,
    props.BscBalance,
    props.O2SolContractToken,
    props.ShillToken,
    props.SolanaShillToken,
    props.O2AvailableTokens,
    props.ShillAvailableTokens
  ]);

  return (
    <>
      <section>
        <div className="token-transfer page-spacing">
          <Container fluid className="block-container">
            <Row>
              <Col xl={4} lg={4}>
                <div className="fram game-token position-relative d-lg-block d-none">
                  <h3 className="fram-title">
                    In-game Tokens
                  </h3>
                  <div className="fram-content">
                    <div className="img-input-wrapper position-relative mx-0">
                      <figure className="mb-0">
                        <img src={coin1} alt="Site Logo"></img>
                      </figure>
                      <div className="dropdown-button--bg">
                        <div className="d-flex align-items-center justify-content-end img-input w-100">

                          <p className="ms-2">{shillAvailableTokens ? shillAvailableTokens : 0} </p>

                        </div>
                      </div>
                    </div>
                    <div className="img-input-wrapper position-relative mx-0">
                      <figure className="mb-0">
                        <img src={coin2} alt="Site Logo"></img>
                      </figure>
                      <div className="dropdown-button--bg">
                        <div className="d-flex align-items-center justify-content-end img-input w-100">

                          <p className="ms-2">{o2AvailableTokens ? o2AvailableTokens : 0} </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fram game-token position-relative d-lg-block d-none">
                  <h3 className="fram-title">
                    Wallet Tokens
                  </h3>
                  <div className="fram-content">
                    <div className="img-input-wrapper position-relative mx-0">
                      <figure className="mb-0">
                        <img src={coin1} alt="Site Logo"></img>
                      </figure>
                      <div className="dropdown-button--bg">
                        <div className="d-flex align-items-center justify-content-end img-input w-100">
                          <p className="ms-2">{selectedWallet === "Binance" ? Number(shillToken).toFixed(2) : Number(solanaShillToken).toFixed(2)} </p>
                        </div>
                      </div>
                    </div>
                    <div className="img-input-wrapper position-relative mx-0">
                      <figure className="mb-0">
                        <img src={coin2} alt="Site Logo"></img>
                      </figure>
                      <div className="dropdown-button--bg">
                        <div className="d-flex align-items-center justify-content-end img-input w-100">
                          <p className="ms-2">{selectedWallet === "Binance" ? Number(bscTokenBalance).toFixed(2) : Number(solTokenBalance).toFixed(2)} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="p-lg-4 p-0" xxl={5} xl={6} lg={7}>
                <div className="tabs">
                  <div className="outlet">
                    <ul className="nav">
                      <li
                        className={activeTab === "tab1" ? "active" : ""}
                        onClick={handleTab1}
                      >
                        <span className="tab-border">
                          <span className="tab-bg">wallet</span>
                        </span>
                      </li>
                      <li
                        className={activeTab === "tab2" ? "active" : ""}
                        onClick={handleTab2}
                      >
                        <span className="tab-border">
                          <span className="tab-bg">Game</span>
                        </span>
                      </li>
                    </ul>
                    <div className="outlet">
                      {activeTab === "tab1" ? (
                        <TokenTransferToGame
                          selectedWallet={selectedWallet}
                          WalletAddress={walletAddress}
                          BscTokenBalance={bscTokenBalance}
                          SolTokenBalance={solTokenBalance}
                          BalanceUpdate={balanceUpdate}
                          SolBalance={solBalance}
                          BscBalance={bscBalance}
                          O2ContractToken={o2ContractToken}
                          O2SolContractToken={o2SolContractToken}
                          ShillToken={shillToken}
                          SolanaShillToken={solanaShillToken}
                          WalletUpdate={props.WalletUpdate}
                        />
                      ) : (
                        <TokenTransferToWallet
                          selectedWallet={selectedWallet}
                          WalletAddress={walletAddress}
                          BscTokenBalance={bscTokenBalance}
                          SolTokenBalance={solTokenBalance}
                          BalanceUpdate={balanceUpdate}
                          SolBalance={solBalance}
                          BscBalance={bscBalance}
                          O2ContractToken={o2ContractToken}
                          O2SolContractToken={o2SolContractToken}
                          ShillToken={shillToken}
                          SolanaShillToken={solanaShillToken}
                          O2AvailableTokens={o2AvailableTokens}
                          ShillAvailableTokens={shillAvailableTokens}
                          WalletUpdate={props.WalletUpdate}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};
export default Tabs;
