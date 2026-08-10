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
    editAccount: "Edit Account",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    saving: "Saving...",
    accountUpdated: "Account updated successfully.",
    accountUpdateError: "Account update failed.",

    mandal: "Mandal",
    leader: "Leader",
    mobile: "Mobile",
    location: "Location",
    city: "City",
    state: "State",

    noAccount: "No account information found.",

    notifications: "Notifications",
    notificationText: "Manage notification preferences.",

    about: "About",
    aboutText: "Mandal Management System",
    aboutSubText:
      "Manage members, collections, expenses and events.",
    aboutDetails:
      "MandalMitra helps Mandals manage members, collections, receipts, expenses, events and reports in one place.",

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

    logout: "Logout",
    logoutText: "Sign out from your Mandal account.",
    logoutConfirm: "Are you sure you want to logout?",

    deleteAccount: "Delete Account",
    deleteAccountText:
      "Permanently delete your Mandal account.",
    deleteAccountConfirm:
      "Are you sure you want to delete your account? This action cannot be undone.",
    deleteAccountInfo:
      "Account deletion will be completed securely.",
  },

  Marathi: {
    settings: "सेटिंग्ज",
    subtitle: "तुमच्या मंडळाची सेटिंग्ज व्यवस्थापित करा.",
    back: "← डॅशबोर्डवर जा",

    language: "भाषा",
    languageText: "तुमची आवडती भाषा निवडा.",

    account: "खाते",
    accountText: "तुमच्या मंडळाची माहिती.",
    editAccount: "खाते संपादित करा",
    saveChanges: "बदल जतन करा",
    cancel: "रद्द करा",
    saving: "जतन होत आहे...",
    accountUpdated: "खात्याची माहिती यशस्वीरित्या अपडेट झाली.",
    accountUpdateError: "खात्याची माहिती अपडेट करता आली नाही.",

    mandal: "मंडळ",
    leader: "प्रमुख",
    mobile: "मोबाईल",
    location: "ठिकाण",
    city: "शहर",
    state: "राज्य",

    noAccount: "खात्याची माहिती उपलब्ध नाही.",

    notifications: "सूचना",
    notificationText: "सूचनांची सेटिंग व्यवस्थापित करा.",

    about: "माहिती",
    aboutText: "मंडळ व्यवस्थापन प्रणाली",
    aboutSubText:
      "सदस्य, वर्गणी, खर्च आणि कार्यक्रम व्यवस्थापित करा.",
    aboutDetails:
      "मंडलमित्रच्या मदतीने मंडळातील सदस्य, वर्गणी, पावत्या, खर्च, कार्यक्रम आणि रिपोर्ट एकाच ठिकाणी व्यवस्थापित करता येतात.",

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

    logout: "लॉगआउट",
    logoutText: "तुमच्या मंडळाच्या खात्यातून बाहेर पडा.",
    logoutConfirm:
      "तुम्हाला नक्की लॉगआउट करायचे आहे का?",

    deleteAccount: "खाते डिलीट करा",
    deleteAccountText:
      "तुमचे मंडळाचे खाते कायमचे डिलीट करा.",
    deleteAccountConfirm:
      "तुम्हाला नक्की खाते डिलीट करायचे आहे का? ही प्रक्रिया पूर्ववत करता येणार नाही.",
    deleteAccountInfo:
      "खाते डिलीट करण्याची सुरक्षित प्रक्रिया पुढील स्टेपमध्ये पूर्ण केली जाईल.",
  },

  Hindi: {
    settings: "सेटिंग्स",
    subtitle: "अपने मंडल की सेटिंग्स प्रबंधित करें।",
    back: "← डैशबोर्ड पर जाएं",

    language: "भाषा",
    languageText: "अपनी पसंदीदा भाषा चुनें।",

    account: "खाता",
    accountText: "आपके मंडल की जानकारी।",
    editAccount: "खाता संपादित करें",
    saveChanges: "बदलाव सेव करें",
    cancel: "रद्द करें",
    saving: "सेव हो रहा है...",
    accountUpdated: "खाते की जानकारी सफलतापूर्वक अपडेट हो गई।",
    accountUpdateError: "खाते की जानकारी अपडेट नहीं हो सकी।",

    mandal: "मंडल",
    leader: "प्रमुख",
    mobile: "मोबाइल",
    location: "स्थान",
    city: "शहर",
    state: "राज्य",

    noAccount: "खाते की जानकारी उपलब्ध नहीं है।",

    notifications: "सूचनाएं",
    notificationText: "सूचना सेटिंग प्रबंधित करें।",

    about: "जानकारी",
    aboutText: "मंडल प्रबंधन प्रणाली",
    aboutSubText:
      "सदस्य, संग्रह, खर्च और कार्यक्रम प्रबंधित करें।",
    aboutDetails:
      "मंडलमित्र की मदद से मंडल के सदस्य, संग्रह, रसीद, खर्च, कार्यक्रम और रिपोर्ट एक ही जगह पर प्रबंधित किए जा सकते हैं।",

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

    logout: "लॉगआउट",
    logoutText: "अपने मंडल खाते से बाहर निकलें।",
    logoutConfirm:
      "क्या आप वाकई लॉगआउट करना चाहते हैं?",

    deleteAccount: "खाता डिलीट करें",
    deleteAccountText:
      "अपने मंडल खाते को स्थायी रूप से डिलीट करें।",
    deleteAccountConfirm:
      "क्या आप वाकई अपना खाता डिलीट करना चाहते हैं? यह प्रक्रिया वापस नहीं की जा सकती।",
    deleteAccountInfo:
      "खाता डिलीट करने की सुरक्षित प्रक्रिया अगले स्टेप में पूरी की जाएगी।",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language, setLanguage } = useLanguage();

  const [notifications, setNotifications] = useState(true);

  const [account, setAccount] =
    useState<Account | null>(null);

  const [editingAccount, setEditingAccount] =
    useState(false);

  const [editAccount, setEditAccount] =
    useState<Account | null>(null);

  const [savingAccount, setSavingAccount] =
    useState(false);

  const [accountMessage, setAccountMessage] =
    useState("");

  const [accountError, setAccountError] =
    useState("");

  const [aboutOpen, setAboutOpen] =
    useState(false);

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
        const accountData = {
          mandalName: mandal.mandal_name || "",
          leaderName: mandal.leader_name || "",
          mobile: mandal.mobile || "",
          city: mandal.city || "",
          state: mandal.state || "",
        };

        setAccount(accountData);
        setEditAccount(accountData);

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
        localStorage.getItem(
          "mandalNotifications"
        );

      if (savedNotifications !== null) {
        setNotifications(
          savedNotifications === "true"
        );
      }
    }

    loadSettings();
  }, [router, setLanguage]);

  const t = translations[language];

  async function changeLanguage(
    value: Language
  ) {
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

  function startEditAccount() {
    if (!account) {
      return;
    }

    setEditAccount({
      ...account,
    });

    setAccountMessage("");
    setAccountError("");
    setEditingAccount(true);
  }

  function cancelEditAccount() {
    if (account) {
      setEditAccount({
        ...account,
      });
    }

    setAccountMessage("");
    setAccountError("");
    setEditingAccount(false);
  }

  async function saveAccount() {
    if (!editAccount) {
      return;
    }

    setAccountMessage("");
    setAccountError("");
    setSavingAccount(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSavingAccount(false);
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("mandals")
      .update({
        mandal_name: editAccount.mandalName,
        leader_name: editAccount.leaderName,
        mobile: editAccount.mobile,
        city: editAccount.city,
        state: editAccount.state,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "ACCOUNT UPDATE ERROR:",
        error
      );

      setAccountError(
        t.accountUpdateError
      );

      setSavingAccount(false);
      return;
    }

    setAccount({
      ...editAccount,
    });

    setEditAccount({
      ...editAccount,
    });

    setEditingAccount(false);
    setAccountMessage(t.accountUpdated);
    setSavingAccount(false);
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

  async function handleLogout() {
    const confirmed = window.confirm(
      t.logoutConfirm
    );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
      return;
    }

    localStorage.removeItem(
      "mandalLoggedIn"
    );

    router.replace("/login");
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      t.deleteAccountConfirm
    );

    if (!confirmed) {
      return;
    }

    window.alert(
      t.deleteAccountInfo
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
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

                <label className="inline-block cursor-pointer rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white">

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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  👤 {t.account}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {t.accountText}
                </p>
              </div>

              {account && !editingAccount && (
                <button
                  type="button"
                  onClick={startEditAccount}
                  className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  ✏️ {t.editAccount}
                </button>
              )}

            </div>

            {accountMessage && (
              <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                {accountMessage}
              </p>
            )}

            {accountError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
                {accountError}
              </p>
            )}

            {account ? (
              editingAccount && editAccount ? (

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* MANDAL NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t.mandal}
                    </label>

                    <input
                      type="text"
                      value={editAccount.mandalName}
                      onChange={(e) =>
                        setEditAccount({
                          ...editAccount,
                          mandalName: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* LEADER */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t.leader}
                    </label>

                    <input
                      type="text"
                      value={editAccount.leaderName}
                      onChange={(e) =>
                        setEditAccount({
                          ...editAccount,
                          leaderName: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* MOBILE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t.mobile}
                    </label>

                    <input
                      type="tel"
                      value={editAccount.mobile}
                      onChange={(e) =>
                        setEditAccount({
                          ...editAccount,
                          mobile: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t.city}
                    </label>

                    <input
                      type="text"
                      value={editAccount.city}
                      onChange={(e) =>
                        setEditAccount({
                          ...editAccount,
                          city: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* STATE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t.state}
                    </label>

                    <input
                      type="text"
                      value={editAccount.state}
                      onChange={(e) =>
                        setEditAccount({
                          ...editAccount,
                          state: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-3 md:col-span-2">

                    <button
                      type="button"
                      onClick={saveAccount}
                      disabled={savingAccount}
                      className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                    >
                      {savingAccount
                        ? t.saving
                        : t.saveChanges}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditAccount}
                      disabled={savingAccount}
                      className="rounded-xl border px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                      {t.cancel}
                    </button>

                  </div>

                </div>

              ) : (

                <div className="mt-5 space-y-3 text-sm">

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

              )
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                {t.noAccount}
              </p>
            )}

          </div>

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

            <button
              type="button"
              onClick={() =>
                setAboutOpen(!aboutOpen)
              }
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h2 className="text-lg font-bold">
                  ℹ️ {t.about}
                </h2>

                <p className="mt-2 text-gray-500">
                  {t.aboutText}
                </p>
              </div>

              <span className="text-xl text-gray-500">
                {aboutOpen ? "▲" : "▼"}
              </span>
            </button>

            {aboutOpen && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  {t.aboutSubText}
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {t.aboutDetails}
                </p>

                <div className="mt-4 border-t pt-4 text-sm text-gray-400">
                  MandalMitra
                </div>

              </div>
            )}

          </div>

          {/* LOGOUT */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  🚪 {t.logout}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {t.logoutText}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
              >
                {t.logout}
              </button>

            </div>

          </div>

          {/* DELETE ACCOUNT */}
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold text-red-600">
                  🗑️ {t.deleteAccount}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {t.deleteAccountText}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="rounded-xl border border-red-500 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                {t.deleteAccount}
              </button>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}