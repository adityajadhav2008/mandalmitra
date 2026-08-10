"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import html2canvas from "html2canvas";

type Language = "English" | "Marathi" | "Hindi";

type Translation = {
  title: string;
  subtitle: string;
  back: string;
  logo: string;
  uploadLogo: string;
  changeLogo: string;
  memberName: string;
  mobile: string;
  amount: string;
  purpose: string;
  date: string;
  receiptNo: string;
  selectPurpose: string;
  mandalCollection: string;
  donation: string;
  program: string;
  event: string;
  other: string;
  note: string;
  optional: string;
  download: string;
  whatsapp: string;
  generating: string;
  sending: string;
  receipt: string;
  receivedFrom: string;
  amountLabel: string;
  thankYou: string;
  authorized: string;
  language: string;
  enterName: string;
  enterMobile: string;
  enterAmount: string;
  enterNote: string;
};

const translations: Record<Language, Translation> = {
  English: {
    title: "Create Receipt",
    subtitle: "Create an attractive Mandal receipt",
    back: "← Back to Dashboard",
    logo: "Mandal Logo",
    uploadLogo: "Upload Logo",
    changeLogo: "Change Logo",
    memberName: "Member Name",
    mobile: "Mobile Number",
    amount: "Amount",
    purpose: "Purpose",
    date: "Date",
    receiptNo: "Receipt No.",
    selectPurpose: "Select Purpose",
    mandalCollection: "Mandal Collection",
    donation: "Donation",
    program: "Program",
    event: "Event",
    other: "Other",
    note: "Note",
    optional: "Optional",
    download: "Download Receipt Photo",
    whatsapp: "Send on WhatsApp",
    generating: "Generating...",
    sending: "Preparing WhatsApp...",
    receipt: "RECEIPT",
    receivedFrom: "Received From",
    amountLabel: "Amount",
    thankYou: "Thank you for your contribution!",
    authorized: "Authorized Signature",
    language: "Receipt Language",
    enterName: "Enter member name",
    enterMobile: "Enter mobile number",
    enterAmount: "Enter amount",
    enterNote: "Enter note",
  },

  Marathi: {
    title: "पावती तयार करा",
    subtitle: "मंडळाची आकर्षक पावती तयार करा",
    back: "← डॅशबोर्डवर जा",
    logo: "मंडळाचा लोगो",
    uploadLogo: "लोगो अपलोड करा",
    changeLogo: "लोगो बदला",
    memberName: "सदस्याचे नाव",
    mobile: "मोबाईल नंबर",
    amount: "रक्कम",
    purpose: "उद्देश",
    date: "तारीख",
    receiptNo: "पावती क्र.",
    selectPurpose: "उद्देश निवडा",
    mandalCollection: "मंडळ वर्गणी",
    donation: "देणगी",
    program: "कार्यक्रम",
    event: "उत्सव",
    other: "इतर",
    note: "नोंद",
    optional: "ऐच्छिक",
    download: "पावतीचा फोटो डाउनलोड करा",
    whatsapp: "WhatsApp वर पाठवा",
    generating: "पावती तयार होत आहे...",
    sending: "WhatsApp साठी तयार होत आहे...",
    receipt: "पावती",
    receivedFrom: "प्राप्तकर्त्याचे नाव",
    amountLabel: "रक्कम",
    thankYou: "आपल्या योगदानाबद्दल धन्यवाद!",
    authorized: "अधिकृत स्वाक्षरी",
    language: "पावतीची भाषा",
    enterName: "सदस्याचे नाव टाका",
    enterMobile: "मोबाईल नंबर टाका",
    enterAmount: "रक्कम टाका",
    enterNote: "नोंद टाका",
  },

  Hindi: {
    title: "रसीद बनाएं",
    subtitle: "मंडल की आकर्षक रसीद बनाएं",
    back: "← डैशबोर्ड पर जाएं",
    logo: "मंडल का लोगो",
    uploadLogo: "लोगो अपलोड करें",
    changeLogo: "लोगो बदलें",
    memberName: "सदस्य का नाम",
    mobile: "मोबाइल नंबर",
    amount: "राशि",
    purpose: "उद्देश्य",
    date: "तारीख",
    receiptNo: "रसीद क्र.",
    selectPurpose: "उद्देश्य चुनें",
    mandalCollection: "मंडल वर्गणी",
    donation: "दान",
    program: "कार्यक्रम",
    event: "उत्सव",
    other: "अन्य",
    note: "नोट",
    optional: "वैकल्पिक",
    download: "रसीद का फोटो डाउनलोड करें",
    whatsapp: "WhatsApp पर भेजें",
    generating: "रसीद तैयार हो रही है...",
    sending: "WhatsApp के लिए तैयार हो रहा है...",
    receipt: "रसीद",
    receivedFrom: "प्राप्तकर्ता का नाम",
    amountLabel: "राशि",
    thankYou: "आपके योगदान के लिए धन्यवाद!",
    authorized: "अधिकृत हस्ताक्षर",
    language: "Receipt Language",
    enterName: "सदस्य का नाम दर्ज करें",
    enterMobile: "मोबाइल नंबर दर्ज करें",
    enterAmount: "राशि दर्ज करें",
    enterNote: "नोट दर्ज करें",
  },
};

export default function CreateReceiptPage() {
  const router = useRouter();
  const supabase = createClient();

  const receiptRef = useRef<HTMLDivElement | null>(null);

  const [language, setLanguage] =
    useState<Language>("Marathi");

  const [mandalName, setMandalName] =
    useState("मंडळ");

  const [logo, setLogo] = useState("");
  const [memberName, setMemberName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [receiptNumber, setReceiptNumber] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const t = translations[language];

  useEffect(() => {
    let active = true;

    async function loadData() {
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

      if (!active) return;

      if (mandal) {
        setMandalName(
          mandal.mandal_name || "मंडळ"
        );

        if (
          mandal.language === "English" ||
          mandal.language === "Marathi" ||
          mandal.language === "Hindi"
        ) {
          setLanguage(mandal.language);
        }
      }

      const savedLogo =
        localStorage.getItem("mandalLogo");

      if (savedLogo) {
        setLogo(savedLogo);
      }

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      setDate(today);

      setReceiptNumber(
        "MR-" +
          Date.now()
            .toString()
            .slice(-6)
      );
    }

    loadData();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  function handleLogoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      setLogo(result);

      localStorage.setItem(
        "mandalLogo",
        result
      );
    };

    reader.readAsDataURL(file);
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

  function validateReceipt() {
    if (!memberName.trim()) {
      alert(t.enterName);
      return false;
    }

    if (!amount.trim()) {
      alert(t.enterAmount);
      return false;
    }

    if (Number(amount) <= 0) {
      alert(t.enterAmount);
      return false;
    }

    if (!purpose) {
      alert(t.selectPurpose);
      return false;
    }

    return true;
  }

  async function createReceiptImage(): Promise<{
    dataUrl: string;
    blob: Blob;
  }> {
    if (!receiptRef.current) {
      throw new Error(
        "Receipt preview not found."
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    const canvas = await html2canvas(
      receiptRef.current,
      {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: false,
        allowTaint: false,
        logging: false,
        foreignObjectRendering: false,
      }
    );

    const dataUrl =
      canvas.toDataURL("image/png");

    const response =
      await fetch(dataUrl);

    const blob =
      await response.blob();

    return {
      dataUrl,
      blob,
    };
  }

  async function downloadReceipt() {
    if (!validateReceipt()) return;

    try {
      setGenerating(true);

      const { dataUrl } =
        await createReceiptImage();

      const link =
        document.createElement("a");

      link.href = dataUrl;

      link.download =
        `mandal-receipt-${receiptNumber}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error(
        "Receipt generation error:",
        error
      );

      alert(
        "Receipt generate होत नाहीये. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function sendWhatsApp() {
    if (!validateReceipt()) return;

    try {
      setGenerating(true);

      const { blob } =
        await createReceiptImage();

      const file = new File(
        [blob],
        `mandal-receipt-${receiptNumber}.png`,
        {
          type: "image/png",
        }
      );

      const cleanMobile =
        mobile.replace(/\D/g, "");

      const formattedMobile =
        cleanMobile.length === 10
          ? `91${cleanMobile}`
          : cleanMobile;

      let message = "";

      if (language === "Marathi") {
        message = `नमस्कार,

${mandalName} ची पावती

पावती क्र.: ${receiptNumber}
नाव: ${memberName}
रक्कम: ₹${amount}
उद्देश: ${purpose}
तारीख: ${formatDate(date)}

आपल्या योगदानाबद्दल मनःपूर्वक धन्यवाद! 🙏

ही पावती MandalMitra द्वारे तयार करण्यात आली आहे.

https://mandalmitra.vercel.app`;
      } else if (language === "Hindi") {
        message = `नमस्ते,

${mandalName} की रसीद

रसीद क्र.: ${receiptNumber}
नाम: ${memberName}
राशि: ₹${amount}
उद्देश्य: ${purpose}
तारीख: ${formatDate(date)}

आपके योगदान के लिए हार्दिक धन्यवाद! 🙏

यह रसीद MandalMitra द्वारा बनाई गई है।

https://mandalmitra.vercel.app`;
      } else {
        message = `Hello,

${mandalName} Receipt

Receipt No.: ${receiptNumber}
Name: ${memberName}
Amount: ₹${amount}
Purpose: ${purpose}
Date: ${formatDate(date)}

Thank you for your valuable contribution! 🙏

This receipt was created using MandalMitra.

https://mandalmitra.vercel.app`;
      }

      /*
       * Mobile:
       * Native share sheet will open.
       * User selects WhatsApp.
       * Receipt image + message are shared together.
       */
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        try {
          await navigator.share({
            title: `${mandalName} Receipt`,
            text: message,
            files: [file],
          });

          return;
        } catch (shareError) {
          if (
            shareError instanceof DOMException &&
            shareError.name === "AbortError"
          ) {
            return;
          }

          console.log(
            "Native share unavailable:",
            shareError
          );
        }
      }

      /*
       * Desktop / unsupported browser:
       * Download receipt image and open WhatsApp.
       */
      const downloadUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        `mandal-receipt-${receiptNumber}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      const encodedMessage =
        encodeURIComponent(message);

      const whatsappUrl =
        formattedMobile.length >= 12
          ? `https://wa.me/${formattedMobile}?text=${encodedMessage}`
          : `https://wa.me/?text=${encodedMessage}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        URL.revokeObjectURL(
          downloadUrl
        );
      }, 1000);

      alert(
        "Receipt photo download झाली आहे. WhatsApp उघडला आहे. Photo attach करून Send करा."
      );
    } catch (error) {
      console.error(
        "WhatsApp receipt error:",
        error
      );

      alert(
        "WhatsApp साठी receipt तयार करता आली नाही."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          style={{
            marginBottom: "24px",
            border: "none",
            background: "transparent",
            color: "#f97316",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {t.back}
        </button>

        {/* HEADER */}

        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 900,
              color: "#111827",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(320px, 420px) minmax(320px, 1fr)",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* LEFT FORM */}

          <div
            style={{
              backgroundColor: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "24px",
              padding: "24px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            {/* LANGUAGE */}

            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                🌐 {t.language}
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value as Language
                  )
                }
                style={{
                  width: "100%",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              >
                <option value="Marathi">
                  मराठी
                </option>

                <option value="Hindi">
                  हिंदी
                </option>

                <option value="English">
                  English
                </option>
              </select>
            </div>

            {/* LOGO */}

            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                🏛️ {t.logo}
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt="Mandal Logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "16px",
                      border:
                        "1px solid #d1d5db",
                      objectFit: "contain",
                      padding: "8px",
                      backgroundColor:
                        "#ffffff",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      border:
                        "2px dashed #d1d5db",
                      borderRadius: "16px",
                      fontSize: "30px",
                      color: "#d1d5db",
                    }}
                  >
                    🏛️
                  </div>
                )}

                <label
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      "#f97316",
                    color: "#ffffff",
                    padding:
                      "12px 16px",
                    borderRadius: "12px",
                    fontWeight: 700,
                  }}
                >
                  {logo
                    ? t.changeLogo
                    : t.uploadLogo}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleLogoUpload
                    }
                    style={{
                      display: "none",
                    }}
                  />
                </label>
              </div>
            </div>

            {/* MEMBER NAME */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.memberName}
              </label>

              <input
                type="text"
                value={memberName}
                onChange={(e) =>
                  setMemberName(
                    e.target.value
                  )
                }
                placeholder={t.enterName}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* MOBILE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.mobile}
              </label>

              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value
                  )
                }
                placeholder={t.enterMobile}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* AMOUNT */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.amount}
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder={
                  t.enterAmount
                }
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* PURPOSE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.purpose}
              </label>

              <select
                value={purpose}
                onChange={(e) =>
                  setPurpose(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              >
                <option value="">
                  {t.selectPurpose}
                </option>

                <option
                  value={
                    t.mandalCollection
                  }
                >
                  {t.mandalCollection}
                </option>

                <option value={t.donation}>
                  {t.donation}
                </option>

                <option value={t.program}>
                  {t.program}
                </option>

                <option value={t.event}>
                  {t.event}
                </option>

                <option value={t.other}>
                  {t.other}
                </option>
              </select>
            </div>

            {/* DATE */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.date}
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* NOTE */}

            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {t.note}{" "}
                <span
                  style={{
                    fontWeight: 400,
                    color: "#9ca3af",
                  }}
                >
                  ({t.optional})
                </span>
              </label>

              <textarea
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                placeholder={
                  t.enterNote
                }
                rows={3}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  resize: "none",
                  padding:
                    "12px 16px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={
                downloadReceipt
              }
              disabled={generating}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "16px",
                backgroundColor:
                  generating
                    ? "#fdba74"
                    : "#f97316",
                color: "#ffffff",
                padding: "16px",
                fontSize: "17px",
                fontWeight: 900,
                cursor: generating
                  ? "not-allowed"
                  : "pointer",
                marginBottom:
                  "12px",
              }}
            >
              {generating
                ? t.generating
                : `📸 ${t.download}`}
            </button>

            {/* WHATSAPP */}

            <button
              type="button"
              onClick={
                sendWhatsApp
              }
              disabled={generating}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "16px",
                backgroundColor:
                  generating
                    ? "#86efac"
                    : "#16a34a",
                color: "#ffffff",
                padding: "16px",
                fontSize: "17px",
                fontWeight: 900,
                cursor: generating
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {generating
                ? t.sending
                : `🟢 ${t.whatsapp}`}
            </button>
          </div>

          {/* RECEIPT */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              width: "100%",
            }}
          >
            <div
              ref={receiptRef}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "560px",
                overflow: "hidden",
                border:
                  "6px solid #f97316",
                borderRadius: "28px",
                backgroundColor:
                  "#ffffff",
                boxSizing:
                  "border-box",
              }}
            >
              {/* RECEIPT HEADER */}

              <div
                style={{
                  position:
                    "relative",
                  padding:
                    "32px 28px",
                  textAlign:
                    "center",
                  backgroundColor:
                    "#f97316",
                  color: "#ffffff",
                }}
              >
                <div
                  style={{
                    position:
                      "absolute",
                    right: "-60px",
                    top: "-70px",
                    width: "200px",
                    height: "200px",
                    borderRadius:
                      "50%",
                    backgroundColor:
                      "rgba(255,255,255,0.12)",
                  }}
                />

                <div
                  style={{
                    position:
                      "relative",
                    width: "112px",
                    height: "112px",
                    margin:
                      "0 auto 16px",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    borderRadius:
                      "50%",
                    backgroundColor:
                      "#ffffff",
                    padding: "8px",
                    boxSizing:
                      "border-box",
                  }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt="Mandal Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius:
                          "50%",
                        objectFit:
                          "contain",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize:
                          "48px",
                      }}
                    >
                      🏛️
                    </span>
                  )}
                </div>

                <h2
                  style={{
                    position:
                      "relative",
                    margin: 0,
                    fontSize: "30px",
                    lineHeight: 1.2,
                    fontWeight: 900,
                    color:
                      "#ffffff",
                  }}
                >
                  {mandalName}
                </h2>

                <div
                  style={{
                    position:
                      "relative",
                    display:
                      "inline-block",
                    marginTop:
                      "16px",
                    padding:
                      "10px 32px",
                    borderRadius:
                      "999px",
                    backgroundColor:
                      "#ffffff",
                    color:
                      "#f97316",
                    fontSize:
                      "14px",
                    fontWeight: 900,
                  }}
                >
                  {t.receipt}
                </div>
              </div>

              {/* RECEIPT CONTENT */}

              <div
                style={{
                  padding:
                    "28px 32px",
                  backgroundColor:
                    "#ffffff",
                  color: "#111827",
                }}
              >
                {/* NUMBER / DATE */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    borderBottom:
                      "1px solid #e5e7eb",
                    paddingBottom:
                      "20px",
                    marginBottom:
                      "24px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        color:
                          "#9ca3af",
                      }}
                    >
                      {t.receiptNo}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "16px",
                        fontWeight: 900,
                        color:
                          "#1f2937",
                      }}
                    >
                      {receiptNumber}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        color:
                          "#9ca3af",
                      }}
                    >
                      {t.date}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "16px",
                        fontWeight: 900,
                        color:
                          "#1f2937",
                      }}
                    >
                      {formatDate(
                        date
                      )}
                    </p>
                  </div>
                </div>

                {/* MEMBER */}

                <div
                  style={{
                    marginBottom:
                      "24px",
                    padding:
                      "20px",
                    borderRadius:
                      "16px",
                    backgroundColor:
                      "#fff7ed",
                    border:
                      "1px solid #fed7aa",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "11px",
                      fontWeight: 700,
                      color:
                        "#f97316",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {t.receivedFrom}
                  </p>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      fontSize:
                        "24px",
                      lineHeight: 1.2,
                      fontWeight: 900,
                      color:
                        "#111827",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {memberName ||
                      "________________"}
                  </p>

                  {mobile && (
                    <p
                      style={{
                        margin:
                          "6px 0 0",
                        fontSize:
                          "14px",
                        color:
                          "#6b7280",
                      }}
                    >
                      📱 {mobile}
                    </p>
                  )}
                </div>

                {/* PURPOSE */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    borderBottom:
                      "1px solid #e5e7eb",
                    paddingBottom:
                      "20px",
                    marginBottom:
                      "24px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        color:
                          "#9ca3af",
                      }}
                    >
                      {t.purpose}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "18px",
                        fontWeight: 900,
                        color:
                          "#1f2937",
                      }}
                    >
                      {purpose ||
                        "________________"}
                    </p>
                  </div>

                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      borderRadius:
                        "50%",
                      backgroundColor:
                        "#fff7ed",
                      color:
                        "#ea580c",
                      fontSize:
                        "20px",
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                </div>

                {/* AMOUNT */}

                <div
                  style={{
                    position:
                      "relative",
                    overflow:
                      "hidden",
                    borderRadius:
                      "24px",
                    padding:
                      "28px 20px",
                    textAlign:
                      "center",
                    backgroundColor:
                      "#f97316",
                    color: "#ffffff",
                  }}
                >
                  <p
                    style={{
                      position:
                        "relative",
                      margin: 0,
                      fontSize:
                        "14px",
                      fontWeight: 600,
                      color:
                        "#ffffff",
                    }}
                  >
                    {t.amountLabel}
                  </p>

                  <p
                    style={{
                      position:
                        "relative",
                      margin:
                        "4px 0 0",
                      fontSize:
                        "48px",
                      lineHeight: 1.1,
                      fontWeight: 900,
                      color:
                        "#ffffff",
                    }}
                  >
                    ₹{amount || "0"}
                  </p>
                </div>

                {/* NOTE */}

                {note && (
                  <div
                    style={{
                      marginTop:
                        "24px",
                      padding: "16px",
                      border:
                        "1px dashed #d1d5db",
                      borderRadius:
                        "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        color:
                          "#9ca3af",
                      }}
                    >
                      {t.note}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "14px",
                        color:
                          "#4b5563",
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {note}
                    </p>
                  </div>
                )}

                {/* FOOTER */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-end",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    marginTop:
                      "36px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "14px",
                        fontWeight: 700,
                        color:
                          "#374151",
                      }}
                    >
                      {t.thankYou}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "11px",
                        color:
                          "#9ca3af",
                      }}
                    >
                      {mandalName}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    <div
                      style={{
                        width: "112px",
                        height: "1px",
                        backgroundColor:
                          "#9ca3af",
                        marginBottom:
                          "8px",
                      }}
                    />

                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        color:
                          "#6b7280",
                      }}
                    >
                      {t.authorized}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM STRIPE */}

              <div
                style={{
                  height: "12px",
                  backgroundColor:
                    "#f97316",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}