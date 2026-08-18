"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../language-provider";

export default function ReceiptSettingsPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [receiptPrefix, setReceiptPrefix] =
    useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefix = localStorage.getItem(
      "mandalReceiptPrefix"
    );

    if (savedPrefix !== null) {
      setReceiptPrefix(savedPrefix);
    }
  }, []);

  const translations = {
    English: {
      back: "← Back to About Receipt",
      title: "Receipt Settings",
      subtitle: "Manage your receipt number and prefix.",
      prefix: "Receipt Number Prefix",
      placeholder: "Example: MANDAL-",
      save: "Save Settings",
      saved: "Receipt settings saved successfully.",
    },

    Marathi: {
      back: "← पावती माहितीवर जा",
      title: "पावती सेटिंग्ज",
      subtitle: "पावती क्रमांक आणि Prefix व्यवस्थापित करा.",
      prefix: "पावती क्रमांक Prefix",
      placeholder: "उदाहरण: MANDAL-",
      save: "सेटिंग्ज सेव्ह करा",
      saved: "पावती सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या.",
    },

    Hindi: {
      back: "← रसीद जानकारी पर जाएं",
      title: "रसीद सेटिंग्स",
      subtitle: "रसीद नंबर और Prefix प्रबंधित करें।",
      prefix: "रसीद नंबर Prefix",
      placeholder: "उदाहरण: MANDAL-",
      save: "सेटिंग्स सेव करें",
      saved: "रसीद सेटिंग्स सफलतापूर्वक सेव हो गईं।",
    },
  };

  const t = translations[language];

  function saveSettings() {
    localStorage.setItem(
      "mandalReceiptPrefix",
      receiptPrefix.trim()
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
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
          📄 {t.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <label className="text-sm font-semibold text-gray-700">
            {t.prefix}
          </label>

          <input
            type="text"
            value={receiptPrefix}
            onChange={(e) => {
              setReceiptPrefix(e.target.value);
              setSaved(false);
            }}
            placeholder={t.placeholder}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
          />

          <button
            type="button"
            onClick={saveSettings}
            className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            {t.save}
          </button>

          {saved && (
            <p className="mt-3 text-sm font-medium text-green-600">
              ✓ {t.saved}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}