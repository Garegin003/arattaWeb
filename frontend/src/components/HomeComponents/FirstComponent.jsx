import styles from "./firstComponent.module.css";
import ArrowDown from "./../../assets/ArrowDown.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const FirstComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openDropdown, setOpenDropdown] = useState(null);

  const [filters, setFilters] = useState({
    deal: "",
    region: "",
    type: "",
  });

  const dealOptions = [
    { value: "Վաճառք", label: t("filters.deal.sale") },
    { value: "Վարձակալություն", label: t("filters.deal.rent") },
    {
      value: "Երկարաժամկետ վարձակալություն",
      label: t("filters.deal.longTermRent"),
    },
    {
      value: "Կարճաժամկետ վարձակալություն",
      label: t("filters.deal.shortTermRent"),
    },
  ];

  const regionOptions = [
    { value: "Հայաստան", label: t("filters.region.armenia") },
    { value: "Արտերկիր", label: t("filters.region.abroad") },
  ];

  const typeOptions = [
    { value: "Կոմերցիոն", label: t("filters.type.commercial") },
    { value: "Ամառանոց", label: t("filters.type.summerHouse") },
    { value: "Բնակարան", label: t("filters.type.apartment") },
    { value: "Տուն", label: t("filters.type.house") },
    { value: "Թաունհաուս", label: t("filters.type.townhouse") },
  ];

  const getSelectedLabel = (options, value, placeholderKey) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : t(placeholderKey);
  };

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
            key={opt.value}
            className={styles.dropdownItem}
            onClick={() => selectOption(dropdown, opt.value)}
          >
            {opt.label}
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
        <h1 className={styles.title}>{t("home.heroTitle")}</h1>

        <p className={styles.txt}>{/* */}</p>

        <div
          className={styles.filterContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.filter} onClick={() => toggleDropdown("deal")}>
            <p className={styles.filterTxt}>
              {getSelectedLabel(
                dealOptions,
                filters.deal,
                "filters.placeholders.deal"
              )}
            </p>

            <img src={ArrowDown} alt="" />
            {renderDropdown("deal", dealOptions)}
          </div>

          <div
            className={styles.filter}
            onClick={() => toggleDropdown("region")}
          >
            <p className={styles.filterTxt}>
              {getSelectedLabel(
                regionOptions,
                filters.region,
                "filters.placeholders.region"
              )}
            </p>

            <img src={ArrowDown} alt="" />
            {renderDropdown("region", regionOptions)}
          </div>

          <div className={styles.filter} onClick={() => toggleDropdown("type")}>
            <p className={styles.filterTxt}>
              {getSelectedLabel(
                typeOptions,
                filters.type,
                "filters.placeholders.type"
              )}
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