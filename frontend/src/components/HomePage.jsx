import Header from "./../components/Header/Header";
import { FirstComponent } from "./HomeComponents/FirstComponent";
import { SecondComponent } from "./HomeComponents/seondComponent/SecondComponent";
import { ThirdComponent } from "./HomeComponents/thirdComponent/ThirdComponent";
import { FourthComponent } from "./HomeComponents/fourthComponent/FourthComponent";
import { FifthContainer } from "./HomeComponents/fifthContainer/FifthContainer";
import { Footer } from "./HomeComponents/footer/Footer";
import { useEffect } from "react";
import homes_store from "../stores/homes_store.js";

function HomePage() {
  const getHotHomes = homes_store((state) => state.getHotHomes);

  useEffect(() => {
    getHotHomes(true);
  }, []);

  return (
    <>
      <Header />
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent />
      <FourthComponent />
      <FifthContainer />
      <Footer />
    </>
  );
}
export default HomePage;
