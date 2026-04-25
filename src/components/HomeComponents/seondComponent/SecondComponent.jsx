import styles from "./secondComponent.module.css";
import Design from "./../../../assets/design.svg";
import { HomeCard } from "./components/HomeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import homes_store from "../../../stores/homes_store.js";

export const SecondComponent = () => {
  const hotHomes = homes_store((state) => state.hotHomes);
  const pagesCount = Math.ceil(hotHomes.length / 3);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Շտապ հայտարարություններ</h1>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.designDiv}>
          <img src={Design} alt="Design" />
        </div>
        <div className={styles.cardsDiv}>
          <Swiper
            slidesPerView={1}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            spaceBetween={20}
          >
            {Array.from({ length: pagesCount }).map((_, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className={styles.cardsWrapper}>
                  {hotHomes
                    .slice(pageIndex * 3, pageIndex * 3 + 3)
                    .map((item, index) => (
                      <HomeCard key={index} id={item.uuid} home={item} />
                    ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className={styles.showMoreHomes}
            onClick={() => navigate("/homes")}
          >
            Ցույց տալ ավելին
          </button>
        </div>
      </div>
    </div>
  );
};
