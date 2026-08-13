"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

type PaymentMode = "Cash" | "UPI";
type CollectionStatus = "Paid" | "Pending";

type Collection = {
  id: string;
  member: string;
  amount: number;
  date: string;
  purpose?: string;
  payment_mode?: PaymentMode;
  status?: CollectionStatus;
  total_amount?: number;
  paid_amount?: number;
  pending_amount?: number;
};

const translations = {
  English: {
    back: "← Back to Dashboard",
    title: "Collection",
    subtitle: "Add and manage Mandal collection.",

    totalCollection: "Total Collection",
    pendingCollection: "Pending Collection",

    editCollection: "Edit Collection",
    addCollection: "Add Collection",

    memberName: "Member Name",
    amount: "Amount",
    totalAmount: "Total Amount",
    paidAmount: "Collected Amount",
    pendingAmount: "Pending Amount",

    date: "Date",
    purpose: "Purpose",
    paymentMode: "Payment Mode",

    collectionStatus: "Collection Status",
    paid: "Paid",
    pending: "Pending",

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

    share: "Share",
    download: "Download",

    loading: "Loading Collection...",

    enterDetails: "Please enter member, amount and date.",
    enterPendingDetails:
      "Please enter total amount and collected amount.",
    invalidAmount:
      "Collected amount cannot be greater than total amount.",

    loadFailed: "Collection data load failed.",
    updateFailed: "Collection update failed.",
    saveFailed: "Collection save failed.",
    deleteFailed: "Collection delete failed.",

    deleteConfirm:
      "Are you sure you want to delete this collection?",

    shareFailed: "Sharing is not supported on this device.",
    downloadReceipt: "Download Receipt",

    receipt: "RECEIPT",
    receiptNo: "Receipt No.",
    receivedFrom: "Received From",
    amountReceived: "Amount Received",

    receiptTotal: "Total Amount",
    receiptPaid: "Collected",
    receiptPending: "Pending",

    thankYou:
      "Thank you for your valuable contribution!",

    authorized: "Authorized",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    title: "वर्गणी",
    subtitle: "मंडळाची वर्गणी जोडा आणि व्यवस्थापित करा.",

    totalCollection: "एकूण जमा",
    pendingCollection: "एकूण बाकी",

    editCollection: "वर्गणी संपादित करा",
    addCollection: "वर्गणी जोडा",

    memberName: "सदस्याचे नाव",
    amount: "रक्कम",
    totalAmount: "एकूण रक्कम",
    paidAmount: "जमा रक्कम",
    pendingAmount: "बाकी रक्कम",

    date: "दिनांक",
    purpose: "कारण",
    paymentMode: "पेमेंट मोड",

    collectionStatus: "वर्गणी स्थिती",
    paid: "पूर्ण जमा",
    pending: "बाकी",

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

    share: "शेअर",
    download: "डाउनलोड",

    loading: "वर्गणी लोड होत आहे...",

    enterDetails:
      "कृपया सदस्य, रक्कम आणि दिनांक टाका.",

    enterPendingDetails:
      "कृपया एकूण रक्कम आणि जमा रक्कम टाका.",

    invalidAmount:
      "जमा रक्कम एकूण रकमेपेक्षा जास्त असू शकत नाही.",

    loadFailed: "वर्गणीची माहिती लोड करता आली नाही.",
    updateFailed: "वर्गणी अपडेट करता आली नाही.",
    saveFailed: "वर्गणी सेव्ह करता आली नाही.",
    deleteFailed: "वर्गणी हटवता आली नाही.",

    deleteConfirm:
      "तुम्हाला ही वर्गणी नक्की हटवायची आहे का?",

    shareFailed:
      "या डिव्हाइसवर शेअर सुविधा उपलब्ध नाही.",

    downloadReceipt: "पावती डाउनलोड करा",

    receipt: "पावती",
    receiptNo: "पावती क्र.",
    receivedFrom: "प्राप्तकर्त्याचे नाव",
    amountReceived: "प्राप्त रक्कम",

    receiptTotal: "एकूण रक्कम",
    receiptPaid: "जमा",
    receiptPending: "बाकी",

    thankYou:
      "आपल्या अमूल्य योगदानाबद्दल धन्यवाद!",

    authorized: "अधिकृत",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएं",
    title: "संग्रह",
    subtitle: "मंडल का संग्रह जोड़ें और प्रबंधित करें।",

    totalCollection: "कुल जमा",
    pendingCollection: "कुल बाकी",

    editCollection: "संग्रह संपादित करें",
    addCollection: "संग्रह जोड़ें",

    memberName: "सदस्य का नाम",
    amount: "राशि",
    totalAmount: "कुल राशि",
    paidAmount: "जमा राशि",
    pendingAmount: "बाकी राशि",

    date: "दिनांक",
    purpose: "उद्देश्य",
    paymentMode: "भुगतान का तरीका",

    collectionStatus: "संग्रह स्थिति",
    paid: "पूरा जमा",
    pending: "बाकी",

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

    share: "शेयर",
    download: "डाउनलोड",

    loading: "संग्रह लोड हो रहा है...",

    enterDetails:
      "कृपया सदस्य, राशि और दिनांक दर्ज करें।",

    enterPendingDetails:
      "कृपया कुल राशि और जमा राशि दर्ज करें।",

    invalidAmount:
      "जमा राशि कुल राशि से अधिक नहीं हो सकती।",

    loadFailed: "संग्रह की जानकारी लोड नहीं हो सकी।",
    updateFailed: "संग्रह अपडेट नहीं हो सका।",
    saveFailed: "संग्रह सेव नहीं हो सका।",
    deleteFailed: "संग्रह हटाया नहीं जा सका।",

    deleteConfirm:
      "क्या आप इस संग्रह को हटाना चाहते हैं?",

    shareFailed:
      "इस डिवाइस पर शेयर सुविधा उपलब्ध नहीं है।",

    downloadReceipt: "रसीद डाउनलोड करें",

    receipt: "रसीद",
    receiptNo: "रसीद क्र.",
    receivedFrom: "प्राप्तकर्ता का नाम",
    amountReceived: "प्राप्त राशि",

    receiptTotal: "कुल राशि",
    receiptPaid: "जमा",
    receiptPending: "बाकी",

    thankYou:
      "आपके अमूल्य योगदान के लिए धन्यवाद!",

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

  const [totalAmount, setTotalAmount] =
    useState("");

  const [paidAmount, setPaidAmount] =
    useState("");

  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");

  const [paymentMode, setPaymentMode] =
    useState<PaymentMode>("Cash");

  const [status, setStatus] =
    useState<CollectionStatus>("Paid");

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

          amount: Number(
            item.amount ||
              item.paid_amount ||
              0
          ),

          date: item.date || "",

          purpose: item.purpose || "",

          payment_mode:
            item.payment_mode === "UPI"
              ? "UPI"
              : "Cash",

          status:
            item.status === "Pending"
              ? "Pending"
              : "Paid",

          total_amount: Number(
            item.total_amount ||
              item.amount ||
              0
          ),

          paid_amount: Number(
            item.paid_amount ||
              item.amount ||
              0
          ),

          pending_amount: Number(
            item.pending_amount || 0
          ),
        }))
      );
    }

    setLoading(false);
  }

  function getPendingAmount() {
    const total = Number(totalAmount) || 0;
    const paid = Number(paidAmount) || 0;

    return Math.max(total - paid, 0);
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    const cleanMember = member.trim();
    const cleanPurpose = purpose.trim();

    if (!cleanMember || !date) {
      alert(t.enterDetails);
      return;
    }

    let finalTotalAmount = 0;
    let finalPaidAmount = 0;
    let finalPendingAmount = 0;

    if (status === "Pending") {
      finalTotalAmount =
        Number(totalAmount) || 0;

      finalPaidAmount =
        Number(paidAmount) || 0;

      if (
        finalTotalAmount <= 0 ||
        finalPaidAmount < 0
      ) {
        alert(t.enterPendingDetails);
        return;
      }

      if (
        finalPaidAmount >
        finalTotalAmount
      ) {
        alert(t.invalidAmount);
        return;
      }

      finalPendingAmount =
        finalTotalAmount -
        finalPaidAmount;
    } else {
      finalTotalAmount =
        Number(amount) || 0;

      finalPaidAmount =
        Number(amount) || 0;

      finalPendingAmount = 0;

      if (finalTotalAmount <= 0) {
        alert(t.enterDetails);
        return;
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const payload = {
      member: cleanMember,
      amount: finalPaidAmount,
      total_amount: finalTotalAmount,
      paid_amount: finalPaidAmount,
      pending_amount: finalPendingAmount,
      date,
      purpose: cleanPurpose,
      payment_mode: paymentMode,
      status,
    };

    if (editingId !== null) {
      const { error } = await supabase
        .from("collections")
        .update(payload)
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
        ...payload,
      });

    if (error) {
      console.error(error);
      alert(t.saveFailed);
      return;
    }

    resetForm();

    await loadCollections();
  }

  function resetForm() {
    setMember("");
    setAmount("");
    setTotalAmount("");
    setPaidAmount("");
    setDate("");
    setPurpose("");
    setPaymentMode("Cash");
    setStatus("Paid");
  }

  function startEdit(item: Collection) {
    setEditingId(item.id);

    setMember(item.member || "");

    if (item.status === "Pending") {
      setStatus("Pending");

      setTotalAmount(
        String(
          item.total_amount ||
            item.amount ||
            0
        )
      );

      setPaidAmount(
        String(
          item.paid_amount ||
            item.amount ||
            0
        )
      );

      setAmount("");
    } else {
      setStatus("Paid");

      setAmount(
        String(item.amount || "")
      );

      setTotalAmount("");
      setPaidAmount("");
    }

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
    resetForm();
  }

  async function deleteCollection(
    id: string
  ) {
    const confirmed =
      window.confirm(
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

    if (
      viewingReceipt?.id === id
    ) {
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

  /*
   * TOTAL COLLECTED
   */
  const total = collections.reduce(
    (sum, item) =>
      sum +
      Number(
        item.paid_amount ||
          item.amount ||
          0
      ),
    0
  );

  /*
   * TOTAL PENDING
   */
  const pendingCollection =
    collections.reduce(
      (sum, item) =>
        sum +
        Number(
          item.pending_amount || 0
        ),
      0
    );

  const currentPending =
    status === "Pending"
      ? getPendingAmount()
      : 0;

  /*
   * SHARE RECEIPT
   */
  async function shareReceipt(
    item: Collection
  ) {
    const receiptNo =
      getReceiptNumber(item);

    const paid =
      Number(
        item.paid_amount ||
          item.amount ||
          0
      );

    const pending =
      Number(
        item.pending_amount || 0
      );

    const totalAmountValue =
      Number(
        item.total_amount ||
          item.amount ||
          0
      );

    const shareText =
      item.status === "Pending"
        ? `${mandalName}\n\n${t.receipt}\n${t.receiptNo}: ${receiptNo}\n${t.receivedFrom}: ${item.member}\n${t.date}: ${formatDate(item.date)}\n${t.receiptTotal}: ₹${totalAmountValue}\n${t.receiptPaid}: ₹${paid}\n${t.receiptPending}: ₹${pending}\n${t.purpose}: ${item.purpose || "-"}\n${t.paymentMode}: ${item.payment_mode || "Cash"}`
        : `${mandalName}\n\n${t.receipt}\n${t.receiptNo}: ${receiptNo}\n${t.receivedFrom}: ${item.member}\n${t.date}: ${formatDate(item.date)}\n${t.amountReceived}: ₹${paid}\n${t.purpose}: ${item.purpose || "-"}\n${t.paymentMode}: ${item.payment_mode || "Cash"}`;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: `${mandalName} - ${t.receipt}`,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(
          shareText
        );

        alert(
          language === "Marathi"
            ? "पावतीची माहिती कॉपी झाली आहे."
            : language === "Hindi"
            ? "रसीद की जानकारी कॉपी हो गई है।"
            : "Receipt details copied."
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  /*
   * DOWNLOAD RECEIPT
   *
   * Browser print dialog opens.
   * User can select "Save as PDF".
   */
  function downloadReceipt() {
    window.print();
  }

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

          {/* TOP TOTALS */}

          <div className="grid grid-cols-2 gap-3">

            {/* TOTAL COLLECTION */}

            <div className="rounded-2xl bg-green-500 px-5 py-4 text-white">
              <p className="text-xs font-semibold">
                {t.totalCollection}
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹{total}
              </p>
            </div>

            {/* PENDING COLLECTION */}

            <div className="rounded-2xl bg-red-500 px-5 py-4 text-white">
              <p className="text-xs font-semibold">
                {t.pendingCollection}
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹{pendingCollection}
              </p>
            </div>

          </div>

        </div>

        {/* FORM */}

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
                setMember(
                  e.target.value
                )
              }
              placeholder={
                t.memberName
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) => {
                const newStatus =
                  e.target
                    .value as CollectionStatus;

                setStatus(newStatus);

                if (
                  newStatus === "Paid"
                ) {
                  setTotalAmount("");
                  setPaidAmount("");
                  setAmount("");
                } else {
                  setAmount("");
                }
              }}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="Paid">
                {t.paid}
              </option>

              <option value="Pending">
                {t.pending}
              </option>
            </select>

            {/* NORMAL AMOUNT */}

            {status === "Paid" && (
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder={t.amount}
                className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                required
              />
            )}

            {/* PENDING TOTAL */}

            {status === "Pending" && (
              <input
                type="number"
                min="1"
                value={totalAmount}
                onChange={(e) =>
                  setTotalAmount(
                    e.target.value
                  )
                }
                placeholder={
                  t.totalAmount
                }
                className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                required
              />
            )}

            {/* PENDING PAID */}

            {status === "Pending" && (
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) =>
                  setPaidAmount(
                    e.target.value
                  )
                }
                placeholder={
                  t.paidAmount
                }
                className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                required
              />
            )}

            {/* AUTO PENDING */}

            {status === "Pending" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold text-red-500">
                  {t.pendingAmount}
                </p>

                <p className="mt-1 text-xl font-black text-red-600">
                  ₹{currentPending}
                </p>
              </div>
            )}

            {/* DATE */}

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            {/* PURPOSE */}

            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(
                  e.target.value
                )
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

            {/* PAYMENT */}

            <select
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target
                    .value as PaymentMode
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

          {/* PENDING SUMMARY */}

          {status === "Pending" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  {t.totalAmount}
                </p>

                <p className="mt-1 text-xl font-bold">
                  ₹
                  {Number(
                    totalAmount
                  ) || 0}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs text-green-600">
                  {t.paidAmount}
                </p>

                <p className="mt-1 text-xl font-bold text-green-600">
                  ₹
                  {Number(
                    paidAmount
                  ) || 0}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs text-red-600">
                  {t.pendingAmount}
                </p>

                <p className="mt-1 text-xl font-bold text-red-600">
                  ₹{currentPending}
                </p>
              </div>

            </div>
          )}

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
                onClick={
                  cancelEdit
                }
                className="cursor-pointer rounded-xl border px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
            )}

          </div>
        </form>

        {/* HISTORY */}

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

              {collections.map(
                (item) => {

                  const itemPaid =
                    Number(
                      item.paid_amount ||
                        item.amount ||
                        0
                    );

                  const itemTotal =
                    Number(
                      item.total_amount ||
                        item.amount ||
                        0
                    );

                  const itemPending =
                    Number(
                      item.pending_amount ||
                        0
                    );

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="min-w-0">

                        <p className="font-bold">
                          {item.member}
                        </p>

                        <p className="text-sm text-gray-500">
                          {formatDate(
                            item.date
                          )}

                          {item.purpose &&
                            ` • ${item.purpose}`}

                          {` • ${
                            item.payment_mode ||
                            "Cash"
                          }`}
                        </p>

                        {item.status ===
                        "Pending" ? (

                          <div className="mt-3 flex flex-wrap gap-2">

                            <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold">
                              {t.totalAmount}: ₹
                              {itemTotal}
                            </span>

                            <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                              {t.paidAmount}: ₹
                              {itemPaid}
                            </span>

                            <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                              {t.pendingAmount}: ₹
                              {itemPending}
                            </span>

                          </div>

                        ) : (

                          <span className="mt-2 inline-block rounded-lg bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                            {t.paid}
                          </span>

                        )}

                      </div>

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="mr-2 font-bold text-green-600">
                          ₹{itemPaid}
                        </span>

                        {/* RECEIPT */}

                        <button
                          type="button"
                          onClick={() =>
                            setViewingReceipt(
                              item
                            )
                          }
                          className="cursor-pointer rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-600"
                        >
                          👁 {t.viewReceipt}
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              item
                            )
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
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

      {/* RECEIPT MODAL */}

      {viewingReceipt && (

        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8 print:bg-white print:px-0 print:py-0"
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

            <div className="mb-3 flex justify-end print:hidden">

              <button
                type="button"
                onClick={() =>
                  setViewingReceipt(
                    null
                  )
                }
                className="rounded-full bg-white px-4 py-2 font-bold text-gray-700 shadow"
              >
                ✕
              </button>

            </div>

            {/* RECEIPT */}

            <div
              id="receipt-print-area"
              className="relative isolate overflow-hidden rounded-[28px] border-[6px] border-orange-500 bg-white shadow-2xl print:rounded-none print:border-0 print:shadow-none"
            >

              {/* WATERMARK */}

              {mandalLogo && (
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={mandalLogo}
                    alt=""
                    className="h-64 w-64 max-w-[65%] max-h-[65%] object-contain opacity-[0.055]"
                  />
                </div>
              )}

              <div className="relative z-10">

                {/* HEADER */}

                <div className="bg-orange-500 px-6 py-7 text-center text-white">

                  {mandalLogo ? (
                    <div className="mx-auto mb-4 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2">
                      <img
                        src={mandalLogo}
                        alt="Mandal Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white text-4xl">
                      🏛️
                    </div>
                  )}

                  <h2 className="break-words text-3xl font-black">
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

                  {/* PURPOSE PAYMENT */}

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

                  {/* AMOUNTS */}

                  {viewingReceipt.status ===
                  "Pending" ? (

                    <div className="space-y-3">

                      <div className="flex justify-between rounded-xl bg-gray-50 px-5 py-4">

                        <span className="font-semibold text-gray-500">
                          {t.receiptTotal}
                        </span>

                        <span className="font-black text-gray-900">
                          ₹
                          {viewingReceipt.total_amount ||
                            0}
                        </span>

                      </div>

                      <div className="flex justify-between rounded-xl bg-green-50 px-5 py-4">

                        <span className="font-semibold text-green-600">
                          {t.receiptPaid}
                        </span>

                        <span className="font-black text-green-600">
                          ₹
                          {viewingReceipt.paid_amount ||
                            viewingReceipt.amount ||
                            0}
                        </span>

                      </div>

                      <div className="flex justify-between rounded-xl bg-red-50 px-5 py-4">

                        <span className="font-semibold text-red-600">
                          {t.receiptPending}
                        </span>

                        <span className="font-black text-red-600">
                          ₹
                          {viewingReceipt.pending_amount ||
                            0}
                        </span>

                      </div>

                    </div>

                  ) : (

                    <div className="rounded-3xl bg-orange-500 px-5 py-7 text-center text-white">

                      <p className="text-sm font-semibold">
                        {t.amountReceived}
                      </p>

                      <p className="mt-1 text-5xl font-black">
                        ₹
                        {viewingReceipt.amount}
                      </p>

                    </div>

                  )}

                  {/* THANK YOU */}

                  <div className="mt-8 text-center">

                    <p className="text-base font-bold text-gray-800">
                      {t.thankYou}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-500">
                      {mandalName}
                    </p>

                  </div>

                  {/* APP */}

                  <div className="mt-7 border-t border-gray-100 pt-4 text-center">

                    <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400">
                      POWERED BY
                    </p>

                    <p className="mt-1 text-xs font-black tracking-wide text-orange-500">
                      MandalSetu
                    </p>

                  </div>

                </div>

                <div className="h-3 bg-orange-500" />

              </div>

            </div>

            {/* SHARE + DOWNLOAD */}

            <div className="mt-4 grid grid-cols-2 gap-3 print:hidden">

              <button
                type="button"
                onClick={() =>
                  shareReceipt(
                    viewingReceipt
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-bold text-white shadow hover:bg-green-600"
              >
                <span className="text-lg">
                  ↗
                </span>

                {t.share}
              </button>

              <button
                type="button"
                onClick={
                  downloadReceipt
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow hover:bg-orange-600"
              >
                <span className="text-lg">
                  ↓
                </span>

                {t.download}
              </button>

            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setViewingReceipt(
                  null
                )
              }
              className="mt-3 w-full rounded-xl bg-white px-5 py-3 font-bold text-gray-700 shadow print:hidden"
            >
              {t.close}
            </button>

          </div>

        </div>

      )}

    </main>
  );
}