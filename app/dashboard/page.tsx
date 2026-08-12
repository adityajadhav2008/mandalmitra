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

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

const translations = {
  English: {
    welcome: "Welcome to MandalMitra",
    namaskar: "Namaskar",
    announcements: "Announcements",
    upcomingEvents: "Upcoming Events",
    collection: "Collection",
    expenses: "Expenses",
    balance: "Balance",
    members: "Members",
    reports: "Reports",
    manageMembers: "Manage Members",
    latestAnnouncements: "Latest Announcements",
    viewAll: "View All",
    dashboard: "Dashboard",
    events: "Events",
    profile: "Profile",
    loading: "Loading Dashboard...",
    noEvents: "No upcoming events",
    noAnnouncements: "No announcements yet",
  },

  Marathi: {
    welcome: "MandalMitra मध्ये आपले स्वागत आहे",
    namaskar: "नमस्कार",
    announcements: "घोषणा",
    upcomingEvents: "आगामी कार्यक्रम",
    collection: "वर्गणी",
    expenses: "खर्च",
    balance: "शिल्लक",
    members: "सदस्य",
    reports: "अहवाल",
    manageMembers: "सदस्य व्यवस्थापन",
    latestAnnouncements: "नवीन घोषणा",
    viewAll: "सर्व पहा",
    dashboard: "डॅशबोर्ड",
    events: "कार्यक्रम",
    profile: "प्रोफाइल",
    loading: "डॅशबोर्ड लोड होत आहे...",
    noEvents: "आगामी कार्यक्रम नाहीत",
    noAnnouncements: "अजून कोणतीही घोषणा नाही",
  },

  Hindi: {
    welcome: "MandalMitra में आपका स्वागत है",
    namaskar: "नमस्कार",
    announcements: "घोषणाएं",
    upcomingEvents: "आगामी कार्यक्रम",
    collection: "संग्रह",
    expenses: "खर्च",
    balance: "शेष राशि",
    members: "सदस्य",
    reports: "रिपोर्ट",
    manageMembers: "सदस्य प्रबंधन",
    latestAnnouncements: "नई घोषणाएं",
    viewAll: "सभी देखें",
    dashboard: "डैशबोर्ड",
    events: "कार्यक्रम",
    profile: "प्रोफाइल",
    loading: "डैशबोर्ड लोड हो रहा है...",
    noEvents: "कोई आगामी कार्यक्रम नहीं",
    noAnnouncements: "अभी कोई घोषणा नहीं",
  },
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [account, setAccount] = useState<Account | null>(null);
  const [logoUrl, setLogoUrl] = useState("");

  const [memberCount, setMemberCount] = useState(0);
  const [collectionTotal, setCollectionTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [latestAnnouncements, setLatestAnnouncements] =
    useState<Announcement[]>([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const user = session.user;

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
        console.error("MANDAL DASHBOARD ERROR:", mandalError);
      }

      if (!mandal) {
        router.replace("/create-mandal");
        return;
      }

      if (!active) return;

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
        console.error("MEMBERS COUNT ERROR:", membersError);
        setMemberCount(0);
      } else {
        setMemberCount(membersCount || 0);
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

      let totalCollection = 0;

      if (collectionError) {
        console.error(
          "COLLECTION DASHBOARD ERROR:",
          collectionError
        );

        setCollectionTotal(0);
      } else {
        totalCollection = (collectionData || []).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

        setCollectionTotal(totalCollection);
      }

      // =========================
      // EXPENSES
      // =========================

      const {
        data: expenseData,
        error: expenseError,
      } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id);

      let totalExpenses = 0;

      if (expenseError) {
        console.error(
          "EXPENSE DASHBOARD ERROR:",
          expenseError
        );

        setExpenseTotal(0);
      } else {
        totalExpenses = (expenseData || []).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

        setExpenseTotal(totalExpenses);
      }

      // =========================
      // BALANCE
      // =========================

      setBalanceTotal(totalCollection - totalExpenses);

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
        setLatestEvents([]);
      } else {
        const events = (eventData || []).map((event) => ({
          id: String(event.id),
          title: event.title || "",
          location: event.location || "",
          date: event.date || "",
          description: event.description || "",
        }));

        setEventCount(events.length);
        setLatestEvents(events.slice(0, 2));
      }

      // =========================
      // ANNOUNCEMENTS
      // =========================

      const {
        data: announcementData,
        error: announcementError,
      } = await supabase
        .from("announcements")
        .select("id, title, message, created_at")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(2);

      if (announcementError) {
        console.error(
          "ANNOUNCEMENTS DASHBOARD ERROR:",
          announcementError
        );

        setLatestAnnouncements([]);
      } else {
        setLatestAnnouncements(
          announcementData || []
        );
      }

      if (active) {
        setLoading(false);
      }
    }

    loadDashboard();

    const handleFocus = () => {
      loadDashboard();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [router, setLanguage]);

  // =========================
  // NAVIGATION
  // =========================

  function openEvents() {
    router.push("/events");
  }

  function openAnnouncements() {
    router.push("/announcements");
  }

  function openMembers() {
    router.push("/members");
  }

  function openCollection() {
    router.push("/collection");
  }

  function openExpenses() {
    router.push("/expenses");
  }

  function openReports() {
    router.push("/reports");
  }

  function openProfile() {
    router.push("/settings");
  }

  // =========================
  // DATE
  // =========================

  function formatDate(date: string) {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  }

  // =========================
  // MONEY FORMAT
  // =========================

  function formatMoney(amount: number) {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}K`;
    }

    return amount.toString();
  }

  // =========================
  // LOADING
  // =========================

  if (loading || !account) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101725]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />

          <p className="text-white/70">
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
    <main className="min-h-screen overflow-x-hidden bg-[#101725] text-white">

      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] border-r border-white/10 bg-[#10182b]/95 px-5 py-7 backdrop-blur-xl lg:block">

        {/* LOGO */}

        <div className="mb-10 flex justify-center">
          {logoUrl ? (
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-2xl">
              <img
                src={logoUrl}
                alt="MandalSetu Logo"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-4xl">
              🏛️
            </div>
          )}
        </div>

        <nav className="space-y-2">

          {/* DASHBOARD */}

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 text-left font-semibold text-white shadow-lg"
          >
            <span className="text-2xl">⌂</span>
            {t.dashboard}
          </button>

          {/* MEMBERS */}

          <button
            onClick={openMembers}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">👥</span>
            {t.members}
          </button>

          {/* COLLECTION */}

          <button
            onClick={openCollection}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">💰</span>
            {t.collection}
          </button>

          {/* EXPENSES */}

          <button
            onClick={openExpenses}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">💸</span>
            {t.expenses}
          </button>

          {/* REPORTS */}

          <button
            onClick={openReports}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">📊</span>
            {t.reports}
          </button>

          {/* ANNOUNCEMENTS */}

          <button
            onClick={openAnnouncements}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">📣</span>
            {t.announcements}
          </button>

          {/* EVENTS */}

          <button
            onClick={openEvents}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-2xl">📅</span>
            {t.events}
          </button>

        </nav>

        {/* PROFILE */}

        <button
          onClick={openProfile}
          className="absolute bottom-8 left-5 right-5 flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-white/75 hover:bg-white/10"
        >
          <span className="text-2xl">👤</span>
          {t.profile}
        </button>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="lg:ml-[250px]">

        <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-10">

          {/* HEADER */}

          <section className="relative overflow-hidden rounded-[30px] border border-orange-300/20 bg-gradient-to-br from-orange-500 via-orange-500 to-[#ff7a00] px-5 py-6 shadow-2xl sm:px-8 lg:px-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl" />

            <div className="relative flex items-center gap-4">

              {/* LOGO - SIZE UNCHANGED */}

              <button
                onClick={openProfile}
                className="shrink-0"
              >
                {logoUrl ? (
                  <div className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-[24px] bg-white p-2 shadow-xl sm:h-24 sm:w-24">
                    <img
                      src={logoUrl}
                      alt="MandalSetu Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[24px] bg-white text-3xl sm:h-24 sm:w-24">
                    🏛️
                  </div>
                )}
              </button>

              {/* ONLY MANDAL NAME */}

              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
                  {account.mandalName}
                </h1>
              </div>

            </div>

          </section>

          {/* =========================
              SUMMARY CARDS
          ========================= */}

          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

            {/* EVENTS */}

            <button
              onClick={openEvents}
              className="relative min-h-[125px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#ff9d00] to-[#f24d00] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                {eventCount}
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.upcomingEvents}
              </p>
            </button>

            {/* COLLECTION */}

            <button
              onClick={openCollection}
              className="relative min-h-[125px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#09a6a5] to-[#087d83] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                ₹{formatMoney(collectionTotal)}
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.collection}
              </p>
            </button>

            {/* MEMBERS */}

            <button
              onClick={openMembers}
              className="relative min-h-[125px] w-full overflow-hidden rounded-[22px] bg-gradient-to-br from-[#7140e8] to-[#5420b8] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                {memberCount}
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.members}
              </p>

              <p className="mt-1 text-xs text-white/60">
                {t.manageMembers}
              </p>
            </button>

            {/* EXPENSES */}

            <button
              onClick={openExpenses}
              className="relative min-h-[125px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#ef4444] to-[#b91c1c] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                ₹{formatMoney(expenseTotal)}
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.expenses}
              </p>
            </button>

            {/* BALANCE */}

            <button
              onClick={openReports}
              className="relative min-h-[125px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#22c55e] to-[#15803d] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                ₹{formatMoney(balanceTotal)}
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.balance}
              </p>
            </button>

            {/* REPORTS */}

            <button
              onClick={openReports}
              className="relative min-h-[125px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#6366f1] to-[#4338ca] p-4 text-left shadow-xl transition active:scale-[0.98]"
            >
              <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

              <p className="text-3xl font-extrabold sm:text-4xl">
                📊
              </p>

              <p className="mt-3 text-sm font-bold leading-tight sm:text-base">
                {t.reports}
              </p>
            </button>

          </section>

          {/* =========================
              LATEST ANNOUNCEMENTS
              MOVED ABOVE EVENTS
          ========================= */}

          <section className="mt-8 border-t border-white/10 pt-7">

            <div className="mb-4 flex items-center justify-between px-1">

              <h2 className="text-xl font-bold sm:text-2xl">
                {t.latestAnnouncements}
              </h2>

              <button
                onClick={openAnnouncements}
                className="text-sm font-semibold text-[#91a4c9] transition hover:text-white sm:text-base"
              >
                {t.viewAll} →
              </button>

            </div>

            <div className="space-y-3">

              {latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((announcement) => (

                  <button
                    key={announcement.id}
                    onClick={openAnnouncements}
                    className="relative flex w-full items-start gap-4 overflow-hidden rounded-[18px] border border-white/10 bg-[#1a2334]/90 p-4 text-left shadow-xl transition active:scale-[0.99]"
                  >

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#24304a] text-2xl">
                      📣
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="text-base font-bold sm:text-lg">
                        {announcement.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/55">
                        {announcement.message}
                      </p>

                      <p className="mt-2 text-xs text-white/35">
                        {formatDate(
                          announcement.created_at
                        )}
                      </p>

                    </div>

                  </button>

                ))
              ) : (
                <div className="rounded-[18px] border border-white/10 bg-[#1a2334] p-6 text-center text-white/50">
                  {t.noAnnouncements}
                </div>
              )}

            </div>

          </section>

          {/* =========================
              UPCOMING EVENTS
          ========================= */}

          <section className="mt-8">

            <div className="mb-4 flex items-center justify-between px-1">

              <h2 className="text-xl font-bold sm:text-2xl">
                {t.upcomingEvents}
              </h2>

              <button
                onClick={openEvents}
                className="text-sm font-semibold text-[#91a4c9] transition hover:text-white sm:text-base"
              >
                {t.viewAll} →
              </button>

            </div>

            <div className="space-y-3">

              {latestEvents.length > 0 ? (
                latestEvents.map((event, index) => (

                  <button
                    key={event.id}
                    onClick={openEvents}
                    className="group relative flex w-full items-center gap-4 overflow-hidden rounded-[18px] border border-white/10 bg-[#1a2334]/90 p-4 text-left shadow-xl backdrop-blur-xl transition active:scale-[0.99]"
                  >

                    <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-orange-500/5" />

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#24304a] text-3xl shadow-lg">
                      {index === 0 ? "🪔" : "🙏"}
                    </div>

                    <div className="relative min-w-0">

                      <h3 className="truncate text-base font-bold text-white sm:text-lg">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-white/60">
                        {formatDate(event.date)}
                      </p>

                      {event.location && (
                        <p className="mt-1 truncate text-xs text-white/45">
                          📍 {event.location}
                        </p>
                      )}

                    </div>

                  </button>

                ))
              ) : (
                <div className="rounded-[18px] border border-white/10 bg-[#1a2334] p-6 text-center text-white/50">
                  {t.noEvents}
                </div>
              )}

            </div>

          </section>

        </div>

      </div>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#f7f6f2] px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] lg:hidden">

        <div className="mx-auto flex h-[76px] max-w-xl items-center justify-around">

          {/* DASHBOARD */}

          <button
            onClick={() => router.push("/dashboard")}
            className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
          >
            <span className="text-2xl leading-none">
              🏠
            </span>

            <span className="text-[11px] font-bold">
              {t.dashboard}
            </span>

            <span className="h-0.5 w-8 rounded-full bg-[#ff6b00]" />
          </button>

          {/* MEMBERS */}

          <button
            onClick={openMembers}
            className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
          >
            <span className="text-2xl leading-none">
              👥
            </span>

            <span className="text-[11px] font-semibold">
              {t.members}
            </span>
          </button>

          {/* EVENTS */}

          <button
            onClick={openEvents}
            className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
          >
            <span className="text-2xl leading-none">
              📅
            </span>

            <span className="text-[11px] font-semibold">
              {t.events}
            </span>
          </button>

          {/* ANNOUNCEMENTS */}

          <button
            onClick={openAnnouncements}
            className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
          >
            <span className="text-2xl leading-none">
              📣
            </span>

            <span className="text-[11px] font-semibold">
              {t.announcements}
            </span>
          </button>

          {/* PROFILE */}

          <button
            onClick={openProfile}
            className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
          >
            <span className="text-2xl leading-none">
              👤
            </span>

            <span className="text-[11px] font-semibold">
              {t.profile}
            </span>
          </button>

        </div>

      </nav>

    </main>
  );
}