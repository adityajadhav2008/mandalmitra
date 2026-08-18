"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "../language-provider";

export default function AboutReceiptPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const translations = {
    English: {
      back: "← Back to Settings",
      title: "About Receipt",
      subtitle:
        "Manage your receipt language and receipt settings.",
      language: "Receipt Language",
      languageText:
        "Choose the language used on receipts.",
      settings: "Receipt Settings",
      settingsText:
        "Manage receipt number and prefix settings.",
    },

    Marathi: {
      back: "← सेटिंग्जवर जा",
      title: "पावती माहिती",
      subtitle:
        "पावतीची भाषा आणि पावती सेटिंग्ज व्यवस्थापित करा.",
      language: "पावतीची भाषा",
      languageText:
        "पावतीवर वापरली जाणारी भाषा निवडा.",
      settings: "पावती सेटिंग्ज",
      settingsText:
        "पावती क्रमांक आणि prefix सेटिंग्ज व्यवस्थापित करा.",
    },

    Hindi: {
      back: "← सेटिंग्स पर जाएं",
      title: "रसीद जानकारी",
      subtitle:
        "रसीद की भाषा और रसीद सेटिंग्स प्रबंधित करें।",
      language: "रसीद की भाषा",
      languageText:
        "रसीद पर उपयोग की जाने वाली भाषा चुनें।",
      settings: "रसीद सेटिंग्स",
      settingsText:
        "रसीद नंबर और prefix सेटिंग्स प्रबंधित करें।",
    },
  };

  const t = translations[language];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() =>
            router.push("/settings")
          }
          className="mb-6 cursor-pointer font-semibold text-orange-500"
        >
          {t.back}
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          🧾 {t.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        <div className="mt-8 space-y-4">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/about-receipt/receipt-language"
              )
            }
            className="flex w-full items-center justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:bg-gray-50"
          >
            <div>
              <h2 className="text-lg font-bold">
                🌐 {t.language}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t.languageText}
              </p>
            </div>

            <span className="text-xl font-bold text-orange-500">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/about-receipt/receipt-settings"
              )
            }
            className="flex w-full items-center justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:bg-gray-50"
          >
            <div>
              <h2 className="text-lg font-bold">
                📄 {t.settings}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t.settingsText}
              </p>
            </div>

            <span className="text-xl font-bold text-orange-500">
              →
            </span>
          </button>

        </div>
      </div>
    </main>
  );
}