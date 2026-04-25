import styles from "./firstComponent.module.css";
import ArrowDown from "./../../assets/ArrowDown.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const FirstComponent = () => {
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    deal: "",
    region: "",
    type: "",
  });

  const dealOptions = [
    "Վաճառք",
    "Վարձակալություն",
    "Երկարաժամկետ վարձակալություն",
    "Կարճաժամկետ վարձակալություն",
  ];
  const regionOptions = ["Հայաստան", "Արտերկիր"];
  const typeOptions = ["Կոմերցիոն", "Ամառանոց", "Բնակարան", "Տուն", "Թաունհաուս"];

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const selectOption = (dropdown, value) => {
    setFilters({ ...filters, [dropdown]: value });
    setOpenDropdown(null);
  };

  const renderDropdown = (dropdown, options) =>
      openDropdown === dropdown && (
          <div className={styles.dropdown}>
            {options.map((opt) => (
                <div
                    key={opt}
                    className={styles.dropdownItem}
                    onClick={() => selectOption(dropdown, opt)}
                >
                  {opt}
                </div>
            ))}
          </div>
      );

  const handleSearch = () => {
    const openDropdowns = Object.keys(filters).filter((key) => filters[key]);
    navigate("/homes", { state: { filters, openDropdowns } });
  };

  return (
      <div className={styles.photoBackground}>
        <div className={styles.overlay} onClick={() => navigate("/homes")}>
          <h1 className={styles.title}>
            Ձեր ուղին դեպի հուսալի գույք և ներդրումներ
          </h1>
          <p className={styles.txt}>
          {/*  */}
          </p>

          <div
              className={styles.filterContainer}
              onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.filter} onClick={() => toggleDropdown("deal")}>
              <p className={styles.filterTxt}>
                {filters.deal || "Գործարքի տեսակ"}
              </p>
              <img src={ArrowDown} alt="" />
              {renderDropdown("deal", dealOptions)}
            </div>

            <div className={styles.filter} onClick={() => toggleDropdown("region")}>
              <p className={styles.filterTxt}>
                {filters.region || "Տարածաշրջան"}
              </p>
              <img src={ArrowDown} alt="" />
              {renderDropdown("region", regionOptions)}
            </div>

            <div className={styles.filter} onClick={() => toggleDropdown("type")}>
              <p className={styles.filterTxt}>
                {filters.type || "Գույքի տեսակ"}
              </p>
              <img src={ArrowDown} alt="" />
              {renderDropdown("type", typeOptions)}
            </div>

            <div className={styles.searchBtn} onClick={handleSearch}>
              <img src={SearchIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
  );
};
