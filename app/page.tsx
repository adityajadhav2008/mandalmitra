"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "./language-provider";

const translations = {
  English: {
    tagline: "Every Mandal, One Simple Platform",
    welcome: "Welcome 👋",
    manage: "Manage your Mandal easily in one place.",
    create: "Create Mandal",
    login: "Login",
    made: "🇮🇳 Made for Mandals across India",
    install: "Install MandalSetu App",
    installText: "Get quick access from your home screen.",
    installButton: "Install",
    close: "Close",
  },

  Marathi: {
    tagline: "प्रत्येक मंडळासाठी, एक सोपे व्यासपीठ",
    welcome: "स्वागत आहे 👋",
    manage: "तुमचे मंडळ एका ठिकाणी सहज व्यवस्थापित करा.",
    create: "मंडळ तयार करा",
    login: "लॉगिन",
    made: "🇮🇳 भारतातील मंडळांसाठी बनवलेले",
    install: "MandalSetu App Install करा",
    installText: "Home screen वरून App पटकन वापरा.",
    installButton: "Install",
    close: "बंद",
  },

  Hindi: {
    tagline: "हर मंडल के लिए, एक आसान प्लेटफॉर्म",
    welcome: "स्वागत है 👋",
    manage: "अपने मंडल को एक ही जगह आसानी से प्रबंधित करें।",
    create: "मंडल बनाएं",
    login: "लॉगिन",
    made: "🇮🇳 भारत के मंडलों के लिए बनाया गया",
    install: "MandalSetu App Install करें",
    installText: "Home screen से App जल्दी इस्तेमाल करें।",
    installButton: "Install",
    close: "बंद",
  },
};

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();
  const t = translations[language];

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session?.user) {
        router.replace("/dashboard");
      }
    }

    checkSession();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      active = false;

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [router, supabase]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  const closeInstall = () => {
    setShowInstall(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 pb-32">
      <div className="mx-auto max-w-md">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-orange-500">
            <img
              src="/logo.png"
              alt="MandalSetu Logo"
              className="h-full w-full object-cover"
            />
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

      {/* INSTALL BOTTOM BANNER */}

      {showInstall && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-orange-200 bg-white p-3 shadow-lg">

            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-orange-500">
              <img
                src="/logo.png"
                alt="MandalSetu"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900">
                {t.install}
              </p>

              <p className="truncate text-xs text-gray-500">
                {t.installText}
              </p>
            </div>

            <button
              onClick={handleInstall}
              className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {t.installButton}
            </button>

            <button
              onClick={closeInstall}
              className="shrink-0 text-lg text-gray-400"
              aria-label={t.close}
            >
              ×
            </button>

          </div>
        </div>
      )}

    </main>
  );
}