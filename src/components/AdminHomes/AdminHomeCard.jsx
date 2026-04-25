import React from "react";
import styles from "./adminHomeCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaBan } from "react-icons/fa"; // ban/deactivate icon
import homesStore from "../../stores/homes_store.js";

export const AdminHomeCard = ({ home, onEdit, onDelete, onDeactivate }) => {
  const navigate = useNavigate();

  const firstImage = `https://api.arattarealestate.com${
    home?.img_uris?.split(";")?.[0]
  }`;

  return (
    <div className={styles.card}>
      {firstImage && (
        <img src={firstImage} alt="Home" className={styles.image} />
      )}
      <div
        className={styles.info}
        onClick={() =>
          navigate(`/admin/upload-images/${home.uuid}`, { state: { home } })
        }
      >
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{home?.adv_title}</h3>
        </div>
        <div className={styles.info1}>
          <p className={styles.description}>Կոդ {home?.adv_code} · </p>
          <p className={styles.description}>
            {home?.adv_type === "sale" ? "Վաճառք" : "Վարձակալություն"} ·{" "}
          </p>
          <p className={styles.description}>
            Գին {home?.price} {home?.price_type} ·{" "}
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(home)}>
          Խմբագրել
        </button>
        <button
          className={styles.deactivateBtn}
          onClick={() => onDeactivate(home.is_active, home.uuid)}
        >
          <FaBan className={styles.deactivateIcon} />
          {home.is_active ? "Ապաակտիվացնել" : "Ակտիվացնել"}
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(home)}>
          Ջնջել
        </button>
      </div>
    </div>
  );
};
