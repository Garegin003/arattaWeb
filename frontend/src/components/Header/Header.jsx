import styles from "./headerStyles.module.css";
import logo from "../../assets/ArattaSVG.svg";
import petIcon from "../../assets/pet.png";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const pages = ["Գլխավոր", "Տներ", "Մեր մասին"];
  const pageRoutes = ["/", "/homes", "/about_us", "/contact_us"]; // "/" for main page

  const navigate = useNavigate();
  const location = useLocation();

  const activePage = pageRoutes.indexOf(location.pathname);

  const handleChangePage = (index) => {
    if (pageRoutes[index] !== "#") {
      navigate(pageRoutes[index]);
    }
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to main page
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
      <div className={styles.petFriendlyContainer}>
        <img src={petIcon} alt="Pet Icon" className={styles.petIcon} />
        <span className={styles.petText}>Pet friendly</span>
      </div>
    </div>
  );
};

export default Header;
