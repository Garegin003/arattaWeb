import styles from "./thirdComponent.module.css";
import partner1 from "../../../assets/partner1.png";
import partner2 from "../../../assets/partner2.png";
import partner3 from "../../../assets/partner3.png";
import partner4 from "../../../assets/partner4.png";
import partner5 from "../../../assets/partner5.png";
import partner6 from "../../../assets/partner6.png";
import { motion } from "framer-motion";

export const ThirdComponent = () => {
  const partners = [partner1, partner2, partner3, partner4, partner5, partner6];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <section className={styles.card}>
        <h2 className={styles.subheading}>Մեր Գործընկերները</h2>
        <div className={styles.partnersWrapper}>
          {partners.map((logo, i) => (
            <motion.img
              src={logo}
              alt={`partner-${i}`}
              key={i}
              className={styles.partnerLogo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
};
