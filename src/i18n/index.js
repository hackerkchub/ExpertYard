import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";

const STORAGE_KEY = "g9_user_language";
const supportedLanguages = ["en", "hi"];

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return supportedLanguages.includes(savedLanguage) ? savedLanguage : "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined" && supportedLanguages.includes(language)) {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language || "en";
}

export { STORAGE_KEY, supportedLanguages };
export default i18n;
