"use client";

import { FormEvent, useEffect, useState } from "react";
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

const translations = {
  English: {
    back: "← Back to Dashboard",
    title: "Collection",
    subtitle: "Add and manage Mandal collection.",
    totalCollection: "Total Collection",
    editCollection: "Edit Collection",
    addCollection: "Add Collection",
    memberName: "Member Name",
    amount: "Amount",
    date: "Date",
    purpose: "Purpose",
    updateCollection: "Update Collection",
    addCollectionButton: "Add Collection",
    cancel: "Cancel",
    history: "Collection History",
    noCollection: "No collection added yet.",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading Collection...",
    enterDetails:
      "Please enter member, amount and date.",
    loadFailed: "Collection data load failed.",
    updateFailed: "Collection update failed.",
    saveFailed: "Collection save failed.",
    deleteFailed: "Collection delete failed.",
    deleteConfirm:
      "Are you sure you want to delete this collection?",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    title: "वर्गणी",
    subtitle: "मंडळाची वर्गणी जोडा आणि व्यवस्थापित करा.",
    totalCollection: "एकूण वर्गणी",
    editCollection: "वर्गणी संपादित करा",
    addCollection: "वर्गणी जोडा",
    memberName: "सदस्याचे नाव",
    amount: "रक्कम",
    date: "दिनांक",
    purpose: "कारण",
    updateCollection: "वर्गणी अपडेट करा",
    addCollectionButton: "वर्गणी जोडा",
    cancel: "रद्द करा",
    history: "वर्गणी इतिहास",
    noCollection: "अजून कोणतीही वर्गणी जोडलेली नाही.",
    edit: "संपादित करा",
    delete: "हटवा",
    loading: "वर्गणी लोड होत आहे...",
    enterDetails:
      "कृपया सदस्य, रक्कम आणि दिनांक टाका.",
    loadFailed: "वर्गणीची माहिती लोड करता आली नाही.",
    updateFailed: "वर्गणी अपडेट करता आली नाही.",
    saveFailed: "वर्गणी सेव्ह करता आली नाही.",
    deleteFailed: "वर्गणी हटवता आली नाही.",
    deleteConfirm:
      "तुम्हाला ही वर्गणी नक्की हटवायची आहे का?",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएं",
    title: "संग्रह",
    subtitle: "मंडल का संग्रह जोड़ें और प्रबंधित करें।",
    totalCollection: "कुल संग्रह",
    editCollection: "संग्रह संपादित करें",
    addCollection: "संग्रह जोड़ें",
    memberName: "सदस्य का नाम",
    amount: "राशि",
    date: "दिनांक",
    purpose: "उद्देश्य",
    updateCollection: "संग्रह अपडेट करें",
    addCollectionButton: "संग्रह जोड़ें",
    cancel: "रद्द करें",
    history: "संग्रह इतिहास",
    noCollection: "अभी तक कोई संग्रह नहीं जोड़ा गया है।",
    edit: "संपादित करें",
    delete: "हटाएं",
    loading: "संग्रह लोड हो रहा है...",
    enterDetails:
      "कृपया सदस्य, राशि और दिनांक दर्ज करें।",
    loadFailed: "संग्रह की जानकारी लोड नहीं हो सकी।",
    updateFailed: "संग्रह अपडेट नहीं हो सका।",
    saveFailed: "संग्रह सेव नहीं हो सका।",
    deleteFailed: "संग्रह हटाया नहीं जा सका।",
    deleteConfirm:
      "क्या आप इस संग्रह को हटाना चाहते हैं?",
  },
};

export default function CollectionPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [collections, setCollections] =
    useState<Collection[]>([]);

  const [member, setMember] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCollections();
  }, [language]);

  async function loadCollections() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert(t.loadFailed);
      setCollections([]);
    } else {
      setCollections(
        (data || []).map((item) => ({
          id: String(item.id),
          member: item.member || "",
          amount: Number(item.amount || 0),
          date: item.date || "",
          purpose: item.purpose || "",
        }))
      );
    }

    setLoading(false);
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    const cleanMember = member.trim();
    const numericAmount = Number(amount);
    const cleanPurpose = purpose.trim();

    if (
      !cleanMember ||
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
        .from("collections")
        .update({
          member: cleanMember,
          amount: numericAmount,
          date: date,
          purpose: cleanPurpose,
        })
        .eq("id", editingId)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);

        alert(t.updateFailed);
        return;
      }

      cancelEdit();

      await loadCollections();

      return;
    }

    const { error } = await supabase
      .from("collections")
      .insert({
        user_id: user.id,
        member: cleanMember,
        amount: numericAmount,
        date: date,
        purpose: cleanPurpose,
      });

    if (error) {
      console.error(error);

      alert(t.saveFailed);
      return;
    }

    setMember("");
    setAmount("");
    setDate("");
    setPurpose("");

    await loadCollections();
  }

  function startEdit(item: Collection) {
    setEditingId(item.id);

    setMember(item.member || "");
    setAmount(String(item.amount || ""));
    setDate(item.date || "");
    setPurpose(item.purpose || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);

    setMember("");
    setAmount("");
    setDate("");
    setPurpose("");
  }

  async function deleteCollection(
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
      .from("collections")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);

      alert(t.deleteFailed);
      return;
    }

    if (editingId === id) {
      cancelEdit();
    }

    await loadCollections();
  }

  const total = collections.reduce(
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

          <div className="rounded-2xl bg-green-500 px-6 py-4 text-white">

            <p className="text-sm">
              {t.totalCollection}
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
              ? t.editCollection
              : t.addCollection}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <input
              value={member}
              onChange={(e) =>
                setMember(e.target.value)
              }
              placeholder={t.memberName}
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
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              placeholder={t.purpose}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editingId !== null
                ? t.updateCollection
                : t.addCollectionButton}
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

        {/* COLLECTION HISTORY */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            {t.history}
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
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p className="font-bold">
                      {item.member}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.date}
                      {item.purpose &&
                        ` • ${item.purpose}`}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="mr-2 font-bold text-green-600">
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
                        deleteCollection(
                          item.id
                        )
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