import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arm from "./locales/arm/translation.json";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

const savedLanguage = localStorage.getItem("aratta-language") || "arm";

i18n.use(initReactI18next).init({
  resources: {
    arm: { translation: arm },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: savedLanguage,
  fallbackLng: "arm",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;