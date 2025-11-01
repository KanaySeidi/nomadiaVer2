import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    debug: false,
    lng: localStorage.getItem("language") || "ENG",
    fallbackLng: "ENG",
    saveMissing: true,
    interpolation: {
      escapeValue: false,
    },
  });

initReactI18next.init(i18n);
