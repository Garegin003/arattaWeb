import styles from "./homeCard.module.css";
import homeImg from "../../../../assets/home.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "../../footer/Footer.jsx";

export const HomeCard = ({ id, home }) => {
  const firstImage = `https://api.arattarealestate.com${
    home?.img_uris?.split(";")?.[0]
  }`;

  const navigate = useNavigate();

  return (
    <>
      <div
        className={styles.cardContainer}
        onClick={() => navigate(`/homes/home/${home?.uuid}`)}
      >
        <img src={firstImage} className={styles.homeImg} />
        <div className={styles.titleDiv}>
          <p className={styles.titleTxt}>
            {home?.adv_title.slice(0, 18) + "..."}
          </p>
          <p>{home?.price + " " + home?.price_type}</p>
        </div>
        <div className={styles.descriptionDiv}>
          <p>{home?.adv_description.slice(0, 60) + "..."}</p>
        </div>

        <div className={styles.titleDiv}>
          <p className={styles.homeAddress}>{home?.city}</p>
          <p className={styles.homeAddress}>{home?.rooms + " " + "սենյակ"}</p>
          <p className={styles.homeAddress}>{home?.total_area} m²</p>
        </div>
      </div>
    </>
  );
};
