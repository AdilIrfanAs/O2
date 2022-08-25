import { Connection, clusterApiUrl } from "@solana/web3.js";
import { programs } from "@metaplex/js";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import { addToFavorite, getFavorite } from "../../../utils/api/Web3.api";
import RightGear from "../../../assets/images/card-right-gear.png"
import LeftGear from "../../../assets/images/card-left-gear.png"
import CardMenu from "../../../assets/images/card-menu-icon.png"
import TopCheckShap from "../../../assets/images/top-card-check-shap.svg"
import BottomCheckShap from "../../../assets/images/bottom-card-check-shap.svg"
import tokenBg from "../../../assets/images/token-trans-bg3.png"
import CancelBg from "../../../assets/images/cancel-bg.png"
import { useNavigate } from "react-router-dom";
import FullPageLoader from "../../Loader/Loader";
import SearchBar from "../../SearchBar/SearchBar"
import CollectionFilter from "../../CollectionFilter/CollectionFilter"
export const FavoriteNft = (props: any) => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<any[] | null>(null);
  const [url, setUrl] = useState<any[] | null>(null);
  const [urlId, setUrlId] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [dropdownClicked, setDropDownClick] = useState<boolean>(false);
  const [searchDropdownClicked, setSearchDropDownClick] = useState<boolean>(false);
  const [favouriteNft, setFavouriteNft] = useState([]);
  const [userId, setUserId] = useState();
  const [mintAddress, setMintAddress] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [NftsDataIds, setNftsDataIds] = useState([]);
  const [category, setCategory] = useState([]);
  const [filterNfts, setFilterNfts] = useState([]);
  const [filterStats, setFilterState] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [nftsDataMintAddress, setNftsDataMintAddress] = useState([]);
  const [MobileTransferMenu, MobileTransferMenuShow] = useState(true)
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
  const [searchFilter, setSearchFilter] = useState({
    collection: { name: [], counts: [] },
    category: { name: [], counts: [] },
  });
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

  let publickey = JSON.parse(localStorage.getItem("Wallets"));
  const collectionAddress: any = process.env.REACT_APP_UPDATE_AUTHORITY;
  let collection = JSON.parse(collectionAddress);

  const getNfts = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    let ownerPublickey = publickey.wallet?.sol?.public_key;
    const nftsmetadata2 = await programs.metadata.Metadata.findDataByOwner(
      connection,
      ownerPublickey
    );
    return nftsmetadata2;
  };
  const handleChange = (id: string, mint: string) => {
    let resArr = NftsDataIds.filter((value) => {
      return value.includes(id);
    });
    let resArr1 = nftsDataMintAddress.filter((value) => {
      return value.includes(mint);
    });
    if (resArr[0] && resArr1[0]) {
      let index = NftsDataIds.indexOf(id);
      let index1 = nftsDataMintAddress.indexOf(mint);
      if (index > -1) {
        NftsDataIds.splice(index, 1);
      }
      if (index1 > -1) {
        nftsDataMintAddress.splice(index, 1);
      }
    } else {
      NftsDataIds.push(id);
      nftsDataMintAddress.push(mint);
    }
    setChecked(!checked);
  };
  const transferNfts = () => {
    if (NftsDataIds.length > 0) {
      navigate(`/SeedNftTransfer`, {
        state: [NftsDataIds, nftsDataMintAddress],
      });
    } else {
      toast.error("You have to select at least one NFT");
    }
  };
  //Function to get all nft data
  const getNftTokenData = async () => {
    try {
      if (publickey) {
        setLoading(true);
        let nftData: any = await getNfts();
        let arr: any[] = [];
        let uri: any[] = [];
        let mint: any[] = [];
        let uriId: any[] = [];
        let max = 0;
        for (const item of nftData) {
          if (favouriteNft.includes(item.mint)) {
            if (collection.includes(item?.collection?.key)) {
              let val = await axios.get(item.data.uri);
              if (val) {
                val.data.attributes.forEach((val: any) => {
                  if (val.trait_type.includes("IV_")) {
                    let value = val.trait_type.split("_")
                    if (max < value[1]) {
                      max = Number(value[1])
                    }
                  }
                })
              }
              let level: any = "IV_" + max

              let data: any = { ...val.data, mintAddress: item.mint, url: item.data.uri, nftLevel: level }
              let uriVal = item.data.uri.split("/");
              let id = uriVal[uriVal.length - 1];
              mint.push(item.mint);
              uriId.push(id);
              arr.push(data);
              uri.push(item.data.uri);
            }
          }
        }
        if (mint.length > 0) {
          setUrlId(uriId);
          setUrl(uri);
          setNfts(arr);
          setFilterNfts(arr);
          setMintAddress(mint);
          setColectionCategory(arr)
          setCategoryFilters(arr);
          setFilterState(arr);
          setLoading(false)
        }
        setLoading(false)
      }

    } catch (error) {
      console.log(error);
    }
  };
  const getFavoriteNftsData = async (id: number) => {
    const res = await getFavorite(id, 2);
    setFavouriteNft(res?.favouriteNfts);
  };
  const FilterSearch = (searchTerm: any, dropDownClick: any) => {
    setSearchTerm(searchTerm);
    setSearchDropDownClick(dropDownClick);
  };
  const FilterNftsData = () => {
    let arr: any = [];
    if (searchTerm) {
      arr.push(
        ...nfts.filter((item) => {
          if (searchTerm) {
            if (item?.collection.family != null && item?.collection.name != null) {
              return (
                item?.collection.family
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                item?.collection.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              );
            }
          } else {
            return item;
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
  const addToFavoriteList = async (address: any) => {
    const res = await addToFavorite(userId, address, 2);
    if (res?.status) {
      getFavoriteNftsData(userId);
    }
  };


  const DetailPage = (url: any, ind: any) => {
    navigate(`/nft-details/${ind}`, {
      state: url,
    });
  };
  const CategoryFilter = (category: any) => {
    setCategory(category);
    CategoryFilterNftsData(category);
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
  const statsFilter = (values: any) => {
    setStats(values);
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

  useEffect(() => {
    statsNftFilter();
  }, [stats]);
  useEffect(() => {
    getNftTokenData();
  }, [favouriteNft]);
  useEffect(() => {
    let publickey = JSON.parse(localStorage.getItem("Wallets"));
    setUserId(publickey?.wallet?._id);
    if (props.LoggedIn === true) {
      getNftTokenData();
      // getFavoriteNftsData(publickey?.wallet?._id);
    }
  }, [props.LoggedIn]);
  useEffect(() => {
    if (props.LoggedOut === true) {
      setNfts(null);
      setLoading(false);
      setFilterNfts(null)
      setUserId(null);
    }
  }, [props.LoggedOut]);
  useEffect(() => {
    FilterNftsData();
    clearCategory()
  }, [searchTerm]);
  useEffect(() => {
    CategoryFilterNftsData(category);
  }, [category]);
  return (
    <>
      <section className="product-collection">
        <Container className="block-container">
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

                  <div className="search-and-nft">
                    <div className="nft-wrapper">
                      {loading ? <FullPageLoader /> : null}
                      {filterNfts &&
                        filterNfts.length > 0 &&
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
                                              handleChange(
                                                val.url,
                                                val.mintAddress
                                              )
                                            }
                                          />
                                          <span className="nft-checkmark"></span>
                                        </label>
                                      </div>
                                      {nftsDataMintAddress.includes(val.mintAddress) ?
                                        <>
                                          <figure className="mb-0 top-check-shap">
                                            <img className="h-auto" src={TopCheckShap} alt="Side shap" />
                                          </figure>
                                          <figure className="mb-0 bottom-check-shap">
                                            <img className="h-auto" src={BottomCheckShap} alt="Side shap" />
                                          </figure>
                                        </> : null}
                                    </>
                                  ) : null}

                                  <div
                                    role="button"
                                    className="text-decoration-none text-black"
                                    onClick={() => DetailPage(val.url, val.mintAddress)}
                                  >
                                    <img
                                      className="img-fluid"
                                      src={val?.image}
                                      alt="NFT Image"
                                      onClick={() => {
                                        localStorage.setItem(
                                          "NftOwner",
                                          val.mintAddress
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="nft-card-body">
                                  <h6 className="nft-name">
                                    {val.collection.name}
                                  </h6>
                                  <span className="nft-category">
                                    {" "}
                                    {val?.collection?.family}
                                  </span>
                                  <span className="nft-id">{val?.name}</span>
                                </div>
                                <div className="nft-card-footer">
                                  <div className="d-flex justify-content-between align-items-center">
                                    {["up"].map((direction) => (
                                      <Dropdown
                                        className="menu-dropdown img-input-wrapper position-relative me-0"
                                        as={ButtonGroup}
                                        key={direction}
                                        id={`dropdown-button-drop-${direction}`}
                                        drop="up"
                                        title={` Drop ${direction} `}
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
                                                setDropDownClick(true);
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
                        })}
                    </div>
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
                  <div
                    onClick={() => {
                      setDropDownClick(true);
                    }}
                    ref={refOne}
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
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
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
    </>
  );
};
