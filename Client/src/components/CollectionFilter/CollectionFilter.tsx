import { useState, useEffect, useRef } from "react";
import OuthBg from "../../assets/images/token-trans-bg3.png"
import "./CollectionFilter.css";
import FilterSlider from "./FilterSlider";
import { Dropdown } from "react-bootstrap";

const CollectionFilter = (props: any) => {

  //states

  const [filterAnim, ShowFilters] = useState<boolean>(false)
  const [category, setCategory] = useState<string[]>([]);
  const [showDrop, setdropdown] = useState<boolean>(true)
  const [showDrop2, setdropdown2] = useState<boolean>(true)
  const [showDrop3, setdropdown3] = useState<boolean>(true)
  const [showDrop4, setdropdown4] = useState<boolean>(true)
  const [allCategory, setAllCategory] = useState<boolean>(false)
  const refOne = useRef(null);
  const { onClickOutside } = props;



  const handleClickOutside = (event: any) => {
    if (!refOne.current.contains(event.target)) {
      ShowFilters(false)
    }
  };

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

  const handleCategory = (value: string) => {
    let resArr = category.filter((val) => {
      return val.includes(value);
    });
    if (resArr[0]) {
      let index = category.indexOf(value);
      if (index > -1) {
        category.splice(index, 1);
      }
    } else {
      category.push(value);
    }
    props.CategoryFilter(category);
  };
  const restValues = (key: any) => {
    setStats({ ...stats, [key]: [0, 100] });
  };
  const handleAllCategory = (value) => {
    setAllCategory(value)
    if (value) {
      category.splice(0, category.length)
      category.push("Armor", "Zeds", "Headgear", "Weapon", "Top Armor", "Bow", "Bottom Armor", "Sword", "Gloves", "Footgear");
      props.CategoryFilter(category)
    }
    else {
      category.splice(0, category.length)
      props.CategoryFilter(category)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, [onClickOutside]);

  useEffect(() => {
    
    props.StatsFilter(stats);
  }, [stats]);
  useEffect(() => {
    setCategory(props.Category);
    if (props.Category.length > 0) {
      setCategory(props.Category);
    }
    else {
      setCategory(props.Category);
      setAllCategory(false)
    }
  }, [props.Category])

  return (
    <>
      <div className={`sidebar-overlay ${filterAnim ? 'active' : ''}`}></div>
      <div ref={refOne} className={`collection-filters ${filterAnim ? "filter-anim" : ""}`}>
        <div className="fram position-relative">
          <h3 className="fram-title">Filter</h3>
          <div className="filters fram-content">
            {/* <span className='sort-by'>Sort by</span> */}
            <Dropdown title="Category" className="filters-dropdown mb-3" autoClose={false}>
              <div className="dropdown-button--bg">
                <Dropdown.Toggle id="dropdown-autoclose-false" className={`${!showDrop4 ? "arrow-rotate" : ""}`} onClick={() => setdropdown4(dropDownToggle => !dropDownToggle)}>
                  Categories
                </Dropdown.Toggle>
              </div>
              <Dropdown.Menu show
                className={`px-0 pb-0 ${showDrop4 ? "showdrop" : ""}`}>
                <Dropdown title="Category" className="filters-dropdown" autoClose={false}>
                  <div className="dropdown-button--bg">
                    <Dropdown.Toggle id="dropdown-autoclose-false" className={`${!showDrop ? "arrow-rotate" : ""}`} onClick={() => setdropdown(dropDownToggle => !dropDownToggle)}>
                      <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12H3.33333V8H0V12ZM0 20H3.33333V16H0V20ZM0 4H3.33333V0H0V4ZM6.66667 12H30V8H6.66667V12ZM6.66667 20H30V16H6.66667V20ZM6.66667 0V4H30V0H6.66667Z" fill="#E3D99B" />
                      </svg>
                      Zeds
                    </Dropdown.Toggle>
                  </div>
                  <Dropdown.Menu show
                    className={`${showDrop ? "showdrop" : ""}`}>
                    <label className="checkbox-container">
                      Armor
                      <input
                        type="checkbox"
                        checked={category.includes("Armor") ? true : false}
                        onClick={() => handleCategory("Armor")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Zeds
                      <input
                        type="checkbox"
                        checked={category.includes("Zeds") ? true : false}
                        onClick={() => handleCategory("Zeds")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    {/* </div> */}
                    {/* <div className="checkbox-wrapper"> */}
                    <label className="checkbox-container">
                      Headgear
                      <input
                        type="checkbox"
                        checked={category.includes("Headgear") ? true : false}
                        onClick={() => handleCategory("Headgear")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Weapon
                      <input
                        type="checkbox"
                        checked={category.includes("Weapon") ? true : false}
                        onClick={() => handleCategory("Weapon")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    {/* </div> */}
                    <label className="checkbox-container">
                      Top Armor
                      <input
                        type="checkbox"
                        checked={category.includes("Top Armor") ? true : false}
                        onClick={() => handleCategory("Top Armor")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Bow
                      <input
                        type="checkbox"
                        checked={category.includes("Bow") ? true : false}
                        onClick={() => handleCategory("Bow")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Bottom Armor
                      <input
                        type="checkbox"
                        checked={category.includes("Bottom Armor") ? true : false}
                        onClick={() => handleCategory("Bottom Armor")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Sword
                      <input
                        type="checkbox"
                        checked={category.includes("Sword") ? true : false}
                        onClick={() => handleCategory("Sword")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Glove
                      <input
                        type="checkbox"
                        checked={category.includes("Gloves") ? true : false}
                        onClick={() => handleCategory("Gloves")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Footgear
                      <input
                        type="checkbox"
                        checked={category.includes("Footgear") ? true : false}
                        onClick={() => handleCategory("Footgear")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      All
                      <input
                        type="checkbox"
                        checked={allCategory ? true : false}
                        onClick={() => handleAllCategory(!allCategory)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown title="Category" className="filters-dropdown" autoClose={false}>
                  <div className="dropdown-button--bg">
                    <Dropdown.Toggle id="dropdown-autoclose-false" className={`${!showDrop2 ? "arrow-rotate" : ""}`} onClick={() => setdropdown2(dropDownToggle => !dropDownToggle)}>
                      <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12H3.33333V8H0V12ZM0 20H3.33333V16H0V20ZM0 4H3.33333V0H0V4ZM6.66667 12H30V8H6.66667V12ZM6.66667 20H30V16H6.66667V20ZM6.66667 0V4H30V0H6.66667Z" fill="#E3D99B" />
                      </svg>
                      Armor
                    </Dropdown.Toggle>
                  </div>
                  <Dropdown.Menu show className={`${showDrop2 ? "showdrop" : ""}`}>
                    <div className="checkbox-wrapper ">
                      <label className="checkbox-container">
                        Armor
                        <input
                          type="checkbox"
                          checked={category.includes("Armor") ? true : false}
                          onClick={() => handleCategory("Armor")}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <label className="checkbox-container">
                        Zeds
                        <input
                          type="checkbox"
                          checked={category.includes("Zeds") ? true : false}
                          onClick={() => handleCategory("Zeds")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="checkbox-wrapper">
                      <label className="checkbox-container">
                        Headgear
                        <input
                          type="checkbox"
                          checked={category.includes("Headgear") ? true : false}
                          onClick={() => handleCategory("Headgear")}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <label className="checkbox-container">
                        Weapon
                        <input
                          type="checkbox"
                          checked={category.includes("Weapon") ? true : false}
                          onClick={() => handleCategory("Weapon")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="checkbox-wrapper">
                      <label className="checkbox-container">
                        Top Armor
                        <input
                          type="checkbox"
                          checked={category.includes("Top Armor") ? true : false}
                          onClick={() => handleCategory("Top Armor")}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <label className="checkbox-container">
                        Bow
                        <input
                          type="checkbox"
                          checked={category.includes("Bow") ? true : false}
                          onClick={() => handleCategory("Bow")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="checkbox-wrapper">
                      <label className="checkbox-container">
                        Bottom Armor
                        <input
                          type="checkbox"
                          checked={category.includes("Bottom Armor") ? true : false}
                          onClick={() => handleCategory("Bottom Armor")}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <label className="checkbox-container">
                        Sword
                        <input
                          type="checkbox"
                          checked={category.includes("Sword") ? true : false}
                          onClick={() => handleCategory("Sword")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <label className="checkbox-container">
                      Glove
                      <input
                        type="checkbox"
                        checked={category.includes("Gloves") ? true : false}
                        onClick={() => handleCategory("Gloves")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      Footgear
                      <input
                        type="checkbox"
                        checked={category.includes("Footgear") ? true : false}
                        onClick={() => handleCategory("Footgear")}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="checkbox-container">
                      All
                      <input
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </Dropdown.Menu>
                </Dropdown>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="filters-dropdown" autoClose={false}>
              <div className="dropdown-button--bg">
                <Dropdown.Toggle id="dropdown-autoclose-false" className={`${!showDrop3 ? "arrow-rotate" : ""}`} onClick={() => setdropdown3(dropDownToggle => !dropDownToggle)}>
                  Stats
                </Dropdown.Toggle>
              </div>
              <Dropdown.Menu show className={`stats-menu ${showDrop3 ? "showdrop" : ""}`}>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>HP</span>
                    <span>
                      <span onClick={() => restValues("IV_1")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_1: value })}
                    Value={stats.IV_1}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_1[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_1[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Physical Attack</span>
                    <span>
                      <span onClick={() => restValues("IV_2")}>Reset</span>{" "}
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_2: value })}
                    Value={stats.IV_2}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_2[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_2[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Magical Attack</span>
                    <span>
                      <span onClick={() => restValues("IV_3")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_3: value })}
                    Value={stats.IV_3}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_3[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_3[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Physical Defence</span>
                    <span>
                      <span onClick={() => restValues("IV_4")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_4: value })}
                    Value={stats.IV_4}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_4[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_4[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Magical Defence</span>
                    <span>
                      <span onClick={() => restValues("IV_5")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_5: value })}
                    Value={stats.IV_5}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_5[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_5[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Critical Chance</span>
                    <span>
                      <span onClick={() => restValues("IV_6")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_6: value })}
                    Value={stats.IV_6}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_6[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_6[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Water Resistance</span>
                    <span>
                      <span onClick={() => restValues("IV_7")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_7: value })}
                    Value={stats.IV_7}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_7[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_7[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Light Resistance</span>
                    <span>
                      <span onClick={() => restValues("IV_8")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_8: value })}
                    Value={stats.IV_8}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_8[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_8[1]} />
                    </div>
                  </div>
                </div>
                <div className="range-slider-content">
                  <div className="slider-header">
                    <span>Dark Resistance</span>
                    <span>
                      <span onClick={() => restValues("IV_9")}>Reset</span>
                    </span>
                  </div>
                  <FilterSlider
                    rtl={false}
                    MinMax={(value) => setStats({ ...stats, IV_9: value })}
                    Value={stats.IV_9}
                  />
                  <div className="min-max-wrapper">
                    <div className="min-max-input">
                      <input type="text" placeholder="Min" value={stats.IV_9[0]} />
                    </div>
                    <span>-</span>
                    <div className="min-max-input">
                      <input type="text" placeholder="Max" value={stats.IV_9[1]} />
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="mobile-filter-btn text-center w-100 d-lg-none">
        <button
          className="bottom-btn login-signup-btn login-btn bg-transparent border-0 token-trans-link text-center position-relative p-0 m-0"
          onClick={() => ShowFilters(!filterAnim)}
        >
          <figure className="mb-0">
            <img className="img-fluid" src={OuthBg} alt="token-bg" />
          </figure>
          <span>Filters</span>
        </button>
      </div>
    </>
  );
};
export default CollectionFilter;
