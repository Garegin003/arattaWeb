import styles from "./aboutUs.module.css";
import Header from "../Header/Header";
import img1 from "../../assets/Vahe.jpg";
import img2 from "../../assets/Garegin.jpg";
import img3 from "../../assets//Naira.jpg";
import img4 from "../../assets/Mihrdat.jpg";
import img5 from "../../assets/Gor.png";
import partner1 from "../../assets/partner1.png";
import partner2 from "../../assets/partner2.png";
import partner3 from "../../assets/partner3.png";
import partner4 from "../../assets/partner4.png";
import partner5 from "../../assets/partner5.png";
import partner6 from "../../assets/partner6.png";
import { Footer } from "../HomeComponents/footer/Footer.jsx";
import { motion } from "framer-motion";

const AboutUs = () => {
  const staffData = [
    { name: "Վահե Ենգոյան", position: "Տնօրեն", image: img1 },
    {
      name: "Գարեգին Երվանդյան",
      position: "Տեխնիկական սպասարկման թիմի ղեկավար",
      image: img2,
    },
    { name: "Նաիրա Դանիելյան", position: "Գործակալ", image: img3 },
    { name: "Միհրդատ Կիրակոսյան", position: "Գործակալ", image: img4 },
    { name: "Գոռ Երվանդյան", position: "Գործակալ", image: img5 },
  ];

  const partners = [partner1, partner2, partner3, partner4, partner5, partner6];

  return (
    <>
      <Header />

      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Mission */}
        <section className={styles.card}>
          <h1 className={styles.heading}>Մեր առաքելությունը</h1>
          <p className={styles.text}>
            Արատտա անշարժ գույքի գործակալությունը Հայաստանի առաջատար անշարժ
            գույքի գործակալություններից է, որը վստահություն է շահել ավելի քան
            10,000 հաճախորդի կողմից ամբողջ աշխարհում։ Մենք առաջարկում ենք անշարժ
            գույքի գնման, վաճառքի, վարձակալության և կառավարման համալիր
            ծառայություններ։ Մեր փորձառու թիմը ապահովում է անհատական մոտեցում,
            թափանցիկություն և բարձրակարգ սպասարկում։ Մենք համագործակցում ենք
            ավելի քան 10 երկրի շինարարական ընկերությունների հետ՝ առաջարկելով
            բացառիկ նորակառույցներ և ներդրումային հնարավորություններ։ Արատտա
            անշարժ գույքի գործակալությունում մենք կառուցում ենք ոչ թե պարզապես
            գործարքներ, այլ ամուր հարաբերություններ՝ հիմնված վստահության և
            պրոֆեսիոնալիզմի վրա։
          </p>
        </section>

        {/* Staff */}
        <section className={styles.card}>
          <h2 className={styles.subheading}>Մեր Թիմը</h2>
          <div className={styles.employees}>
            {staffData.map((item, index) => (
              <motion.div
                key={index}
                className={styles.employeeCard}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                />
                <p className={styles.name}>{item.name}</p>
                <p className={styles.positionTxt}>{item.position}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partners */}
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

      <Footer />
    </>
  );
};

export default AboutUs;
