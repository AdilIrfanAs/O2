import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./NftDetails.css";
import { Container, Row, Col, Accordion, Table, Dropdown, ButtonGroup } from "react-bootstrap";
import BNBCoin from "../../../assets/images/bnb-coin-icon.svg"
import MenuBtn from "../../../assets/images/menu-btn.svg"
import { getSingleInventoryNft } from "../../../utils/api/Web3.api";
import { token, Wallets } from "../../../utils/sharedVariable"
import ShareIcon from "../../../assets/images/share-icon.svg"
const NftDetails = (props: any) => {
  let NftOwner = null;
  const { id } = useParams();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [ids, setIds] = useState([]);
  const [data, setData] = useState<any | null>(null);
  const [image, setImage] = useState();
  const [nftOwner, setNftOwner] = useState([]);
  const [serialNumber, setSerialNumber] = useState();
  const [url, setUrl] = useState([]);
  const [maxlevel, setMaxLevel] = useState<number>(0)
  const [isMinted, setIsMinted] = useState<boolean>(false);
  const array = {
    IV_1: "Health Points",
    IV_2: "Physical Attack",
    IV_3: "Magical Attack",
    IV_4: "Physical Defence",
    IV_5: "Magical Defence",
    IV_6: "Critical Chance",
    IV_7: "Critical Damage",
    IV_8: "Attack Speed",
    IV_9: "Movement Speed",
    IV_10: "Cooldown Reduction",
    IV_11: "Fire Resistance",
    IV_12: "Nature Resistance",
    IV_13: "Water Resistance",
    IV_14: "Light Resistance",
    IV_15: "Dark Resistance",
    IV_16: "Attack Resistance",
    IV_17: "Health Resistance",
    IV_18: "Physical Resistance",
    IV_19: "Magical Resistance",
    IV_20: "Critical Resistance",
  };
  const [dropdownClicked, setDropDownClick] = useState<boolean>(false);
  const [MobileTransferMenu, MobileTransferMenuShow] = useState(true)
  const reftwo = useRef(null);
  const { onClickOutside } = props;
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, [onClickOutside]);
  const handleClickOutside = (event: any) => {
    if (!reftwo.current.contains(event.target)) {
      MobileTransferMenuShow(true)
    }
  };
  const getNftDetails = async () => {
    const uri: any = state;
    let url: any = [];
    let max: number = 0
    url.push(state);
    setUrl(url);
    const res: any = await axios.get(uri);
    if (res) {
      res.data.attributes.forEach((val: any) => {
        if (val.trait_type.includes("IV_")) {
          let value = val.trait_type.split("_")
          if (max < value[1]) {
            max = Number(value[1])
          }
        }
      })
    }
    setMaxLevel(max)
    setImage(res?.data?.image);
    setData(res.data);
    let resData: any = res.data.attributes;
    const serialNumber: any = resData.filter((item) => {
      return item.trait_type.includes("SerialNumber");
    });
    setSerialNumber(serialNumber[0].value);
  };


  const getInventoryNfts = async (id: string) => {
    const res: any = await getSingleInventoryNft(token, id)
    setImage(res.image);
    setData(res);
    let max: number = 0
    res.mintedAddress ? setIsMinted(true) : setIsMinted(false)
    let resData: any = res.attributes;
    const serialNumber: any = resData.filter((item) => {
      return item.trait_type.includes("SerialNumber");
    });
    res.attributes.forEach((val: any) => {
      if (val.trait_type.includes("IV_")) {
        let value = val.trait_type.split("_")
        if (max < value[1]) {
          max = Number(value[1])
        }
      }
    })
    setMaxLevel(max)
    setSerialNumber(serialNumber[0].value);
  };

  const transferNft = () => {
    navigate(`/SeedNftTransfer`, {
      state: [url, nftOwner],
    });
  };
  const transferNftToWallet = () => {
    let itemInstanceId = [id]
    navigate(`/SeedNftTransfer2`, {
      state: { itemInstanceId, isMinted },
    });
  }

  useEffect(() => {
    if (state.includes('http')) {
      getNftDetails();
    }
    else {
      getInventoryNfts(id)

    }
    NftOwner = localStorage.getItem("NftOwner");
    ids.push(id);

    nftOwner.push(NftOwner);
  }, [id]);

  return (
    <section className="nft-details">
      <Container fluid className="detail-block-container">
        <Row>
          <Col xxl={4} xl={4} lg={5}>
            <span className="back-to-inventory d-lg-inline-flex d-none" onClick={() => navigate(-1)}>
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1.07273L6.78663 0L0 6L6.78663 12L8 10.9273L2.42674 6L8 1.07273Z"
                  fill="#E3D99B"
                />
              </svg>
              Back to Inventory
            </span>
            <div className="nft-details-img">
              <img src={image} className="img-fluid" />
            </div>
            <div className="nft-details-img-cat mb-4">
              <span className="me-2 mb-2">{data?.collection?.name}</span>
              <span className="me-2 mb-2">{data?.collection?.family}</span>
            </div>
            <ul className="list-unstyled mb-4 d-flex justify-content-between">
              <li className="d-flex align-items-center w-50">
                <svg className="me-3" width="30" height="21" viewBox="0 0 30 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0C8.18182 0 2.35909 4.354 0 10.5C2.35909 16.646 8.18182 21 15 21C21.8182 21 27.6409 16.646 30 10.5C27.6409 4.354 21.8182 0 15 0ZM15 17.5C11.2364 17.5 8.18182 14.364 8.18182 10.5C8.18182 6.636 11.2364 3.5 15 3.5C18.7636 3.5 21.8182 6.636 21.8182 10.5C21.8182 14.364 18.7636 17.5 15 17.5ZM15 6.3C12.7364 6.3 10.9091 8.176 10.9091 10.5C10.9091 12.824 12.7364 14.7 15 14.7C17.2636 14.7 19.0909 12.824 19.0909 10.5C19.0909 8.176 17.2636 6.3 15 6.3Z" fill="#E3D99B" />
                </svg>
                <span className="p-lg">999k views</span>
              </li>
              <li className="d-flex align-items-center w-50">
                <svg className="me-3" width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21L13.74 19.4894C19.92 14.145 24 10.6202 24 6.29428C24 2.76948 21.096 0 17.4 0C15.312 0 13.308 0.926976 12 2.39183C10.692 0.926976 8.688 0 6.6 0C2.904 0 0 2.76948 0 6.29428C0 10.6202 4.08 14.145 10.26 19.5008L12 21Z" fill="#E3D99B" />
                </svg>
                <span className="p-lg">999k favorites</span>
              </li>
            </ul>
            <Accordion className="fram detail-accordion position-relative" defaultActiveKey="0">
              <Accordion.Item className="fram-content" eventKey="0">
                <Accordion.Header className="dropdown-button--bg">Details</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled m-0">
                    <li className="d-flex justify-content-between">
                      <div className="w-50">
                        <h5>Owner</h5>
                        <span className="d-inline-block ps-2">{Wallets.wallet.username}</span>
                      </div>
                      <div className="w-50 text-center">
                        <h5>Level</h5>
                        <span className="d-inline-block ps-2">{maxlevel}</span>
                      </div>
                    </li>
                    <li>
                      <h5>Collection</h5>
                      <span className="d-inline-block ps-2">{data?.collection?.name}</span>
                    </li>
                    <li>
                      <h5>Contract Address</h5>
                      <p className="ps-2">{data?.mintedAddress ? data?.mintedAddress : nftOwner}</p>
                    </li>
                    <li className="mb-0">
                      <h5>About</h5>
                      <span className="d-inline-block ps-2">
                        {data?.description}
                      </span>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion className="fram stats-cccordion position-relative" defaultActiveKey="0">
              <Accordion.Item className="fram-content" eventKey="0">
                <Accordion.Header className="dropdown-button--bg">Stats</Accordion.Header>
                <Accordion.Body>
                  <Table bordered responsive className="stats-table mb-0">
                    <thead>
                      <tr>
                        <th>Stat</th>
                        <th>Value</th>
                        <th>EV</th>
                        <th>EV Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.attributes.map((val, ind) => {
                        return (
                          <>
                            {
                              val.trait_type.includes("IV_") && val.value ? <tr>
                                <td key={ind}>{array[val.trait_type]}</td>
                                <td>{val.value}</td>
                                <td>XX</td>
                                <td>XX</td>
                              </tr>
                                : null
                            }
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col xl={7} lg={7} className="offset-xl-1">
            <div className="nft-details-header d-flex justify-content-between">
              <div className="">
                <h1>{data?.name}</h1>
                <span className="nft-id">{serialNumber}</span>
              </div>
              <div className="d-flex align-items-center">
                <Dropdown
                  className="menu-dropdown img-input-wrapper me-sm-3 me-1 position-relative"
                  as={ButtonGroup}
                  onClick={() => MobileTransferMenuShow(!MobileTransferMenu)}
                >
                  <Dropdown.Toggle
                    variant="none"
                    className="menu-btn p-0 border-0"
                  >
                    <img src={MenuBtn} alt="Menu icon" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="menu-content dropdown-button--bg position-absolute">
                    <div className="img-input dropdown-bg-gradient p-0 w-100">
                      {
                        state.includes('http') ?
                          <Dropdown.Item
                            onClick={() => transferNft()}
                          >
                            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M25 4.93335L19.8916 0V3.69755H0V6.17112H19.8916V9.86866L25 4.93335Z" fill="#E3D99B" />
                              <path d="M0 17.0642L5.10835 21.9995V18.302H25V15.8284H5.10835V12.1309L0 17.0642Z" fill="#E3D99B" />
                            </svg>
                            {state.includes('http') ? "Transfer to Game" : data.mintedAddress ? 'Transfer to Wallet' : " Mint to Wallet"}
                          </Dropdown.Item>
                          :
                          <Dropdown.Item
                            onClick={() => transferNftToWallet()}
                          >
                            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M25 4.93335L19.8916 0V3.69755H0V6.17112H19.8916V9.86866L25 4.93335Z" fill="#E3D99B" />
                              <path d="M0 17.0642L5.10835 21.9995V18.302H25V15.8284H5.10835V12.1309L0 17.0642Z" fill="#E3D99B" />
                            </svg>
                            Transfer to Wallet
                          </Dropdown.Item>
                      }

                    </div>
                  </Dropdown.Menu>
                </Dropdown>
                <figure role="button" className="share-icon mb-0">
                  <img src={ShareIcon} alt="Share icon" />
                </figure>
              </div>
            </div>
            <Accordion className="fram position-relative" defaultActiveKey="0">
              <Accordion.Item className="fram-content" eventKey="0">
                <Accordion.Header className="dropdown-button--bg">Item History</Accordion.Header>
                <Accordion.Body>
                  <Table bordered responsive className="mb-0" >
                    <thead>
                      <tr>
                        <th>Transaction</th>
                        <th>Price</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Listing</td>
                        <td className="d-flex">
                          <img className="me-2" src={BNBCoin} alt="BNB Coin" />
                          XXX,XXX
                        </td>
                        <td>@LoremIpsum</td>
                        <td></td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Sale</td>
                        <td className="d-flex">
                          <img className="me-2" src={BNBCoin} alt="BNB Coin" />
                          XXX,XXX
                        </td>
                        <td>@LoremIpsum</td>
                        <td>@LoremIpsum</td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Listing</td>
                        <td className="d-flex">
                          <img className="me-2" src={BNBCoin} alt="BNB Coin" />
                          XXX,XXX
                        </td>
                        <td>@LoremIpsum</td>
                        <td></td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Mint</td>
                        <td></td>
                        <td>@LoremIpsum</td>
                        <td></td>
                        <td>1h ago</td>
                      </tr>
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion className="fram position-relative" defaultActiveKey="0">
              <Accordion.Item className="fram-content" eventKey="0">
                <Accordion.Header className="dropdown-button--bg">Upgrade History</Accordion.Header>
                <Accordion.Body>
                  <Table bordered responsive className="mb-0" >
                    <thead>
                      <tr>
                        <th>Stats</th>
                        <th>Points</th>
                        <th>By</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Health Power</td>
                        <td>+XX</td>
                        <td>@LoremIpsum</td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Cooldown Reduction</td>
                        <td>+XX</td>
                        <td>@LoremIpsum</td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Physical Attack</td>
                        <td>+XX</td>
                        <td>@LoremIpsum</td>
                        <td>1h ago</td>
                      </tr>
                      <tr>
                        <td>Physical Attack</td>
                        <td>+XX</td>
                        <td>@LoremIpsum</td>
                        <td>1h ago</td>
                      </tr>
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div className={`sidebar-overlay ${!MobileTransferMenu ? 'active' : ''}`}></div>
            <div className={`mobile-menu-content dropdown-button--bg d-lg-none ${MobileTransferMenu ? "mobile-menu-content-position" : ""}`}>
              <div className="img-input dropdown-bg-gradient p-0 w-100">
                <div
                    onClick={() => transferNft()}
                  ref={reftwo}
                >
                  <svg className="me-2" width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 4.93335L19.8916 0V3.69755H0V6.17112H19.8916V9.86866L25 4.93335Z" fill="#E3D99B" />
                    <path d="M0 17.0642L5.10835 21.9995V18.302H25V15.8284H5.10835V12.1309L0 17.0642Z" fill="#E3D99B" />
                  </svg>
                  {state.includes('http') ? "Transfer to Game" : data?.mintedAddress ? 'Transfer to Wallet' : " Mint to Wallet"}                </div>
                {/* <div
                  onClick={() => {
                    setDropDownClick(true);
                  }}
                  ref={reftwo}
                >
                  <svg className="me-2" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
                    <rect width="30" height="30" fill="url(#pattern0)" />
                    <defs>
                      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use href="#image0_1927_8697" transform="scale(0.0227273)" />
                      </pattern>
                      <image id="image0_1927_8697" width="44" height="44" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAAAsSAAALEgHS3X78AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAACxUlEQVRYw+2XT0gUcRTHP2OhFhmGaBSPDTPeubpGBEHY1ZMGUUKPUKlTVHSKTknRIYo2cQKrQ+bBOmaXIuhaHW1IK3eC/kj/RCoJtsturduOOzPNJtbOaZnv8H4f3v7en6+TzWZZSo9TBa4C/0/Avue2Au3AR2BU1ObiHOp7bh3QATQCY6L2PHFg33MHgINFrztFbSQibCcwXPT6sqj1Jgbse+5+YChArgubad9za4FvAXK3qF1NCvg+sCNA7hK1myGBu4AbAfI9UduZFPBjYHOA3CNqAyGBe4B0gPxE1LYkBdwPHA+QW0XtRYSinQyQ+0XtRFLA9cCXElJa1PoiFl0a6CkhrRC1r0l2iXrgJLAb+AAMidq1mG1tH9ANrAHuAKfCwP7bg8P33BTQBjQAc7ksT4rau4jZbQE2Ak3AMmAmF+flHwP7ntucu297AQ347CFwTtRulQHtAI4A2wI+GQeuA+dFbTYycO6A0QjJewTsErX3RXGagLvA1gixOkTtdmhg33PXA69iXLHfeqnvuQ+A7TFirRO112GBe4FLMeviZ3taoB2GefpELR0W+ChwJuZBq/J30PfcBuBzzDjHRO1sFTg+sANkkwGuWqQqcLTRulzUvidxuO+5tVF9YVQT2gxcELWuhIBHgMOi9qYSy0++4idEbVNCwM9yC1WjqH1K0oSmgPw2VQng0M6lLHDGc1POL9hKAgOsFbW3sYEzTwebHccpDlBJ4LKZDgSeGh9M1dQ4QUv1RMHv06J2pQBirABiQtTaC7QDQKHRbItqbEsCZzy3wQm/A8wboUVZm/dvRBz5JQsxaJdYCcwuMvBqUZuJ4jgEyCzSldggalNxPF0p6EoXXctCxrZsW8t5sum/BByY2aiDozDTlQIuCxt1NOcLsRLAJQssieWnCbgoansSAh4GDona9FJZLyPHqjqOKnDR8wONb964UCWEOAAAAABJRU5ErkJggg==" />
                    </defs>
                  </svg>
                  Transfer to Friend
                </div> */}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default NftDetails;
