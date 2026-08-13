"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  useLanguage,
  type Language,
} from "../language-provider";

type Account = {
  mandalName: string;
  leaderName: string;
  mobile: string;
  city: string;
  state: string;
};

const translations = {
  English: {
    settings: "Settings",
    subtitle: "Manage your Mandal settings.",
    back: "← Back to Dashboard",

    language: "Language",
    languageText: "Choose your preferred language.",

    account: "Account",
    accountText: "Your Mandal account information.",

    mandal: "Mandal",
    leader: "Leader",
    mobile: "Mobile",
    location: "Location",
    noAccount: "No account information found.",

    members: "Members",
    membersText: "Add and manage Mandal members.",
    openMembers: "Open Members →",

    notifications: "Notifications",
    notificationText: "Manage notification preferences.",

    about: "About",
    aboutText: "Mandal Management System",
    aboutSubText:
      "Manage members, collections, expenses and events.",

    logo: "Mandal Logo",
    logoText:
      "Upload your Mandal logo. It will be used on receipts.",
    chooseLogo: "Choose Logo",
    changeLogo: "Change Logo",
    removeLogo: "Remove Logo",
    uploading: "Uploading logo...",
    logoSuccess: "Logo uploaded successfully.",
    logoRemoved: "Logo removed successfully.",
    logoError: "Logo upload failed.",
  },

  Marathi: {
    settings: "सेटिंग्ज",
    subtitle: "तुमच्या मंडळाची सेटिंग्ज व्यवस्थापित करा.",
    back: "← डॅशबोर्डवर जा",

    language: "भाषा",
    languageText: "तुमची आवडती भाषा निवडा.",

    account: "खाते",
    accountText: "तुमच्या मंडळाची माहिती.",

    mandal: "मंडळ",
    leader: "प्रमुख",
    mobile: "मोबाईल",
    location: "ठिकाण",
    noAccount: "खात्याची माहिती उपलब्ध नाही.",

    members: "सदस्य",
    membersText: "मंडळाचे सदस्य जोडा आणि व्यवस्थापित करा.",
    openMembers: "सदस्य उघडा →",

    notifications: "सूचना",
    notificationText: "सूचनांची सेटिंग व्यवस्थापित करा.",

    about: "माहिती",
    aboutText: "मंडळ व्यवस्थापन प्रणाली",
    aboutSubText:
      "सदस्य, वर्गणी, खर्च आणि कार्यक्रम व्यवस्थापित करा.",

    logo: "मंडळाचा लोगो",
    logoText:
      "तुमच्या मंडळाचा लोगो अपलोड करा. तो पावतीवर वापरला जाईल.",
    chooseLogo: "लोगो निवडा",
    changeLogo: "लोगो बदला",
    removeLogo: "लोगो काढा",
    uploading: "लोगो अपलोड होत आहे...",
    logoSuccess: "लोगो यशस्वीरित्या अपलोड झाला.",
    logoRemoved: "लोगो काढला गेला.",
    logoError: "लोगो अपलोड करण्यात अडचण आली.",
  },

  Hindi: {
    settings: "सेटिंग्स",
    subtitle: "अपने मंडल की सेटिंग्स प्रबंधित करें।",
    back: "← डैशबोर्ड पर जाएं",

    language: "भाषा",
    languageText: "अपनी पसंदीदा भाषा चुनें।",

    account: "खाता",
    accountText: "आपके मंडल की जानकारी।",

    mandal: "मंडल",
    leader: "प्रमुख",
    mobile: "मोबाइल",
    location: "स्थान",
    noAccount: "खाते की जानकारी उपलब्ध नहीं है।",

    members: "सदस्य",
    membersText: "मंडल के सदस्यों को जोड़ें और प्रबंधित करें।",
    openMembers: "सदस्य खोलें →",

    notifications: "सूचनाएं",
    notificationText: "सूचना सेटिंग प्रबंधित करें।",

    about: "जानकारी",
    aboutText: "मंडल प्रबंधन प्रणाली",
    aboutSubText:
      "सदस्य, संग्रह, खर्च और कार्यक्रम प्रबंधित करें।",

    logo: "मंडल का लोगो",
    logoText:
      "अपने मंडल का लोगो अपलोड करें। इसका उपयोग रसीद पर किया जाएगा।",
    chooseLogo: "लोगो चुनें",
    changeLogo: "लोगो बदलें",
    removeLogo: "लोगो हटाएं",
    uploading: "लोगो अपलोड हो रहा है...",
    logoSuccess: "लोगो सफलतापूर्वक अपलोड हो गया।",
    logoRemoved: "लोगो हटा दिया गया।",
    logoError: "लोगो अपलोड करने में समस्या हुई।",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language, setLanguage } = useLanguage();

  const [notifications, setNotifications] = useState(true);

  const [account, setAccount] =
    useState<Account | null>(null);

  const [logoUrl, setLogoUrl] = useState("");

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [logoMessage, setLogoMessage] =
    useState("");

  const [logoError, setLogoError] =
    useState("");

  const [savingLanguage, setSavingLanguage] =
    useState(false);

  const [languageError, setLanguageError] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const {
        data: mandal,
        error: mandalError,
      } = await supabase
        .from("mandals")
        .select(
          "mandal_name, leader_name, mobile, city, state, language, logo_url"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (mandalError) {
        console.error(
          "Settings mandal error:",
          mandalError
        );
      }

      if (mandal) {
        setAccount({
          mandalName: mandal.mandal_name || "",
          leaderName: mandal.leader_name || "",
          mobile: mandal.mobile || "",
          city: mandal.city || "",
          state: mandal.state || "",
        });

        setLogoUrl(mandal.logo_url || "");

        if (
          mandal.language === "English" ||
          mandal.language === "Marathi" ||
          mandal.language === "Hindi"
        ) {
          setLanguage(mandal.language);
        }
      }

      const savedNotifications =
        localStorage.getItem("mandalNotifications");

      if (savedNotifications !== null) {
        setNotifications(
          savedNotifications === "true"
        );
      }
    }

    loadSettings();
  }, [router, setLanguage]);

  const t = translations[language];

  async function changeLanguage(value: Language) {
    setLanguageError("");
    setSavingLanguage(true);

    setLanguage(value);

    localStorage.setItem(
      "mandalLanguage",
      value
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSavingLanguage(false);
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("mandals")
      .update({
        language: value,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "LANGUAGE UPDATE ERROR:",
        error
      );

      setLanguageError(
        "Language could not be saved."
      );
    }

    setSavingLanguage(false);
  }

  async function uploadLogo(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogoMessage("");
    setLogoError("");
    setUploadingLogo(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setLogoError(
          "Please select an image file."
        );
        setUploadingLogo(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setLogoError(
          "Logo size must be less than 5 MB."
        );
        setUploadingLogo(false);
        return;
      }

      const fileExt =
        file.name.split(".").pop() || "png";

      const filePath =
        `${user.id}/logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("mandal-logos")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

      if (uploadError) {
        console.error(
          "LOGO UPLOAD ERROR:",
          uploadError
        );

        setLogoError(t.logoError);
        setUploadingLogo(false);
        return;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("mandal-logos")
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData.publicUrl;

      const { error: updateError } =
        await supabase
          .from("mandals")
          .update({
            logo_url: publicUrl,
          })
          .eq("user_id", user.id);

      if (updateError) {
        console.error(
          "LOGO DATABASE UPDATE ERROR:",
          updateError
        );

        setLogoError(t.logoError);
        setUploadingLogo(false);
        return;
      }

      setLogoUrl(publicUrl);
      setLogoMessage(t.logoSuccess);
    } catch (error) {
      console.error(
        "LOGO ERROR:",
        error
      );

      setLogoError(t.logoError);
    }

    setUploadingLogo(false);
  }

  async function removeLogo() {
    setLogoMessage("");
    setLogoError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("mandals")
      .update({
        logo_url: null,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "REMOVE LOGO ERROR:",
        error
      );

      setLogoError(t.logoError);
      return;
    }

    setLogoUrl("");
    setLogoMessage(t.logoRemoved);
  }

  function toggleNotifications() {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "mandalNotifications",
      String(newValue)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          className="mb-6 cursor-pointer font-semibold text-orange-500"
        >
          {t.back}
        </button>

        {/* HEADER */}

        <h1 className="text-3xl font-bold text-gray-900">
          {t.settings}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        <div className="mt-8 space-y-4">

          {/* LOGO */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              🖼️ {t.logo}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t.logoText}
            </p>

            {logoUrl ? (
              <div className="mt-5">

                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border bg-gray-50 p-3">
                  <img
                    src={logoUrl}
                    alt="Mandal Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">

                  <label className="cursor-pointer rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
                    {t.changeLogo}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadLogo}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={removeLogo}
                    disabled={uploadingLogo}
                    className="rounded-xl border px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                  >
                    {t.removeLogo}
                  </button>

                </div>

              </div>
            ) : (
              <div className="mt-5">

                <label className="inline-block cursor-pointer rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">

                  {uploadingLogo
                    ? t.uploading
                    : t.chooseLogo}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadLogo}
                    className="hidden"
                    disabled={uploadingLogo}
                  />

                </label>

              </div>
            )}

            {uploadingLogo && (
              <p className="mt-3 text-sm text-gray-400">
                {t.uploading}
              </p>
            )}

            {logoMessage && (
              <p className="mt-3 text-sm text-green-600">
                {logoMessage}
              </p>
            )}

            {logoError && (
              <p className="mt-3 text-sm text-red-500">
                {logoError}
              </p>
            )}

          </div>

          {/* LANGUAGE */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              🌐 {t.language}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t.languageText}
            </p>

            <select
              value={language}
              disabled={savingLanguage}
              onChange={(e) =>
                changeLanguage(
                  e.target.value as Language
                )
              }
              className="mt-4 rounded-xl border px-4 py-3 outline-none focus:border-orange-500 disabled:opacity-60"
            >
              <option value="English">
                English
              </option>

              <option value="Marathi">
                मराठी
              </option>

              <option value="Hindi">
                हिंदी
              </option>
            </select>

            {savingLanguage && (
              <p className="mt-2 text-sm text-gray-400">
                Saving language...
              </p>
            )}

            {languageError && (
              <p className="mt-2 text-sm text-red-500">
                {languageError}
              </p>
            )}

          </div>

          {/* ACCOUNT */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              👤 {t.account}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {t.accountText}
            </p>

            {account ? (
              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <b>{t.mandal}:</b>{" "}
                  {account.mandalName}
                </p>

                <p>
                  <b>{t.leader}:</b>{" "}
                  {account.leaderName}
                </p>

                <p>
                  <b>{t.mobile}:</b>{" "}
                  {account.mobile}
                </p>

                <p>
                  <b>{t.location}:</b>{" "}
                  {account.city},{" "}
                  {account.state}
                </p>

              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                {t.noAccount}
              </p>
            )}

          </div>

          {/* MEMBERS */}

          <button
            type="button"
            onClick={() =>
              router.push("/members")
            }
            className="flex w-full items-center justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:bg-gray-50 active:scale-[0.99]"
          >

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-gray-900">
                👥 {t.members}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t.membersText}
              </p>

            </div>

            <span className="ml-4 shrink-0 text-xl font-bold text-orange-500">
              →
            </span>

          </button>

          {/* NOTIFICATIONS */}

          <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">

            <div>

              <h2 className="text-lg font-bold">
                🔔 {t.notifications}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t.notificationText}
              </p>

            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              className={`rounded-xl px-5 py-3 font-semibold text-white ${
                notifications
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            >
              {notifications
                ? "ON"
                : "OFF"}
            </button>

          </div>

          {/* ABOUT */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              ℹ️ {t.about}
            </h2>

            <p className="mt-2 text-gray-500">
              {t.aboutText}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {t.aboutSubText}
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}