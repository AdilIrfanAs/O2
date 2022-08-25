import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./NftTransfer.css";
import transectionComplete from "../../assets/images/transection-complete.png";
import RightGear from "../../assets/images/card-right-gear.png"
import LeftGear from "../../assets/images/card-left-gear.png"
import TopCheckShap from "../../assets/images/top-card-check-shap.svg"
import BottomCheckShap from "../../assets/images/bottom-card-check-shap.svg"
import tokenBg from "../../assets/images/token-trans-bg3.png"
import CancelBg from "../../assets/images/cancel-bg.png"
import tokenImg from "../../assets/images/green-coin.svg";
import TopGear from "../../assets/images/fram-top-gear.png"
import BottomGear from "../../assets/images/fram-bottom-gear.png"
import MobileBottomGear from "../../assets/images/fram-mobile-bottom-gear.png"
import "fa-icons";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import Slider from "react-slick";
import { Link, useLocation } from "react-router-dom";
import LoaderAnim from "../../assets/images/loader-anim.png";
import LoaderArrow from "../../assets/images/loader-arrow.svg";
import { toast } from "react-toastify";
import { SendNftsToWallet, transferNfts, transferNftTOWallet } from "../../utils/api/Web3.api";
import { token, Wallets } from "../../utils/sharedVariable"

const NftTransfer = (props: any) => {
  const { state }: any = useLocation();
  let settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const [submitChange, setSubmitChange] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [WalletAddress, setWalletAddress] = useState(null);
  const [amount, setAmount] = useState<number>(0);
  const [bscTokenBalance, setBscTokenbalance] = useState<number>(0);
  const [solTokenBalance, setSolTokenbalance] = useState<number>(0);
  const [o2ContractTokens, setO2ContractToken] = useState<number>(0);
  const [shillToken, setShillToken] = useState<number>(0);
  const [bscBalance, setBscBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [submitSuccessfull, setSubmitSuccessfull] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [nfts, setNfts] = useState([]);
  const [serialNumber, setSerialNumber] = useState([]);
  const [nftsAddress, setNftAddress] = useState([]);
  const [mintAddress, setMintAddress] = useState([]);
  const [o2SolContractToken, setO2SolContractToken] = useState<number>(0);
  const [solanaShillToken, setSolanaShillToken] = useState<number>(0);
  const [userWallet, setUserWallet] = useState(null)
  const submit = async (e: any) => {
    e.preventDefault();
    setSubmitChange(true);
    let itemId = '';
    let catalog: string = ''
    let contractAddress = ''
    let tokenId: number = 0
    for (let i = 0; i < nfts.length; i++) {
      if (solBalance) {
        const nftTransferResponse = await transferNfts(
          userWallet?.wallet?._id,
          mintAddress[i],
          nfts[i]?.image,
          nfts[i].name,
          serialNumber[i]
        );

        if (nftTransferResponse.signature) {
          catalog = "MOCK_Table1"
          itemId = "RenTestStrixBow"
          contractAddress = mintAddress[i]
          tokenId = serialNumber[i]
          const res = await SendNftsToWallet(token, nfts[i], mintAddress[i], itemId, catalog, contractAddress, tokenId);
          if (res?.data?.FunctionResult.isSuccess) {
            if (i == nfts.length - 1) {
              toast.success("Nft transfer successfully")
              props.BalanceUpdate(true)
            }
          }
          else {
            toast.error("Nft transfer Failed")
            const nftTransferResponse = await transferNftTOWallet(
              userWallet?.wallet?._id,
              mintAddress[i],
              nfts[i].image,
              nfts[i].name,
              serialNumber[i]
            );
            break
          }

        }
        else {
          toast.error("Transaction failed!");
          setSubmitChange(false);
          setSubmitSuccessfull(true);
          break
        }
      }
      else {
        toast.error("insufficient Balance!");
        setSubmitChange(false);
        setSubmitSuccessfull(true);
        break
      }
    }
    setSubmitSuccessfull(true);
  };

  const getNftDetails = async () => {
    let nfts = [];
    let serial = [];
    let mint: any[] = [];
    for (let i = 0; i < state[0].length; i++) {
      const uri = state[0][i];
      const res: any = await axios.get(uri);
      nfts.push(res?.data);
      mint.push(state[1][i]);
      let resData: any = res?.data?.attributes;
      const serialNumber: any = resData.filter((item: any) => {
        return item?.trait_type.includes("SerialNumber");
      });
      serial.push(serialNumber[0]?.value);
    }
    setSerialNumber(serial);
    setNfts(nfts);
    setMintAddress(mint);
  };
  useEffect(() => {
    setUserWallet(Wallets)
    getNftDetails();
    nftsAddress.push(state);
  }, [state]);

  useEffect(() => {
    setSelectedWallet(props.selectedWallet)

    let wallet = props.WalletAddress;
    setWalletAddress(wallet?.wallet?.bsc.public_key);
    setBscTokenbalance(props.BscTokenBalance);
    setO2ContractToken(props.O2ContractToken);
    setBscBalance(props.BscBalance);
    setAmount(0);
    props.BalanceUpdate(false);
    setShillToken(props.ShillToken);
    setSolTokenbalance(props.SolTokenBalance);
    setSolBalance(props.SolBalance);
    setO2SolContractToken(props.O2SolContractToken);
    setSolanaShillToken(props.SolanaShillToken);
  }, [
    props.selectedWallet,
    props.SolTokenBalance,
    props.BscTokenBalance,
    props.BscBalance,
    props.SolBalance,
    props.O2SolContractToken,
    props.O2ContractToken,
    props.ShillToken,
    props.SolanaShillToken,
  ]);


  return (
    <>

      {!submitChange ? <section className="nft-transfer">
        <Container fluid className="nft-block-container fram position-relative">
          <h2 className="fram-title">
            NFT Transfer
          </h2>
          <div className="fram-content">
            <Row>
              <Col lg={6}>
                <div className="nft-slider">
                  <Slider {...settings}>
                    {nfts.map((val, ind) => {
                      return (
                        <div className="nft-wrapper" key={ind}>
                          <div className="nft-card-content w-100">
                            <div className="nft-card position-relative">
                              <div className="nft-card-cat">
                                <span>{val.nftLevel}</span>
                              </div>
                              <div className="nft-img" role="button">
                                <figure className="mb-0 top-check-shap">
                                  <img className="h-auto" src={TopCheckShap} alt="Side shap" />
                                </figure>
                                <figure className="mb-0 bottom-check-shap">
                                  <img className="h-auto" src={BottomCheckShap} alt="Side shap" />
                                </figure>
                                <img
                                  className="img-fluid"
                                  src={val?.image}
                                  alt="NFT"
                                />
                              </div>
                              <div className="nft-card-body">
                                <h6 className="nft-name">
                                  {val?.collection?.name}
                                </h6>
                                <div className="d-flex align-items-center justify-content-center flex-wrap">
                                  <span className="nft-id">{val?.name}</span>
                                  <span className="nft-id-no">{val.serialNumber}</span>
                                </div>
                              </div>
                              <figure className="mb-0 card-right-gear">
                                <img src={RightGear} alt="Gear bg" />
                              </figure>
                              <figure className="mb-0 card-left-gear">
                                <img src={LeftGear} alt="Gear bg" />
                              </figure>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </Col>
              <Col lg={6}>
                <form className="position-relative" action="">
                  <div className="input-wrapper">
                    <label htmlFor="">Wallet Address</label>
                    <div className="form-input position-relative">
                      <input
                        placeholder="0x14a80D9508f0c99747ab9938A81DE410cdb07941"
                        type="text"
                        value={WalletAddress}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="">Outland Odyssey Account</label>
                    <div className="form-input position-relative">
                      <input
                        placeholder="@LoremIpsum"
                        value={Wallets?.wallet?.username}
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                  <label>Transaction Fee</label>
                  <div className="dark-bar mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <figure className="mb-0 me-md-4 me-2">
                          <img src={tokenImg}></img>
                        </figure>
                        <p>0.5 Shill</p>
                      </div>
                      <span className="small-text">
                        ≈$XXX,XXX,XXX.XX
                      </span>
                    </div>
                  </div>
                  <span className="small-text">
                    Your balance:<span className="ms-2"> {Number(solanaShillToken)} SHILL</span>
                  </span>
                </form>
                <div className="text-center import-wallet mb-sm-3">
                  <span className="p-lg">Import NFT(s) to wallet?</span>
                </div>
              </Col>
            </Row>
            <div className="nft-transfer-btns text-lg-end text-center">
              <Link to="/">
                <button
                  className="bottom-btn cancel-btn bg-transparent border-0 token-trans-link text-center position-relative p-0 d-sm-inline-block d-none"
                >
                  <figure className="mb-0">
                    <img className="img-fluid" src={CancelBg} alt="token-bg" />
                  </figure>
                  <span>Cancel</span>
                </button>
              </Link>
              <button
                className="bottom-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                onClick={submit}
              >
                <figure className="mb-0">
                  <img className="img-fluid" src={tokenBg} alt="token-bg" />
                </figure>
                <span>Confirm</span>
              </button>
            </div>
            <figure className="mb-0 fram-top-gear d-lg-block d-none">
              <img src={TopGear} alt="Gear img" />
            </figure>
            <figure className="mb-0 fram-bottom-gear d-sm-block d-none">
              <img src={BottomGear} alt="Gear img" />
            </figure>
            <figure className="mb-0 fram-mobile-bottom-gear d-sm-none">
              <img src={MobileBottomGear} alt="Gear img" />
            </figure>
          </div>
        </Container>
      </section>
        : null}

      {submitSuccessfull === false && submitChange === true ? (
        <section className="nft-transfer nft-transfer-loader">
          <Container fluid className="nft-block-container fram position-relative">
            <h2 className="fram-title d-sm-block d-none">
              NFT Transfer
            </h2>
            <div className="fram-content">
              <Row>
                <Col>
                  <div className="nft-trans-loader">
                    <div className="main-loader position-relative">
                      <div className="loader-image rotate text-center">
                        <img src={LoaderAnim} alt="" />
                      </div>
                      <div className="loader-arrow">
                        <img src={LoaderArrow} alt="" />
                      </div>
                    </div>
                    <h1 className="proceed-trans">Your Transaction is Being Processed</h1>
                    <p className="p-lg text-center">Your items will be transferred into your wallet account.</p>
                    <p className="p-lg text-center">Do not close this tab.</p>
                  </div>
                </Col>
              </Row>
              <figure className="mb-0 fram-top-gear d-lg-block d-none">
                <img src={TopGear} alt="Gear img" />
              </figure>
              <figure className="mb-0 fram-bottom-gear d-sm-block d-none">
                <img src={BottomGear} alt="Gear img" />
              </figure>
            </div>
          </Container>
        </section>) : submitSuccessfull === true ? (
          <section className="nft-transfer nft-transfer-loader">
            <Container fluid className="nft-block-container fram position-relative">
              <h2 className="fram-title d-sm-block d-none">
                NFT Transfer
              </h2>
              <div className="fram-content">
                <Row>
                  <Col>
                    <div className="nft-trans-loader">
                      <div className="transection-complete-tick position-relative">
                        <div className="tick-img text-center">
                          <img src={transectionComplete} alt="Tick Image" />
                        </div>
                        <div className="add-space">
                          <h1 className="proceed-trans">Transaction Completed!</h1>
                          <p className="p-lg text-center">Your items have been transferred into your wallet.</p>
                        </div>
                        <div className="text-center mb-2">
                          <Link to="/" className="token-trans-link position-relative"
                          >
                            <figure className="mb-0 d-inline-block">
                              <img className="img-fluid" src={tokenBg} alt="token-bg" />
                            </figure>
                            <span>Wallet Inventory</span>
                          </Link>
                        </div>
                        <div className="text-center">
                          <Link to="/" className="token-trans-link position-relative"
                          >
                            <figure className="mb-0 d-inline-block">
                              <img className="img-fluid" src={tokenBg} alt="token-bg" />
                            </figure>
                            <span>In-Game Inventory</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <figure className="mb-0 fram-top-gear d-lg-block d-none">
                  <img src={TopGear} alt="Gear img" />
                </figure>
                <figure className="mb-0 fram-bottom-gear d-sm-block d-none">
                  <img src={BottomGear} alt="Gear img" />
                </figure>
              </div>
            </Container>
          </section>) : null}
    </>
  );
};
export default NftTransfer;
