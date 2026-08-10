"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

type Account = {
  mandalName: string;
  leaderName: string;
  mobile: string;
  city: string;
  state: string;
};

type EventItem = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
};

const translations = {
  English: {
    welcomeBack: "Welcome back 👋",
    logout: "Logout",

    latestEvent: "🔔 Latest Event Update",
    view: "View →",

    dashboard: "Mandal Dashboard",
    overview: "Overview",

    members: "Members",
    collection: "Collection",
    expenses: "Expenses",
    balance: "Balance",
    events: "Events",

    manageMandal: "Manage Mandal",

    manageMembers: "Add and manage Mandal members.",
    manageCollection: "Add and manage collection.",
    manageExpenses: "Track Mandal expenses.",
    manageEvents: "Manage Mandal events and programs.",
    manageReports: "View collection, expenses and balance.",
    manageReceipt: "Create and manage Mandal receipts.",

    openMembers: "Open Members →",
    openCollection: "Open Collection →",
    openExpenses: "Open Expenses →",
    openEvents: "Open Events →",
    openReports: "Open Reports →",
    openReceipt: "Open Receipt →",

    settings: "Settings",
    settingsDescription:
      "Manage language, account and preferences.",
    openSettings: "Open Settings →",

    mandalInformation: "Mandal Information",

    leader: "Leader",
    mobile: "Mobile",
    city: "City / Village",
    state: "State",

    reports: "Reports",
    receipt: "Receipt",

    loading: "Loading Dashboard...",
  },

  Marathi: {
    welcomeBack: "पुन्हा स्वागत आहे 👋",
    logout: "लॉगआउट",

    latestEvent: "🔔 नवीन कार्यक्रम अपडेट",
    view: "पहा →",

    dashboard: "मंडळ डॅशबोर्ड",
    overview: "आढावा",

    members: "सदस्य",
    collection: "वर्गणी",
    expenses: "खर्च",
    balance: "शिल्लक",
    events: "कार्यक्रम",

    manageMandal: "मंडळ व्यवस्थापन",

    manageMembers:
      "मंडळाचे सदस्य जोडा आणि व्यवस्थापित करा.",
    manageCollection:
      "वर्गणी जोडा आणि व्यवस्थापित करा.",
    manageExpenses:
      "मंडळाचा खर्च नोंदवा.",
    manageEvents:
      "मंडळाचे कार्यक्रम व्यवस्थापित करा.",
    manageReports:
      "वर्गणी, खर्च आणि शिल्लक पहा.",
    manageReceipt:
      "मंडळाच्या पावत्या तयार करा आणि व्यवस्थापित करा.",

    openMembers: "सदस्य उघडा →",
    openCollection: "वर्गणी उघडा →",
    openExpenses: "खर्च उघडा →",
    openEvents: "कार्यक्रम उघडा →",
    openReports: "रिपोर्ट्स उघडा →",
    openReceipt: "पावती उघडा →",

    settings: "सेटिंग्स",
    settingsDescription:
      "भाषा, खाते आणि preferences व्यवस्थापित करा.",
    openSettings: "सेटिंग्स उघडा →",

    mandalInformation: "मंडळाची माहिती",

    leader: "प्रमुख",
    mobile: "मोबाईल",
    city: "शहर / गाव",
    state: "राज्य",

    reports: "रिपोर्ट्स",
    receipt: "पावती",

    loading: "डॅशबोर्ड लोड होत आहे...",
  },

  Hindi: {
    welcomeBack: "फिर से स्वागत है 👋",
    logout: "लॉगआउट",

    latestEvent: "🔔 नया कार्यक्रम अपडेट",
    view: "देखें →",

    dashboard: "मंडल डैशबोर्ड",
    overview: "अवलोकन",

    members: "सदस्य",
    collection: "संग्रह",
    expenses: "खर्च",
    balance: "शेष राशि",
    events: "कार्यक्रम",

    manageMandal: "मंडल प्रबंधन",

    manageMembers:
      "मंडल के सदस्यों को जोड़ें और प्रबंधित करें।",
    manageCollection:
      "संग्रह जोड़ें और प्रबंधित करें।",
    manageExpenses:
      "मंडल के खर्च को ट्रैक करें।",
    manageEvents:
      "मंडल के कार्यक्रम प्रबंधित करें।",
    manageReports:
      "संग्रह, खर्च और शेष राशि देखें।",
    manageReceipt:
      "मंडल की रसीद बनाएं और प्रबंधित करें।",

    openMembers: "सदस्य खोलें →",
    openCollection: "संग्रह खोलें →",
    openExpenses: "खर्च खोलें →",
    openEvents: "कार्यक्रम खोलें →",
    openReports: "रिपोर्ट खोलें →",
    openReceipt: "रसीद खोलें →",

    settings: "सेटिंग्स",
    settingsDescription:
      "भाषा, खाते और preferences प्रबंधित करें.",
    openSettings: "सेटिंग्स खोलें →",

    mandalInformation: "मंडल की जानकारी",

    leader: "प्रमुख",
    mobile: "मोबाइल",
    city: "शहर / गांव",
    state: "राज्य",

    reports: "रिपोर्ट",
    receipt: "रसीद",

    loading: "डैशबोर्ड लोड हो रहा है...",
  },
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const { language, setLanguage } = useLanguage();

  const t = translations[language];

  const [account, setAccount] =
    useState<Account | null>(null);

  const [memberCount, setMemberCount] =
    useState(0);

  const [collectionTotal, setCollectionTotal] =
    useState(0);

  const [expenseTotal, setExpenseTotal] =
    useState(0);

  const [eventCount, setEventCount] =
    useState(0);

  const [latestEvent, setLatestEvent] =
    useState<EventItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // =========================
      // MANDAL
      // =========================

      const {
        data: mandal,
        error: mandalError,
      } = await supabase
        .from("mandals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (mandalError) {
        console.error(
          "MANDAL DASHBOARD ERROR:",
          mandalError
        );
      }

      if (!mandal) {
        router.replace("/create-mandal");
        return;
      }

      if (!active) return;

      setAccount({
        mandalName:
          mandal.mandal_name || "",

        leaderName:
          mandal.leader_name || "",

        mobile:
          mandal.mobile || "",

        city:
          mandal.city || "",

        state:
          mandal.state || "",
      });

      if (
        mandal.language === "English" ||
        mandal.language === "Marathi" ||
        mandal.language === "Hindi"
      ) {
        setLanguage(mandal.language);
      } else {
        setLanguage("English");
      }

      // =========================
      // MEMBERS
      // =========================

      const {
        count: membersCount,
        error: membersError,
      } = await supabase
        .from("members")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (membersError) {
        console.error(
          "MEMBERS COUNT ERROR:",
          membersError
        );

        setMemberCount(0);
      } else {
        setMemberCount(
          membersCount || 0
        );
      }

      // =========================
      // COLLECTION
      // =========================

      const {
        data: collectionData,
        error: collectionError,
      } = await supabase
        .from("collections")
        .select("amount")
        .eq("user_id", user.id);

      if (collectionError) {
        console.error(
          "COLLECTION DASHBOARD ERROR:",
          collectionError
        );

        setCollectionTotal(0);
      } else {
        const total =
          (collectionData || []).reduce(
            (sum, item) =>
              sum +
              Number(item.amount || 0),
            0
          );

        setCollectionTotal(total);
      }

      // =========================
      // EXPENSE
      // =========================

      const {
        data: expenseData,
        error: expenseError,
      } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id);

      if (expenseError) {
        console.error(
          "EXPENSE DASHBOARD ERROR:",
          expenseError
        );

        setExpenseTotal(0);
      } else {
        const total =
          (expenseData || []).reduce(
            (sum, item) =>
              sum +
              Number(item.amount || 0),
            0
          );

        setExpenseTotal(total);
      }

      // =========================
      // EVENTS
      // =========================

      const {
        data: eventData,
        error: eventError,
      } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (eventError) {
        console.error(
          "EVENT DASHBOARD ERROR:",
          eventError
        );

        setEventCount(0);
        setLatestEvent(null);
      } else {
        setEventCount(
          (eventData || []).length
        );

        if (
          eventData &&
          eventData.length > 0
        ) {
          const latest = eventData[0];

          setLatestEvent({
            id: String(latest.id),
            title:
              latest.title || "",
            location:
              latest.location || "",
            date:
              latest.date || "",
            description:
              latest.description || "",
          });
        } else {
          setLatestEvent(null);
        }
      }

      if (active) {
        setLoading(false);
      }
    }

    loadDashboard();

    const handleFocus = () => {
      loadDashboard();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      active = false;

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [router, setLanguage]);

  // =========================
  // LOGOUT
  // =========================

  async function logout() {
    await supabase.auth.signOut();

    localStorage.removeItem(
      "mandalLoggedIn"
    );

    localStorage.removeItem(
      "mandalAccount"
    );

    localStorage.removeItem(
      "mandalLanguage"
    );

    router.replace("/");
  }

  // =========================
  // NAVIGATION
  // =========================

  function openMembers() {
    router.push("/members");
  }

  function openCollection() {
    router.push("/collection");
  }

  function openExpenses() {
    router.push("/expenses");
  }

  function openEvents() {
    router.push("/events");
  }

  function openReports() {
    router.push("/reports");
  }

  // IMPORTANT:
  // Receipt page is /create-receipt
  function openReceipt() {
    router.push("/create-receipt");
  }

  // =========================
  // BALANCE
  // =========================

  const balance =
    collectionTotal - expenseTotal;

  // =========================
  // LOADING
  // =========================

  if (loading || !account) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <p className="text-lg font-semibold text-gray-600">
            {t.loading}
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {t.welcomeBack}
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              {account.mandalName}
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-xl border bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.logout}
          </button>
        </div>

        {/* LATEST EVENT */}

        {latestEvent && (
          <button
            type="button"
            onClick={openEvents}
            className="mb-8 w-full cursor-pointer rounded-3xl border border-orange-200 bg-orange-50 p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>

                <p className="text-sm font-semibold text-orange-600">
                  {t.latestEvent}
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {latestEvent.title}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  📍 {latestEvent.location}
                </p>

                <p className="mt-1 text-sm text-orange-600">
                  📅 {latestEvent.date}
                </p>

              </div>

              <span className="font-semibold text-orange-500">
                {t.view}
              </span>
            </div>
          </button>
        )}

        {/* DASHBOARD BANNER */}

        <div className="rounded-3xl bg-orange-500 p-7 text-white">
          <h2 className="text-2xl font-bold">
            {t.dashboard}
          </h2>

          <p className="mt-2">
            {account.city},{" "}
            {account.state}
          </p>
        </div>

        {/* OVERVIEW */}

        <h2 className="mt-8 text-xl font-bold text-gray-900">
          {t.overview}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* MEMBERS */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-3xl">
              👥
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {t.members}
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {memberCount}
            </p>
          </div>

          {/* COLLECTION */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-3xl">
              💰
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {t.collection}
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              ₹{collectionTotal}
            </p>
          </div>

          {/* EXPENSE */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-3xl">
              🧾
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {t.expenses}
            </p>

            <p className="mt-1 text-2xl font-bold text-red-500">
              ₹{expenseTotal}
            </p>
          </div>

          {/* BALANCE */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-3xl">
              💵
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {t.balance}
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                balance >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ₹{balance}
            </p>
          </div>

          {/* EVENTS */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-3xl">
              🎉
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {t.events}
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {eventCount}
            </p>
          </div>

        </div>

        {/* MANAGE MANDAL */}

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          {t.manageMandal}
        </h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* MEMBERS */}

          <button
            type="button"
            onClick={openMembers}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              👥
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.members}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageMembers}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openMembers}
            </p>
          </button>

          {/* COLLECTION */}

          <button
            type="button"
            onClick={openCollection}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              💰
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.collection}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageCollection}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openCollection}
            </p>
          </button>

          {/* EXPENSES */}

          <button
            type="button"
            onClick={openExpenses}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              🧾
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.expenses}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageExpenses}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openExpenses}
            </p>
          </button>

          {/* EVENTS */}

          <button
            type="button"
            onClick={openEvents}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              🎉
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.events}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageEvents}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openEvents}
            </p>
          </button>

          {/* REPORTS */}

          <button
            type="button"
            onClick={openReports}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              📊
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.reports}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageReports}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openReports}
            </p>
          </button>

          {/* RECEIPT */}

          <button
            type="button"
            onClick={openReceipt}
            className="cursor-pointer rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-4xl">
              🧾
            </div>

            <h3 className="mt-3 text-lg font-bold text-gray-900">
              {t.receipt}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.manageReceipt}
            </p>

            <p className="mt-4 font-semibold text-orange-500">
              {t.openReceipt}
            </p>
          </button>

        </div>

        {/* SETTINGS */}

        <div className="mt-6">
          <button
            type="button"
            onClick={() =>
              router.push("/settings")
            }
            className="w-full cursor-pointer rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-md"
          >
            <div className="text-3xl">
              ⚙️
            </div>

            <h3 className="mt-2 text-lg font-bold text-gray-900">
              {t.settings}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {t.settingsDescription}
            </p>

            <p className="mt-3 font-semibold text-orange-500">
              {t.openSettings}
            </p>
          </button>
        </div>

        {/* MANDAL INFORMATION */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="font-bold text-gray-900">
            {t.mandalInformation}
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                {t.leader}
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {account.leaderName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {t.mobile}
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {account.mobile}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {t.city}
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {account.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {t.state}
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {account.state}
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}