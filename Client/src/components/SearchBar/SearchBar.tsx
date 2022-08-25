import { useState, useEffect, ChangeEvent } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./SearchBar.css";
const SearchBar = (props: any) => {
  const [nfts, setNfts] = useState<any | null>({});
  const [value, setValue] = useState('');
  const [dropdownClicked, setDropDownClick] = useState<boolean>(false);
  const [categoryCheck, setCategoryCheck] = useState([]);
  const [collectionCheck, setCollectionCheck] = useState([]);
  let cate = []
  let collect = []

  // const onSearch = (searchTerm: string) => {
  //   setValue(searchTerm);
  //   let arr: any[] = [];
  //   for (const item of nfts.category.name) {
  //     if (searchTerm.includes(item)) {
  //       arr.push(item);
  //     }
  //     setNfts(arr);
  //   }
  // };
  const handleSearch = (name: string) => {
    // onSearch(name);
    setValue(name);
    setDropDownClick(true);
    props.updateSearch(name, name);
  };
  useEffect(() => {
    setNfts(props.Nfts);
    props.updateSearch(value, value);
  }, [props.Nfts, value]);
  const handleChange = (e: any) => {

    setValue(e.target.value);
    setDropDownClick(false);
    let category = nfts?.category?.name.filter((item: any) => {
      if (item != null) {
        return item.toLowerCase().includes(e.target.value.toLowerCase());
      }
    })
    let collection = nfts?.collection?.name.filter((item) => {
      if (item != null) {
        return item.toLowerCase().includes(e.target.value.toLowerCase());
      }
    })
    setCategoryCheck(category);
    setCollectionCheck(collection);
  };
  return (
    <section className="search-bar">
      <Container fluid className="block-container">
        <Row>
          <Col lg={12}>
            <div className="search-sorting">
              <div className="serach-input-wrapper position-relative">
                <div className="search-input dropdown-button--bg">
                  <input
                    type="text"
                    placeholder="Enter collection or category name"
                    value={value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  />
                </div>
                <div className="search-icon">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2_72)">
                      <path
                        d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                        fill="#E3D99B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2_72">
                        <rect
                          width="24.0238"
                          height="24"
                          fill="white"
                          transform="translate(0.0317383)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="search-dropdown">
                  {value ? (
                    !dropdownClicked ? (
                      collectionCheck && collectionCheck.length > 0 ? (
                        <div className="dropdown-row">
                          <h6> Collection</h6>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : null}
                  {nfts && nfts?.collection?.name.length > 0
                    ? nfts?.collection?.name
                      .filter((item, index) => {
                        if (item != null) {
                          const searchTerm = value ? value.toLowerCase() : "";
                          if (item.toLowerCase().includes(searchTerm)) {
                            collect.push(index)
                            return (
                              searchTerm &&
                              item.toLowerCase().includes(searchTerm)
                            );

                          }
                        }
                        else {
                          return null
                        }
                      })
                      .map((item, index) => (
                        <div
                          onClick={() => handleSearch(item)}
                          className="dropdown-row w-100"
                          key={collect[index]}
                        >
                          <span
                          // onClick={() => props.updateSearch(item, true)}
                          >
                            {item} {""} ({nfts?.collection.counts[collect[index]]})
                            items
                          </span>
                        </div>
                      ))
                    : ""}
                  {value ? (
                    !dropdownClicked ? (

                      categoryCheck && categoryCheck.length > 0 ? (
                        <div className="dropdown-row">
                          <h6> Category</h6>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : null}

                  {nfts && nfts?.category?.name.length > 0
                    ? nfts?.category?.name
                      .filter((item, index) => {
                        if (item != null) {
                          const searchTerm = value ? value.toLowerCase() : "";
                          if (item.toLowerCase().includes(searchTerm)) {
                            cate.push(index)
                            return (
                              searchTerm &&
                              item.toLowerCase().includes(searchTerm)
                            );
                          }
                        }
                        else {
                          return null;
                        }
                      })
                      .map((item, index) => (
                        <div
                          onClick={() => handleSearch(item)}
                          className="dropdown-row"
                          key={cate[index]}
                        >
                          <span
                          // onClick={() => props.updateSearch(item, true)}
                          >
                            {item} {""} ({nfts?.category.counts[cate[index]]}) items
                          </span>
                        </div>
                      ))
                    : null}
                </div>
              </div>
              {/* <div className="sorting">
                <span className="sort-by">Sort by</span>
                <DropdownButton
                  title="Newest"
                  className="sorting-dropdown dropdown-button--bg"
                >
                  <Dropdown.Item>Newest</Dropdown.Item>
                  <Dropdown.Item>Oldest</Dropdown.Item>
                  <Dropdown.Item>Level Highest</Dropdown.Item>
                  <Dropdown.Item>Level Lowest</Dropdown.Item>
                </DropdownButton>
              </div> */}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default SearchBar;
