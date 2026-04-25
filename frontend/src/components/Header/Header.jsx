import { useState } from "react";
import styles from "./headerStyles.module.css";
import logo from "../../assets/ArattaSVG.svg";
import petIcon from "../../assets/pet.png";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const pages = [
    t("nav.home"),
    t("nav.homes"),
    t("nav.about"),
  ];

  const pageRoutes = ["/", "/homes", "/about_us"];

  const languages = [
  { code: "arm", label: "", flag: "🇦🇲" },
  { code: "en", label: "", flag: "🇬🇧" },
  { code: "ru", label: "", flag: "🇷🇺" },
];

const currentLanguage =
  languages.find((language) => language.code === i18n.language) || languages[0];

  const navigate = useNavigate();
  const location = useLocation();

  const activePage = pageRoutes.indexOf(location.pathname);

  const handleChangePage = (index) => {
    navigate(pageRoutes[index]);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("aratta-language", language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <div className={styles.headerContainer}>
      <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        <img src={logo} alt="Logo" style={{ width: 180, height: 60 }} />
      </div>

      <div className={styles.pagesContainer}>
        {pages.map((page, index) => (
          <p
            key={index}
            className={
              activePage === index ? styles.pageTxtActive : styles.pageTxt
            }
            onClick={() => handleChangePage(index)}
          >
            {page}
          </p>
        ))}
      </div>

      <div className={styles.headerRight}>
        <div className={styles.petFriendlyContainer}>
          <img src={petIcon} alt="Pet Icon" className={styles.petIcon} />
          <span className={styles.petText}>{t("header.petFriendly")}</span>
        </div>

      <div className={styles.languageDropdown}>
        <button
          type="button"
          className={styles.languageMainButton}
          onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
        >
          <span className={styles.languageFlag}>{currentLanguage.flag}</span>
          <span>{currentLanguage.label}</span>
          <span className={styles.languageArrow}>⌄</span>
        </button>

        {isLanguageMenuOpen && (
          <div className={styles.languageMenu}>
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                className={
                  i18n.language === language.code
                    ? styles.languageMenuItemActive
                    : styles.languageMenuItem
                }
              >
                <span className={styles.languageFlag}>{language.flag}</span>
                <span>{language.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Header;