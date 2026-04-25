import styles from "./fourthComponent.module.css";
import design from "../../../assets/design2.svg";
import image1 from "../../../assets/image1.png";
export const FourthComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer1}>
        {/*<div className={styles.designDiv1}>*/}
        {/*  <img src={design} alt="Design" />*/}
        {/*</div>*/}
        <img src={image1} className={styles.image1} />
      </div>
    </div>
  );
};
