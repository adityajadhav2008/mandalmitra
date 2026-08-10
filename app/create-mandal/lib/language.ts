export type Language = "English" | "Marathi" | "Hindi";

export const translations = {
  English: {
    settings: "Settings",
    language: "Language",
    notifications: "Notifications",
    about: "About",
    backToDashboard: "← Back to Dashboard",
  },

  Marathi: {
    settings: "सेटिंग्ज",
    language: "भाषा",
    notifications: "सूचना",
    about: "माहिती",
    backToDashboard: "← डॅशबोर्डवर जा",
  },

  Hindi: {
    settings: "सेटिंग्स",
    language: "भाषा",
    notifications: "सूचनाएं",
    about: "जानकारी",
    backToDashboard: "← डैशबोर्ड पर वापस जाएं",
  },
} as const;

export function getLanguage(): Language {
  if (typeof window === "undefined") {
    return "English";
  }

  const saved =
    localStorage.getItem("mandalLanguage");

  if (
    saved === "English" ||
    saved === "Marathi" ||
    saved === "Hindi"
  ) {
    return saved;
  }

  return "English";
}