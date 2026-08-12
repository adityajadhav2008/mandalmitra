"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

type PaymentMode = "Cash" | "UPI";

type Collection = {
  id: string;
  member: string;
  amount: number;
  date: string;
  purpose?: string;
  payment_mode?: PaymentMode;
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
    paymentMode: "Payment Mode",
    cash: "Cash",
    upi: "UPI",
    updateCollection: "Update Collection",
    addCollectionButton: "Add Collection",
    cancel: "Cancel",
    history: "Collection History",
    noCollection: "No collection added yet.",
    edit: "Edit",
    delete: "Delete",
    viewReceipt: "View Receipt",
    close: "Close",
    loading: "Loading Collection...",
    enterDetails: "Please enter member, amount and date.",
    loadFailed: "Collection data load failed.",
    updateFailed: "Collection update failed.",
    saveFailed: "Collection save failed.",
    deleteFailed: "Collection delete failed.",
    deleteConfirm:
      "Are you sure you want to delete this collection?",

    receipt: "RECEIPT",
    receiptNo: "Receipt No.",
    receivedFrom: "Received From",
    amountReceived: "Amount Received",
    thankYou: "Thank you for your valuable contribution!",
    authorized: "Authorized",
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
    paymentMode: "पेमेंट मोड",
    cash: "Cash",
    upi: "UPI",
    updateCollection: "वर्गणी अपडेट करा",
    addCollectionButton: "वर्गणी जोडा",
    cancel: "रद्द करा",
    history: "वर्गणी इतिहास",
    noCollection: "अजून कोणतीही वर्गणी जोडलेली नाही.",
    edit: "संपादित करा",
    delete: "हटवा",
    viewReceipt: "पावती पहा",
    close: "बंद करा",
    loading: "वर्गणी लोड होत आहे...",
    enterDetails:
      "कृपया सदस्य, रक्कम आणि दिनांक टाका.",
    loadFailed: "वर्गणीची माहिती लोड करता आली नाही.",
    updateFailed: "वर्गणी अपडेट करता आली नाही.",
    saveFailed: "वर्गणी सेव्ह करता आली नाही.",
    deleteFailed: "वर्गणी हटवता आली नाही.",
    deleteConfirm:
      "तुम्हाला ही वर्गणी नक्की हटवायची आहे का?",

    receipt: "पावती",
    receiptNo: "पावती क्र.",
    receivedFrom: "प्राप्तकर्त्याचे नाव",
    amountReceived: "प्राप्त रक्कम",
    thankYou: "आपल्या अमूल्य योगदानाबद्दल धन्यवाद!",
    authorized: "अधिकृत",
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
    paymentMode: "भुगतान का तरीका",
    cash: "Cash",
    upi: "UPI",
    updateCollection: "संग्रह अपडेट करें",
    addCollectionButton: "संग्रह जोड़ें",
    cancel: "रद्द करें",
    history: "संग्रह इतिहास",
    noCollection: "अभी तक कोई संग्रह नहीं जोड़ा गया है।",
    edit: "संपादित करें",
    delete: "हटाएं",
    viewReceipt: "रसीद देखें",
    close: "बंद करें",
    loading: "संग्रह लोड हो रहा है...",
    enterDetails:
      "कृपया सदस्य, राशि और दिनांक दर्ज करें।",
    loadFailed: "संग्रह की जानकारी लोड नहीं हो सकी।",
    updateFailed: "संग्रह अपडेट नहीं हो सका।",
    saveFailed: "संग्रह सेव नहीं हो सका।",
    deleteFailed: "संग्रह हटाया नहीं जा सका।",
    deleteConfirm:
      "क्या आप इस संग्रह को हटाना चाहते हैं?",

    receipt: "रसीद",
    receiptNo: "रसीद क्र.",
    receivedFrom: "प्राप्तकर्ता का नाम",
    amountReceived: "प्राप्त राशि",
    thankYou: "आपके अमूल्य योगदान के लिए धन्यवाद!",
    authorized: "अधिकृत",
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
  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("Cash");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [viewingReceipt, setViewingReceipt] =
    useState<Collection | null>(null);

  const [mandalName, setMandalName] =
    useState("मंडळ");

  const [mandalLogo, setMandalLogo] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCollections();
    loadMandalData();
  }, [language]);

  async function loadMandalData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: mandal } = await supabase
      .from("mandals")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (mandal) {
      setMandalName(
        mandal.mandal_name || "मंडळ"
      );
    }

    const savedLogo =
      localStorage.getItem("mandalLogo");

    if (savedLogo) {
      setMandalLogo(savedLogo);
    }
  }

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
          payment_mode:
            item.payment_mode === "UPI"
              ? "UPI"
              : "Cash",
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
          payment_mode: paymentMode,
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
        payment_mode: paymentMode,
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
    setPaymentMode("Cash");

    await loadCollections();
  }

  function startEdit(item: Collection) {
    setEditingId(item.id);

    setMember(item.member || "");
    setAmount(String(item.amount || ""));
    setDate(item.date || "");
    setPurpose(item.purpose || "");
    setPaymentMode(
      item.payment_mode === "UPI"
        ? "UPI"
        : "Cash"
    );

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
    setPaymentMode("Cash");
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

    if (viewingReceipt?.id === id) {
      setViewingReceipt(null);
    }

    if (editingId === id) {
      cancelEdit();
    }

    await loadCollections();
  }

  function formatDate(value: string) {
    if (!value) return "";

    const d = new Date(
      `${value}T00:00:00`
    );

    return d.toLocaleDateString(
      language === "Marathi"
        ? "mr-IN"
        : language === "Hindi"
        ? "hi-IN"
        : "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function getReceiptNumber(
    item: Collection
  ) {
    return (
      "MR-" +
      item.id
        .replace(/\D/g, "")
        .slice(-6)
        .padStart(6, "0")
    );
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

            {/* MEMBER */}

            <input
              value={member}
              onChange={(e) =>
                setMember(e.target.value)
              }
              placeholder={t.memberName}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            {/* AMOUNT */}

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

            {/* DATE */}

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            {/* PURPOSE */}

            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            >
              <option value="">
                {t.purpose}
              </option>

              <option value="Mandal Collection">
                Mandal Collection
              </option>

              <option value="Donation">
                Donation
              </option>

              <option value="Program">
                Program
              </option>

              <option value="Event">
                Event
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* PAYMENT MODE */}

            <select
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target.value as PaymentMode
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500 sm:col-span-2"
            >
              <option value="Cash">
                {t.cash}
              </option>

              <option value="UPI">
                {t.upi}
              </option>
            </select>

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

                      {` • ${
                        item.payment_mode ||
                        "Cash"
                      }`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="mr-2 font-bold text-green-600">
                      ₹{item.amount}
                    </span>

                    {/* VIEW RECEIPT */}

                    <button
                      type="button"
                      onClick={() =>
                        setViewingReceipt(item)
                      }
                      className="cursor-pointer rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-600"
                    >
                      👁 {t.viewReceipt}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(item)
                      }
                      className="cursor-pointer rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-600"
                    >
                      {t.edit}
                    </button>

                    {/* DELETE */}

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

      {/* ========================= */}
      {/* RECEIPT VIEW MODAL */}
      {/* ========================= */}

      {viewingReceipt && (

        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8"
          onClick={() =>
            setViewingReceipt(null)
          }
        >

          <div
            className="mx-auto w-full max-w-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setViewingReceipt(null)
                }
                className="rounded-full bg-white px-4 py-2 font-bold text-gray-700 shadow"
              >
                ✕
              </button>
            </div>

            {/* RECEIPT */}

            <div
              className="relative overflow-hidden rounded-[28px] border-[6px] border-orange-500 bg-white shadow-2xl"
            >

              {/* FAINT LOGO BACKGROUND */}

              {mandalLogo && (
                <img
                  src={mandalLogo}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.055]"
                />
              )}

              <div className="relative z-10">

                {/* HEADER */}

                <div className="bg-orange-500 px-6 py-7 text-center text-white">

                  {mandalLogo ? (
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white p-2">
                      <img
                        src={mandalLogo}
                        alt="Mandal Logo"
                        className="h-full w-full rounded-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl">
                      🏛️
                    </div>
                  )}

                  <h2 className="text-3xl font-black">
                    {mandalName}
                  </h2>

                  <div className="mx-auto mt-4 inline-block rounded-full bg-white px-8 py-2 text-sm font-black text-orange-500">
                    {t.receipt}
                  </div>

                </div>

                {/* RECEIPT CONTENT */}

                <div className="relative px-6 py-7 sm:px-8">

                  {/* RECEIPT NO + DATE */}

                  <div className="mb-6 flex justify-between gap-4 border-b border-gray-200 pb-5">

                    <div>
                      <p className="text-[11px] font-bold text-gray-400">
                        {t.receiptNo}
                      </p>

                      <p className="mt-1 text-base font-black">
                        {getReceiptNumber(
                          viewingReceipt
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold text-gray-400">
                        {t.date}
                      </p>

                      <p className="mt-1 text-base font-black">
                        {formatDate(
                          viewingReceipt.date
                        )}
                      </p>
                    </div>

                  </div>

                  {/* MEMBER */}

                  <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                    <p className="text-[11px] font-bold text-orange-500">
                      {t.receivedFrom}
                    </p>

                    <p className="mt-2 break-words text-2xl font-black text-gray-900">
                      {viewingReceipt.member}
                    </p>

                  </div>

                  {/* PURPOSE + PAYMENT */}

                  <div className="mb-6 grid grid-cols-2 gap-4 border-b border-gray-200 pb-5">

                    <div>
                      <p className="text-[11px] font-bold text-gray-400">
                        {t.purpose}
                      </p>

                      <p className="mt-1 break-words text-base font-black text-gray-900">
                        {viewingReceipt.purpose ||
                          "-"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold text-gray-400">
                        {t.paymentMode}
                      </p>

                      <p className="mt-1 text-base font-black text-gray-900">
                        {viewingReceipt.payment_mode ===
                        "UPI"
                          ? "UPI"
                          : "Cash"}
                      </p>
                    </div>

                  </div>

                  {/* AMOUNT */}

                  <div className="rounded-3xl bg-orange-500 px-5 py-7 text-center text-white">

                    <p className="text-sm font-semibold">
                      {t.amountReceived}
                    </p>

                    <p className="mt-1 text-5xl font-black">
                      ₹{viewingReceipt.amount}
                    </p>

                  </div>

                  {/* THANK YOU */}

                  <div className="mt-8 text-center">

                    <p className="text-base font-bold text-gray-800">
                      {t.thankYou}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-500">
                      {mandalName}
                    </p>

                  </div>

                  {/* APP NAME */}

                  <div className="mt-7 border-t border-gray-100 pt-4 text-center">

                    <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400">
                      POWERED BY
                    </p>

                    <p className="mt-1 text-xs font-black tracking-wide text-orange-500">
                      MandalSetu
                    </p>

                  </div>

                </div>

                {/* BOTTOM ORANGE */}

                <div className="h-3 bg-orange-500" />

              </div>

            </div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setViewingReceipt(null)
              }
              className="mt-4 w-full rounded-xl bg-white px-5 py-3 font-bold text-gray-700 shadow"
            >
              {t.close}
            </button>

          </div>

        </div>

      )}

    </main>
  );
}