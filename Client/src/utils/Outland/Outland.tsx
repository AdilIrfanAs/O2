import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import { addToFavorite, getFavorite } from "../../utils/api/Web3.api";
import RightGear from "../../assets/images/card-right-gear.png"
import LeftGear from "../../assets/images/card-left-gear.png"
import CardMenu from "../../assets/images/card-menu-icon.png"
import TopCheckShap from "../../assets/images/top-card-check-shap.svg"
import BottomCheckShap from "../../assets/images/bottom-card-check-shap.svg"
import tokenBg from "../../assets/images/token-trans-bg3.png"
import CancelBg from "../../assets/images/cancel-bg.png"
import SearchBar from "../../components/SearchBar/SearchBar";
import FullPageLoader from "../../components/Loader/Loader";
import CollectionFilter from "../../components/CollectionFilter/CollectionFilter";
import { useNavigate } from "react-router-dom";
import "./Outland.css";
import { getInventoryNftsFromGameWallet, } from "../../utils/api/Web3.api";
import { toast } from "react-toastify"
import { token, Wallets } from "../../utils/sharedVariable"

interface searchFilter {
  collection: {
    name: string[],
    counts: number[]
  },
  category: {
    name: string[],
    counts: number[]
  }
}

export const Outland = (props: any) => {
  const [nfts, setNfts] = useState<any[] | null>(null);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [category, setCategory] = useState([]);
  const [filterNfts, setFilterNfts] = useState([]);
  const [filterStats, setFilterState] = useState([]);
  const [favouriteNft, setFavouriteNft] = useState([]);
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [searchDropdownClicked, setSearchDropDownClick] = useState<boolean>(false);
  const [dropdownClicked, setDropDownClick] = useState<boolean>(false);
  const [NftsDataIds, setNftsDataIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemInstanceId, setItemInstanceId] = useState<string[]>([])
  const [MobileTransferMenu, MobileTransferMenuShow] = useState<boolean>(true)
  const [mintToWallet, setMintToWallet] = useState<boolean>(false)
  const refOne = useRef(null);
  const { onClickOutside } = props;
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, [onClickOutside]);
  const handleClickOutside = (event: any) => {
    if (!refOne.current.contains(event.target)) {
      MobileTransferMenuShow(true)
    }
  };
  const [searchFilter, setSearchFilter] = useState<searchFilter>({
    collection: { name: [], counts: [] },
    category: { name: [], counts: [] },
  });
  const [isMinted, setIsMinted] = useState<boolean>(false);
  const [stats, setStats] = useState({
    IV_1: [0, 100],
    IV_2: [0, 100],
    IV_3: [0, 100],
    IV_4: [0, 100],
    IV_5: [0, 100],
    IV_6: [0, 100],
    IV_7: [0, 100],
    IV_8: [0, 100],
    IV_9: [0, 100],
  });
  const [nftData, setNftData] = useState<any | null>([]);
  const navigate = useNavigate();

  const CategoryFilter = (category: any) => {
    setCategory(category);
    CategoryFilterNftsData(category);
  };

  const CategoryFilterNftsData = (category: any) => {
    let arr: any = [];
    if (category.length > 0) {
      arr.push(
        ...categoryFilters.filter((item) => {
          return category.includes(item?.collection.family);
        })
      );
      setFilterNfts(arr);
      setFilterState(arr);
    } else {
      setFilterNfts(categoryFilters);
      setFilterState(categoryFilters);
    }
  };

  const FilterSearch = (searchTerm: any, dropDownClick: any) => {
    setSearchTerm(searchTerm);
    setSearchDropDownClick(dropDownClick);
  };


  const fetchNftsFromPlayFab = async () => {
    setLoading(true)
    let nftsArr = []
    let max = 0;

    const res = await getInventoryNftsFromGameWallet(token);

    res?.data?.FunctionResult?.nftItems.forEach((item) => {
      item.attributes.forEach((val: any) => {
        if (val.trait_type.includes("IV_")) {
          let value = val.trait_type.split("_")
          if (max < Number(value[1])) {
            max = Number(value[1])
          }
        }

      })
      nftsArr.push({ ...item, nftLevel: "IV_" + max })

    })
    setNftData(nftsArr);
    setFilterNfts(nftsArr);
    setColectionCategory(nftsArr);
    setCategoryFilters(nftsArr);
    setFilterState(nftsArr);
    setLoading(false)

  };

  const handleChange = (id: string, mintedAddress: string) => {
    mintedAddress ? setIsMinted(true) : setIsMinted(false)
    let resArr = itemInstanceId.filter((value) => {
      return value.includes(id);
    })
    if (resArr[0]) {
      let index = itemInstanceId.indexOf(id);
      if (index > -1) {
        itemInstanceId.splice(index, 1);
      }
    } else {
      itemInstanceId.push(id);
    }
    setChecked(!checked);
  };
  const DetailPage = (ind: string) => {
    navigate(`/nft-details/${ind}`, {
      state: ind,
    });
  };

  const setColectionCategory = (nfts: any) => {
    if (nfts.length > 0) {
      nfts.forEach((item) => {

        if (searchFilter.collection.name.includes(item.collection.name)) {
          let index = searchFilter.collection.name.indexOf(
            item.collection.name
          );
          if (index > -1) {
            searchFilter.collection.counts[index] =
              searchFilter.collection.counts[index] + 1;
          }
        } else {
          if (item.collection.name != null) {
            searchFilter.collection.name.push(item.collection.name);
            searchFilter.collection.counts.push(1);
          }
        }
        if (searchFilter.category.name.includes(item.collection.family)) {
          let index = searchFilter.category.name.indexOf(
            item.collection.family
          );
          if (index > -1) {
            searchFilter.category.counts[index] =
              searchFilter.category.counts[index] + 1;
          }
        } else {
          if (item.collection.family != null) {
            searchFilter.category.name.push(item.collection.family);
            searchFilter.category.counts.push(1);
          }
        }
      });
    }
  };
  const FilterNftsData = () => {
    let arr: any = [];
    if (searchTerm) {
      arr.push(
        ...nftData.filter((item) => {
          if (searchTerm) {
            if (item?.collection.family != null && item?.collection.name != null) {
              return (
                item?.collection.family
                  .includes(searchTerm) ||
                item?.collection.name
                  .includes(searchTerm)
              );
            }
          }
        })
      );
      setFilterNfts(arr);
      setCategoryFilters(arr);
      setFilterState(arr);
    } else {
      setFilterNfts(nfts);
      setCategoryFilters(nfts);
      setFilterState(nfts);
    }
  };


  const statsFilter = (values: any) => {
    setStats(values);
    statsNftFilter();
  };

  const addToFavoriteList = async (address: any) => {
    const res = await addToFavorite(userId, address, 2);
    if (res?.status) {
      getFavoriteNftsData(userId);
    }
  };
  const getFavoriteNftsData = async (id: number) => {
    const res = await getFavorite(id, 2);
    setFavouriteNft(res?.favouriteNfts);
  };

  const statsNftFilter = () => {
    let arr: any = [];
    arr.push(
      ...filterStats.filter((item) => {
        let count = 0;
        let check = false;
        item.attributes.forEach((val: any) => {
          if (count < 9 && val.trait_type.includes("IV_")) {
            count = count + 1;
            let dynamicField: any = `IV_${count}`;
            let { [dynamicField]: value }: any = stats;
            if (dynamicField === "IV_1") {
            }
            if (
              Number(val.value) >= Number(value[0]) &&
              Number(val.value) <= Number(value[1])
            ) {
              check = true;
            } else {
              check = false;
              count = 10;
            }
          }
        });
        return check ? item : "";
      })
    );
    setFilterNfts(arr);
  };

  const removeCategory = (val: string) => {
    let index = category.indexOf(val);
    if (index > -1) {
      category.splice(index, 1);
      CategoryFilterNftsData(category);
    }
  };
  const clearCategory = () => {
    setCategory([]);
    setFilterNfts(categoryFilters);
  };
  const transferNfts = () => {
    if (itemInstanceId.length > 0) {

      navigate(`/SeedNftTransfer2`, {
        state: { itemInstanceId, isMinted }
      });
    } else {
      toast.error("You have to select at least one NFT");
    }
  };
  useEffect(() => {

    if (props.LoggedOut === true) {
      setNfts(null);
      setFilterNfts(null)
      setLoading(false);
    }
  }, [props.LoggedOut]);

  useEffect(() => {
    if (props.LoggedIn === true) {
      let publickey = Wallets
      setUserId(publickey?.wallet?._id);
      // getFavoriteNftsData(publickey?.wallet?._id);
      fetchNftsFromPlayFab();
    }
  }, [props.LoggedIn]);

  useEffect(() => {
    FilterNftsData();
  }, [searchTerm]);
  return (
    <>
      <section className="product-collection">
        <Container className="block-container p-0">
          <Row>
            <Col lg={12} className="p-0">
              <div className="collection-content">
                <CollectionFilter
                  CategoryFilter={CategoryFilter}
                  Category={category}
                  StatsFilter={statsFilter}
                />

                <div className="search-and-nft">
                  <SearchBar Nfts={searchFilter} updateSearch={FilterSearch} />

                  <div className="search-filter-catagory mb-3 ps-3">
                    {category &&
                      category.length > 0 &&
                      category.map((val, ind) => {
                        return (
                          <span className="search-filter-type" key={ind}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 1.00714L8.99286 0L5 3.99286L1.00714 0L0 1.00714L3.99286 5L0 8.99286L1.00714 10L5 6.00714L8.99286 10L10 8.99286L6.00714 5L10 1.00714Z"
                                fill="white"
                                fillOpacity="0.6"
                                onClick={() => removeCategory(val)}
                              />
                            </svg>
                            {searchTerm}: {val}
                          </span>
                        );
                      })

                    }
                    {category.length > 0 ? (
                      <span className="clear-all" onClick={clearCategory}>
                        Clear all
                      </span>
                    ) : null}
                  </div>


                  <div className="nft-wrapper">
                    {loading ? <FullPageLoader /> : filterNfts && filterNfts.length > 0 ? (
                      filterNfts.map((val, ind) => {
                        return (
                          <div
                            className={"nft-card-content-filter"}
                            key={ind}
                          >
                            <div className="nft-card position-relative">
                              <div className="nft-card-cat">
                                <span>{val?.nftLevel}</span>
                              </div>
                              <div className="nft-img">
                                {dropdownClicked ? (
                                  <>
                                    <div className="nft-checkbox-wrapper">
                                      <label className="nft-checkbox-container">
                                        <input
                                          type="checkbox"
                                          onChange={() =>
                                            handleChange(val.itemInstanceId, val.mintedAddress
                                            )
                                          }
                                        />
                                        <span className="nft-checkmark"></span>
                                      </label>
                                    </div>
                                    {itemInstanceId.includes(val.itemInstanceId) ?
                                      <>
                                        <figure className="mb-0 top-check-shap">
                                          <img className="h-auto" src={TopCheckShap} alt="Side shap" />
                                        </figure>
                                        <figure className="mb-0 bottom-check-shap">
                                          <img className="h-auto" src={BottomCheckShap} alt="Side shap" />
                                        </figure>
                                      </>
                                      : ""
                                    }
                                  </>
                                ) : null}
                                {mintToWallet ? (
                                  <>
                                    <div className="nft-checkbox-wrapper">
                                      <label className="nft-checkbox-container">
                                        <input
                                          type="checkbox"
                                          onChange={() =>
                                            handleChange(val.itemInstanceId, val.mintedAddress
                                            )
                                          }
                                        />
                                        <span className="nft-checkmark"></span>
                                      </label>
                                    </div>
                                    {itemInstanceId.includes(val.itemInstanceId) ?
                                      <>
                                        <figure className="mb-0 top-check-shap">
                                          <img className="h-auto" src={TopCheckShap} alt="Side shap" />
                                        </figure>
                                        <figure className="mb-0 bottom-check-shap">
                                          <img className="h-auto" src={BottomCheckShap} alt="Side shap" />
                                        </figure>
                                      </>
                                      : ""
                                    }
                                  </>
                                ) : null}

                                <span
                                  role="button"
                                  className="text-decoration-none text-black"
                                  onClick={() => DetailPage(val.itemInstanceId)}
                                >
                                  <img
                                    className="img-fluid"
                                    src={val?.image}
                                    alt="NFT Image"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "NftOwner",
                                        val?.mintedAddress
                                      );
                                    }}
                                  />
                                </span>
                              </div>
                              <div className="nft-card-body">
                                <h6 className="nft-name">
                                  {val?.collection?.name}
                                </h6>
                                <div className="d-flex align-items-center justify-content-center flex-wrap">
                                  <span className="nft-category">
                                    {" "}
                                    {val?.collection?.family}
                                  </span>
                                  <span className="nft-id me-0">{val?.name}</span>
                                </div>
                              </div>
                              <div className="nft-card-footer">
                                <div className="d-flex justify-content-between align-items-center">
                                  {["up"].map((direction) => (
                                    <Dropdown
                                      className="menu-dropdown img-input-wrapper position-relative"
                                      as={ButtonGroup}
                                      key={direction}
                                      id={`dropdown-button-drop-${direction}`}
                                      drop="up"
                                      title={` Drop ${direction} `}
                                      onClick={() => MobileTransferMenuShow(!MobileTransferMenu)}
                                    >
                                      <Dropdown.Toggle
                                        variant="none"
                                        className="card-menu p-0 border-0"
                                      >
                                        <img className="img-fluid" src={CardMenu} alt="Menu icon" />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="menu-content dropdown-button--bg position-absolute">
                                        <div className="img-input dropdown-bg-gradient p-0 w-100">
                                          <Dropdown.Item
                                            onClick={() => {
                                              val.mintedAddress ? setDropDownClick(true) : setMintToWallet(true);
                                            }}
                                          >
                                            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M25 4.93335L19.8916 0V3.69755H0V6.17112H19.8916V9.86866L25 4.93335Z" fill="#E3D99B" />
                                              <path d="M0 17.0642L5.10835 21.9995V18.302H25V15.8284H5.10835V12.1309L0 17.0642Z" fill="#E3D99B" />
                                            </svg>
                                            Transfer to Game
                                          </Dropdown.Item>
                                        </div>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  ))}
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
                        );
                      })
                    ) : (
                      <div
                        className="alert nft-alert mb-0"
                        role="alert"
                      >
                        <div className="dropdown-button--bg text-center d-inline-block">
                          <div className="img-input text-center w-100">
                            <span className="text-danger p-lg">No Item Found</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={`sidebar-overlay ${!MobileTransferMenu ? 'active' : ''}`}></div>
              <div className={`mobile-menu-content dropdown-button--bg d-lg-none ${MobileTransferMenu ? "mobile-menu-content-position" : ""}`}>
                <div className="img-input dropdown-bg-gradient p-0 w-100">
                  <div
                    onClick={() => {
                      setDropDownClick(true);
                    }}
                    ref={refOne}
                  >
                    <svg className="me-2" width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 4.93335L19.8916 0V3.69755H0V6.17112H19.8916V9.86866L25 4.93335Z" fill="#E3D99B" />
                      <path d="M0 17.0642L5.10835 21.9995V18.302H25V15.8284H5.10835V12.1309L0 17.0642Z" fill="#E3D99B" />
                    </svg>
                    Transfer to Game
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {dropdownClicked ? (
        <div className="bottom-btns-area">
          <Container fluid className="block-container">
            <Row>
              <Col>
                <button
                  className="bottom-btn cancel-btn bg-transparent border-0 token-trans-link text-center position-relative p-0" onClick={() => {
                    setDropDownClick(!dropdownClicked);
                    setNftsDataIds([]);
                  }}
                >
                  <figure className="mb-0">
                    <img className="img-fluid" src={CancelBg} alt="token-bg" />
                  </figure>
                  <span>Cancel</span>
                </button>
                <button
                  className="bottom-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                  onClick={transferNfts}
                >
                  <figure className="mb-0">
                    <img className="img-fluid" src={tokenBg} alt="token-bg" />
                  </figure>
                  <span>Transfer to Game</span>
                </button>
              </Col>
            </Row>
          </Container>
        </div>
      ) : null}
      {mintToWallet ? (
        <div className="bottom-btns-area">
          <Container fluid className="block-container">
            <Row>
              <Col>
                <button
                  className="bottom-btn cancel-btn bg-transparent border-0 token-trans-link text-center position-relative p-0" onClick={() => {
                    setMintToWallet(!mintToWallet);
                    setNftsDataIds([]);
                  }}
                >
                  <figure className="mb-0">
                    <img className="img-fluid" src={CancelBg} alt="token-bg" />
                  </figure>
                  <span>Cancel</span>
                </button>
                <button
                  className="bottom-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                  onClick={transferNfts}
                >
                  <figure className="mb-0">
                    <img className="img-fluid" src={tokenBg} alt="token-bg" />
                  </figure>
                  <span>Mint to Wallet</span>
                </button>
              </Col>
            </Row>
          </Container>
        </div>
      ) : null}
    </>
  );
};
