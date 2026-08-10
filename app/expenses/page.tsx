"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  useLanguage,
  type Language,
} from "../language-provider";

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
  description: string;
};

const translations = {
  English: {
    back: "← Back to Dashboard",
    title: "Expenses",
    subtitle: "Track Mandal expenses.",
    totalExpenses: "Total Expenses",
    editExpense: "Edit Expense",
    addExpense: "Add Expense",
    expenseTitle: "Expense Title",
    amount: "Amount",
    date: "Date",
    description: "Description",
    updateExpense: "Update Expense",
    addExpenseButton: "Add Expense",
    cancel: "Cancel",
    history: "Expense History",
    noExpenses: "No expenses added yet.",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading Expenses...",
    enterDetails: "Please enter title, amount and date.",
    loadFailed: "Expenses load failed.",
    updateFailed: "Expense update failed.",
    saveFailed: "Expense save failed.",
    deleteFailed: "Expense delete failed.",
    deleteConfirm:
      "Are you sure you want to delete this expense?",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    title: "खर्च",
    subtitle: "मंडळाचा खर्च व्यवस्थापित करा.",
    totalExpenses: "एकूण खर्च",
    editExpense: "खर्च संपादित करा",
    addExpense: "खर्च जोडा",
    expenseTitle: "खर्चाचे नाव",
    amount: "रक्कम",
    date: "दिनांक",
    description: "वर्णन",
    updateExpense: "खर्च अपडेट करा",
    addExpenseButton: "खर्च जोडा",
    cancel: "रद्द करा",
    history: "खर्च इतिहास",
    noExpenses: "अजून कोणताही खर्च जोडलेला नाही.",
    edit: "संपादित करा",
    delete: "हटवा",
    loading: "खर्च लोड होत आहे...",
    enterDetails:
      "कृपया खर्चाचे नाव, रक्कम आणि दिनांक टाका.",
    loadFailed: "खर्चाची माहिती लोड करता आली नाही.",
    updateFailed: "खर्च अपडेट करता आला नाही.",
    saveFailed: "खर्च सेव्ह करता आला नाही.",
    deleteFailed: "खर्च हटवता आला नाही.",
    deleteConfirm:
      "तुम्हाला हा खर्च नक्की हटवायचा आहे का?",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएं",
    title: "खर्च",
    subtitle: "मंडल के खर्च को प्रबंधित करें।",
    totalExpenses: "कुल खर्च",
    editExpense: "खर्च संपादित करें",
    addExpense: "खर्च जोड़ें",
    expenseTitle: "खर्च का नाम",
    amount: "राशि",
    date: "दिनांक",
    description: "विवरण",
    updateExpense: "खर्च अपडेट करें",
    addExpenseButton: "खर्च जोड़ें",
    cancel: "रद्द करें",
    history: "खर्च इतिहास",
    noExpenses: "अभी तक कोई खर्च नहीं जोड़ा गया है।",
    edit: "संपादित करें",
    delete: "हटाएं",
    loading: "खर्च लोड हो रहा है...",
    enterDetails:
      "कृपया खर्च का नाम, राशि और दिनांक दर्ज करें।",
    loadFailed: "खर्च की जानकारी लोड नहीं हो सकी।",
    updateFailed: "खर्च अपडेट नहीं हो सका।",
    saveFailed: "खर्च सेव नहीं हो सका।",
    deleteFailed: "खर्च हटाया नहीं जा सका।",
    deleteConfirm:
      "क्या आप इस खर्च को हटाना चाहते हैं?",
  },
};

export default function ExpensesPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadExpenses();
  }, [language]);

  async function loadExpenses() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("EXPENSE LOAD ERROR:", error);

      alert(t.loadFailed);

      setExpenses([]);
      setLoading(false);
      return;
    }

    const fixedData: Expense[] =
      (data || []).map((item) => ({
        id: String(item.id),
        title: item.title || "",
        amount: Number(item.amount || 0),
        date: item.date || "",
        description: item.description || "",
      }));

    setExpenses(fixedData);
    setLoading(false);
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const numericAmount = Number(amount);
    const cleanDescription =
      description.trim();

    if (
      !cleanTitle ||
      numericAmount <= 0 ||
      !date
    ) {
      alert(t.enterDetails);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (editingId !== null) {
      const { error } = await supabase
        .from("expenses")
        .update({
          title: cleanTitle,
          amount: numericAmount,
          date: date,
          description: cleanDescription,
        })
        .eq("id", editingId)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "EXPENSE UPDATE ERROR:",
          error
        );

        alert(t.updateFailed);
        return;
      }

      cancelEdit();

      await loadExpenses();

      return;
    }

    const { error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        title: cleanTitle,
        amount: numericAmount,
        date: date,
        description: cleanDescription,
      });

    if (error) {
      console.error(
        "EXPENSE INSERT ERROR:",
        error
      );

      alert(t.saveFailed);
      return;
    }

    setTitle("");
    setAmount("");
    setDate("");
    setDescription("");

    await loadExpenses();
  }

  function startEdit(item: Expense) {
    setEditingId(item.id);

    setTitle(item.title);
    setAmount(String(item.amount));
    setDate(item.date);
    setDescription(item.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);

    setTitle("");
    setAmount("");
    setDate("");
    setDescription("");
  }

  async function deleteExpense(
    id: string
  ) {
    const confirmed = window.confirm(
      t.deleteConfirm
    );

    if (!confirmed) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "EXPENSE DELETE ERROR:",
        error
      );

      alert(t.deleteFailed);
      return;
    }

    if (editingId === id) {
      cancelEdit();
    }

    await loadExpenses();
  }

  const total = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {t.loading}
        </div>
      </main>
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

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t.title}
            </h1>

            <p className="mt-2 text-gray-500">
              {t.subtitle}
            </p>
          </div>

          <div className="rounded-2xl bg-red-500 px-6 py-4 text-white">

            <p className="text-sm">
              {t.totalExpenses}
            </p>

            <p className="text-2xl font-bold">
              ₹{total}
            </p>

          </div>

        </div>

        {/* ADD / EDIT FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
        >

          <h2 className="text-xl font-bold">
            {editingId !== null
              ? t.editExpense
              : t.addExpense}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder={t.expenseTitle}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder={t.amount}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder={t.description}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editingId !== null
                ? t.updateExpense
                : t.addExpenseButton}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="cursor-pointer rounded-xl border px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
            )}

          </div>

        </form>

        {/* EXPENSE HISTORY */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            {t.history}
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
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p className="font-bold">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.date}

                      {item.description &&
                        ` • ${item.description}`}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="mr-2 font-bold text-red-500">
                      ₹{item.amount}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(item)
                      }
                      className="cursor-pointer rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-600"
                    >
                      {t.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteExpense(item.id)
                      }
                      className="cursor-pointer rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600"
                    >
                      {t.delete}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}