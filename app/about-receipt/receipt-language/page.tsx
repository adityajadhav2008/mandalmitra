"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useLanguage,
  type Language,
} from "../../language-provider";

export default function ReceiptLanguagePage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [receiptLanguage, setReceiptLanguage] =
    useState<Language>("English");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "mandalReceiptLanguage"
    );

    if (
      savedLanguage === "English" ||
      savedLanguage === "Marathi" ||
      savedLanguage === "Hindi"
    ) {
      setReceiptLanguage(savedLanguage);
    }
  }, []);

  const translations = {
    English: {
      back: "← Back to About Receipt",
      title: "Receipt Language",
      subtitle: "Choose the language used on your receipts.",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      saved: "Receipt language saved successfully.",
    },

    Marathi: {
      back: "← पावती माहितीवर जा",
      title: "पावतीची भाषा",
      subtitle: "पावतीवर वापरली जाणारी भाषा निवडा.",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      saved: "पावतीची भाषा यशस्वीरित्या सेव्ह झाली.",
    },

    Hindi: {
      back: "← रसीद जानकारी पर जाएं",
      title: "रसीद की भाषा",
      subtitle: "रसीद पर उपयोग की जाने वाली भाषा चुनें।",
      english: "English",
      marathi: "मराठी",
      hindi: "हिंदी",
      saved: "रसीद की भाषा सफलतापूर्वक सेव हो गई।",
    },
  };

  const t = translations[language];

  function changeLanguage(value: Language) {
    setReceiptLanguage(value);

    localStorage.setItem(
      "mandalReceiptLanguage",
      value
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() =>
            router.push("/about-receipt")
          }
          className="mb-6 cursor-pointer font-semibold text-orange-500"
        >
          {t.back}
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          🌐 {t.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <select
            value={receiptLanguage}
            onChange={(e) =>
              changeLanguage(
                e.target.value as Language
              )
            }
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500 sm:w-auto"
          >
            <option value="English">
              {t.english}
            </option>

            <option value="Marathi">
              {t.marathi}
            </option>

            <option value="Hindi">
              {t.hindi}
            </option>
          </select>

          {saved && (
            <p className="mt-4 text-sm font-medium text-green-600">
              ✓ {t.saved}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}