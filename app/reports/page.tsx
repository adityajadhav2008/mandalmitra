"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  useLanguage,
  type Language,
} from "../language-provider";

type Collection = {
  id: string;
  member: string;
  amount: number;
  date: string;
  purpose?: string;
};

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  description?: string;
};

const translations: Record<
  Language,
  {
    back: string;
    reports: string;
    subtitle: string;
    financialSummary: string;
    totalCollection: string;
    totalExpenses: string;
    balance: string;
    collectionHistory: string;
    expenseHistory: string;
    noCollection: string;
    noExpenses: string;
    member: string;
    amount: string;
    date: string;
    purpose: string;
    expense: string;
    description: string;
    loading: string;
  }
> = {
  English: {
    back: "← Go to Dashboard",
    reports: "Reports",
    subtitle: "View your mandal's financial summary.",
    financialSummary: "Financial Summary",
    totalCollection: "Total Collection",
    totalExpenses: "Total Expenses",
    balance: "Balance",
    collectionHistory: "Collection History",
    expenseHistory: "Expense History",
    noCollection: "No collection has been added yet.",
    noExpenses: "No expenses have been added yet.",
    member: "Member",
    amount: "Amount",
    date: "Date",
    purpose: "Purpose",
    expense: "Expense",
    description: "Description",
    loading: "Loading reports...",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    reports: "अहवाल",
    subtitle: "तुमच्या मंडळाचा आर्थिक सारांश पहा.",
    financialSummary: "आर्थिक सारांश",
    totalCollection: "एकूण वर्गणी",
    totalExpenses: "एकूण खर्च",
    balance: "शिल्लक",
    collectionHistory: "वर्गणी इतिहास",
    expenseHistory: "खर्च इतिहास",
    noCollection: "अजून कोणतीही वर्गणी जोडलेली नाही.",
    noExpenses: "अजून कोणताही खर्च जोडलेला नाही.",
    member: "सदस्य",
    amount: "रक्कम",
    date: "तारीख",
    purpose: "उद्देश",
    expense: "खर्च",
    description: "वर्णन",
    loading: "अहवाल लोड होत आहेत...",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएँ",
    reports: "रिपोर्ट",
    subtitle: "अपने मंडल का वित्तीय सारांश देखें।",
    financialSummary: "वित्तीय सारांश",
    totalCollection: "कुल संग्रह",
    totalExpenses: "कुल खर्च",
    balance: "शेष राशि",
    collectionHistory: "संग्रह इतिहास",
    expenseHistory: "खर्च इतिहास",
    noCollection: "अभी तक कोई संग्रह नहीं जोड़ा गया है।",
    noExpenses: "अभी तक कोई खर्च नहीं जोड़ा गया है।",
    member: "सदस्य",
    amount: "राशि",
    date: "तारीख",
    purpose: "उद्देश्य",
    expense: "खर्च",
    description: "विवरण",
    loading: "रिपोर्ट लोड हो रही हैं...",
  },
};

export default function ReportsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [collections, setCollections] = useState<Collection[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadReports() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // =========================
      // COLLECTIONS
      // =========================

      const {
        data: collectionData,
        error: collectionError,
      } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (collectionError) {
        console.error(
          "REPORT COLLECTION ERROR:",
          collectionError
        );

        if (active) {
          setCollections([]);
        }
      } else {
        const fixedCollections: Collection[] = (
          collectionData || []
        ).map((item) => ({
          id: String(item.id),
          member: item.member || "",
          amount: Number(item.amount || 0),
          date: item.date || "",
          purpose: item.purpose || "",
        }));

        if (active) {
          setCollections(fixedCollections);
        }
      }

      // =========================
      // EXPENSES
      // =========================

      const {
        data: expenseData,
        error: expenseError,
      } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (expenseError) {
        console.error(
          "REPORT EXPENSE ERROR:",
          expenseError
        );

        if (active) {
          setExpenses([]);
        }
      } else {
        const fixedExpenses: Expense[] = (
          expenseData || []
        ).map((item) => ({
          id: String(item.id),
          title: item.title || "",
          amount: Number(item.amount || 0),
          date: item.date || "",
          description: item.description || "",
        }));

        if (active) {
          setExpenses(fixedExpenses);
        }
      }

      if (active) {
        setLoading(false);
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, [language, router, supabase]);

  const totalCollection = collections.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const balance = totalCollection - totalExpenses;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-lg font-semibold text-gray-500">
              {t.loading}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 cursor-pointer font-semibold text-orange-500 hover:text-orange-600"
        >
          {t.back}
        </button>

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t.reports}
          </h1>

          <p className="mt-2 text-gray-500">
            {t.subtitle}
          </p>
        </div>

        {/* FINANCIAL SUMMARY */}

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            {t.financialSummary}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">

            {/* TOTAL COLLECTION */}

            <div className="rounded-2xl bg-green-500 p-6 text-white shadow-sm">
              <p className="text-sm">
                {t.totalCollection}
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₹{totalCollection}
              </p>
            </div>

            {/* TOTAL EXPENSE */}

            <div className="rounded-2xl bg-red-500 p-6 text-white shadow-sm">
              <p className="text-sm">
                {t.totalExpenses}
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₹{totalExpenses}
              </p>
            </div>

            {/* BALANCE */}

            <div
              className={`rounded-2xl p-6 text-white shadow-sm ${
                balance >= 0
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            >
              <p className="text-sm">
                {t.balance}
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₹{balance}
              </p>
            </div>

          </div>
        </section>

        {/* COLLECTION HISTORY */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            {t.collectionHistory}
          </h2>

          {collections.length === 0 ? (
            <p className="mt-5 text-gray-500">
              {t.noCollection}
            </p>
          ) : (
            <div className="mt-5 space-y-3">

              {collections.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-bold text-gray-900">
                      {item.member}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {t.date}: {item.date}
                    </p>

                    {item.purpose && (
                      <p className="mt-1 text-sm text-gray-500">
                        {t.purpose}: {item.purpose}
                      </p>
                    )}
                  </div>

                  <p className="font-bold text-green-600">
                    ₹{item.amount}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* EXPENSE HISTORY */}

        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            {t.expenseHistory}
          </h2>

          {expenses.length === 0 ? (
            <p className="mt-5 text-gray-500">
              {t.noExpenses}
            </p>
          ) : (
            <div className="mt-5 space-y-3">

              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-bold text-gray-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {t.date}: {item.date}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {t.description}:{" "}
                        {item.description}
                      </p>
                    )}
                  </div>

                  <p className="font-bold text-red-500">
                    ₹{item.amount}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}