"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";

const translations = {
  English: {
    tagline: "Every Mandal, One Simple Platform",
    welcome: "Welcome 👋",
    manage: "Manage your Mandal easily in one place.",
    create: "Create Mandal",
    login: "Login",
    made: "🇮🇳 Made for Mandals across India",
  },

  Marathi: {
    tagline: "प्रत्येक मंडळासाठी, एक सोपे व्यासपीठ",
    welcome: "स्वागत आहे 👋",
    manage: "तुमचे मंडळ एका ठिकाणी सहज व्यवस्थापित करा.",
    create: "मंडळ तयार करा",
    login: "लॉगिन",
    made: "🇮🇳 भारतातील मंडळांसाठी बनवलेले",
  },

  Hindi: {
    tagline: "हर मंडल के लिए, एक आसान प्लेटफॉर्म",
    welcome: "स्वागत है 👋",
    manage: "अपने मंडल को एक ही जगह आसानी से प्रबंधित करें।",
    create: "मंडल बनाएं",
    login: "लॉगिन",
    made: "🇮🇳 भारत के मंडलों के लिए बनाया गया",
  },
};

export default function Home() {
  const { language } = useLanguage();

  const t = translations[language];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-4xl">
            🏛️
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            MandalSetu
          </h1>

          <p className="mt-2 text-gray-500">
            {t.tagline}
          </p>

        </div>

        {/* WELCOME */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            {t.welcome}
          </h2>

          <p className="mt-2 text-gray-500">
            {t.manage}
          </p>

          {/* CREATE */}

          <Link
            href="/create-mandal"
            className="mt-8 block w-full rounded-2xl bg-orange-500 px-6 py-4 text-center font-semibold text-white hover:bg-orange-600"
          >
            {t.create}
          </Link>

          {/* LOGIN */}

          <Link
            href="/login"
            className="mt-3 block w-full rounded-2xl border border-gray-300 px-6 py-4 text-center font-semibold text-gray-800 hover:bg-gray-50"
          >
            {t.login}
          </Link>

        </div>

        {/* FOOTER */}

        <p className="mt-6 text-center text-sm text-gray-400">
          {t.made}
        </p>

      </div>
    </main>
  );
}