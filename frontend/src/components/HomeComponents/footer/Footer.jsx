import styles from "./footer.module.css";
import logo from "../../../assets/ArattaSVG.svg";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <img src={logo} alt="Logo"  width={180} height={50} />
          <p className={styles.tagline}>
            Ձեր վստահելի գործընկերը անշարժ գույքի ոլորտում
          </p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.column}>
            <h3>Հետևեք մեզ</h3>
            <div className={styles.socialIcons}>
              <a
                href="https://www.instagram.com/aratta_real_estate/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.iconDiv} ${styles.instagram}`}
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/aratta.realestate"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.iconDiv} ${styles.facebook}`}
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3>Կոնտակտային տվյալներ</h3>
            <ul>
              <li>
                <strong>Հասցե՝</strong>{" "}
                <a
                  href="https://www.google.com/maps/place/Nairi+Zaryan+St+74B,+Yerevan,+Armenia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ք․ Երևան, Նաիրի Զարյան 74B
                </a>
              </li>
              <li>
                <strong>Հեռ․:</strong>{" "}
                <a href="tel:+37433897919">+374 33 89 79 19</a>
              </li>
              <li>
                <strong>Էլ․ հասցե՝</strong>{" "}
                <a href="mailto:arattarealestate@gmail.com">
                  arattarealestate@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        © 2025 Aratta Real Estate. Բոլոր իրավունքները պաշտպանված են։
      </div>
    </footer>
  );
};
