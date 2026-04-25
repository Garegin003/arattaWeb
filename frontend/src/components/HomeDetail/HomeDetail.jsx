import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import homes_store from "../../stores/homes_store";
import styles from "./homeDetail.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HomeCard } from "../HomeComponents/seondComponent/components/HomeCard.jsx";
import Header from "../Header/Header.jsx";
import { Footer } from "../HomeComponents/footer/Footer.jsx";
import {
  FaCity,
  FaExpandArrowsAlt,
  FaLayerGroup,
  FaTools,
  FaBed,
  FaRulerVertical,
  FaChair,
  FaBuilding,
  FaArrowUp,
} from "react-icons/fa";

const HomeDetail = () => {
  const { uuid } = useParams();

  const getHomeByUuid = homes_store((state) => state.getHomeByUuid);
  const home = homes_store((state) => state.homeByUuid);

  const getHotHomes = homes_store((state) => state.getHotHomes);
  const hotHomes = homes_store((state) => state.hotHomes);

  useEffect(() => {
    getHomeByUuid(uuid);
    getHotHomes();
  }, [uuid, getHomeByUuid, getHotHomes]);

  if (!home) return <div className={styles.loading}>Loading...</div>;

  const images = home.img_uris
    ?.split(";")
    .filter(Boolean)
    .map((img) => `https://api.arattarealestate.com${img}`);

  console.log(home);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  const propertyTypeMap = {
    commercial: "Կոմերցիոն",
    cottage: "Ամառանոց",
    apartment: "Բնակարան",
    house: "Տուն",
    town_house: "Թաունհաուս",
  };

  const advTypeMap = {
    sale: "Վաճառք",
    rent: "Վարձակալություն",
    long_rent: "Երկարաժամկետ վարձակալություն",
    short_rent: "Կարճաժամկետ վարձակալություն",
  };

  return (
    <div className={styles.container}>
      <Header />

      <motion.div
        className={styles.detailContainer}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className={styles.topSection}>
          <motion.div
            className={styles.carousel}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <div key={index} className={styles.slide}>
                  <img
                    src={img}
                    alt={`Home image ${index}`}
                    className={styles.homeImage}
                  />
                </div>
              ))}
            </Slider>
          </motion.div>

          <motion.div
            className={styles.infoBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className={styles.title}>{home.adv_title}</h2>
            <p className={styles.price}>
              {home.price} {home.price_type}
            </p>

            <div className={styles.prices}>
              {home.price_type !== "AMD" && (
                <p className={styles.price_secondary}>{home.price_rub} RUB</p>
              )}

              {home.price_type !== "EUR" && (
                <p className={styles.price_secondary}>{home.price_eur} EUR</p>
              )}
              {home.price_type !== "USD" && (
                <p className={styles.price_secondary}>{home.price_usd} USD</p>
              )}
              {home.price_type !== "RUB" && (
                <p className={styles.price_secondary}>{home.price_rub} RUB</p>
              )}
            </div>
            <p className={styles.description}> Կոդ {home.adv_code}</p>
            <p className={styles.description}>{home.adv_description}</p>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.details}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={styles.detailItem}>
            <FaCity className={styles.icon} /> <strong>Տարածաշրջան:</strong>{" "}
            {home.location_type}
          </div>
          {home?.location_type === "Հայաստան" ? (
            <>
              {" "}
              <div className={styles.detailItem}>
                <FaCity className={styles.icon} /> <strong>Մարզ:</strong>{" "}
                {home.armenian_region}
              </div>
              <div className={styles.detailItem}>
                <FaCity className={styles.icon} /> <strong>Քաղաք:</strong>{" "}
                {home.armenian_city}
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className={styles.detailItem}>
                <FaCity className={styles.icon} /> <strong>Աշխարհամաս:</strong>{" "}
                {home.world_region}
              </div>
              <div className={styles.detailItem}>
                <FaCity className={styles.icon} /> <strong>Երկիր:</strong>{" "}
                {home.foreign_country}
              </div>
            </>
          )}
          <div className={styles.detailItem}>
            <FaBed className={styles.icon} /> <strong>Սենյակներ:</strong>{" "}
            {home.rooms}
          </div>
          <div className={styles.detailItem}>
            <FaExpandArrowsAlt className={styles.icon} />{" "}
            <strong>Ընդ. մար.:</strong> {home.total_area} մ²
          </div>
          <div className={styles.detailItem}>
            <FaLayerGroup className={styles.icon} /> <strong>Հարկ:</strong>{" "}
            {home.floor} / {home.total_floors}
          </div>
          <div className={styles.detailItem}>
            <FaTools className={styles.icon} /> <strong>Վերանորոգում:</strong>{" "}
            {home.renovation_type}
          </div>
          <div className={styles.detailItem}>
            <FaChair className={styles.icon} /> <strong>Կահույք:</strong>{" "}
            {home.hasFurniture ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            {" "}
            <FaArrowUp /> <strong>Վերելակ:</strong>{" "}
            {home.hasElevator ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaBuilding className={styles.icon} /> <strong>Պատշգամբ:</strong>{" "}
            {home.hasBalcony ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaCity className={styles.icon} /> <strong>Հասցե:</strong>{" "}
            {home.address}
          </div>
          <div className={styles.detailItem}>
            <FaBuilding className={styles.icon} />{" "}
            <strong>Առաստաղի բարձրություն:</strong> {home.ceiling_height} մ
          </div>
          <div className={styles.detailItem}>
            <FaTools className={styles.icon} />{" "}
            <strong>Կոմունալ հարմարություններ:</strong>{" "}
            {home.includedUtilities ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaChair className={styles.icon} /> <strong>Նորակառույց:</strong>{" "}
            {home.isNewConstruction ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaBed className={styles.icon} />{" "}
            <strong>Թույլատրելի է կենդանիներով:</strong>{" "}
            {home.pet_policy ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaLayerGroup className={styles.icon} />
            <strong>Գույքի տեսակը:</strong>{" "}
            {propertyTypeMap[home.property_type] || home.property_type}
          </div>{" "}
          <div className={styles.detailItem}>
            <FaArrowUp className={styles.icon} /> <strong>Կանխավճարով:</strong>{" "}
            {home.withPrepayment ? "Այո" : "Ոչ"}
          </div>
          <div className={styles.detailItem}>
            <FaChair className={styles.icon} />
            <strong>Գովազդի տեսակը:</strong>{" "}
            {advTypeMap[home.adv_type] || home.adv_type}
          </div>
          <div className={styles.detailItem}>
            <FaTools className={styles.icon} /> <strong>Սարքավորումներ:</strong>{" "}
            {home.appliances}
          </div>
        </motion.div>

        <motion.div
          className={styles.hotHomesSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3>Թեժ առաջարկներ</h3>
          <div className={styles.hotHomesGrid}>
            {hotHomes.map((hotHome) => (
              <HomeCard key={hotHome} home={hotHome} />
            ))}
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default HomeDetail;
