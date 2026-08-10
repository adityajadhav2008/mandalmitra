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
  save: string;
  share: string;
  done: string;
  generating: string;
  sharing: string;
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
  shareError: string;
};

const translations: Record<Language, Translation> = {
  English: {
    title: "Create Receipt",
    subtitle: "Create a professional Mandal receipt",
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
    save: "Save Receipt Image",
    share: "Share Receipt Image",
    done: "Done",
    generating: "Generating...",
    sharing: "Preparing Share...",
    receipt: "RECEIPT",
    receivedFrom: "Received From",
    amountLabel: "Amount Received",
    thankYou: "Thank you for your contribution!",
    authorized: "Authorized Signature",
    language: "Receipt Language",
    enterName: "Enter member name",
    enterMobile: "Enter mobile number",
    enterAmount: "Enter amount",
    enterNote: "Enter note",
    shareError: "Receipt image could not be shared.",
  },

  Marathi: {
    title: "पावती तयार करा",
    subtitle: "मंडळाची आकर्षक व प्रोफेशनल पावती तयार करा",
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
    save: "पावतीची इमेज सेव करा",
    share: "पावतीची इमेज शेअर करा",
    done: "झालं",
    generating: "पावती तयार होत आहे...",
    sharing: "शेअर करण्यासाठी तयार होत आहे...",
    receipt: "पावती",
    receivedFrom: "प्राप्तकर्त्याचे नाव",
    amountLabel: "प्राप्त रक्कम",
    thankYou: "आपल्या योगदानाबद्दल धन्यवाद!",
    authorized: "अधिकृत स्वाक्षरी",
    language: "पावतीची भाषा",
    enterName: "सदस्याचे नाव टाका",
    enterMobile: "मोबाईल नंबर टाका",
    enterAmount: "रक्कम टाका",
    enterNote: "नोंद टाका",
    shareError: "पावतीची इमेज शेअर करता आली नाही.",
  },

  Hindi: {
    title: "रसीद बनाएं",
    subtitle: "मंडल की आकर्षक और प्रोफेशनल रसीद बनाएं",
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
    save: "रसीद की इमेज सेव करें",
    share: "रसीद की इमेज शेयर करें",
    done: "हो गया",
    generating: "रसीद तैयार हो रही है...",
    sharing: "शेयर करने के लिए तैयार हो रहा है...",
    receipt: "रसीद",
    receivedFrom: "प्राप्तकर्ता का नाम",
    amountLabel: "प्राप्त राशि",
    thankYou: "आपके योगदान के लिए धन्यवाद!",
    authorized: "अधिकृत हस्ताक्षर",
    language: "रसीद की भाषा",
    enterName: "सदस्य का नाम दर्ज करें",
    enterMobile: "मोबाइल नंबर दर्ज करें",
    enterAmount: "राशि दर्ज करें",
    enterNote: "नोट दर्ज करें",
    shareError: "रसीद की इमेज शेयर नहीं हो सकी।",
  },
};

export default function CreateReceiptPage() {
  const router = useRouter();
  const supabase = createClient();

  const receiptRef = useRef<HTMLDivElement | null>(null);

  const [language, setLanguage] = useState<Language>("Marathi");
  const [mandalName, setMandalName] = useState("मंडळ");
  const [logo, setLogo] = useState("");
  const [memberName, setMemberName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [generating, setGenerating] = useState(false);

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
        setMandalName(mandal.mandal_name || "मंडळ");

        if (
          mandal.language === "English" ||
          mandal.language === "Marathi" ||
          mandal.language === "Hindi"
        ) {
          setLanguage(mandal.language);
        }
      }

      const savedLogo = localStorage.getItem("mandalLogo");

      if (savedLogo) {
        setLogo(savedLogo);
      }

      const today = new Date().toISOString().split("T")[0];

      setDate(today);

      setReceiptNumber(
        "MR-" + Date.now().toString().slice(-6)
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

      localStorage.setItem("mandalLogo", result);
    };

    reader.readAsDataURL(file);
  }

  function formatDate(value: string) {
    if (!value) return "";

    const d = new Date(`${value}T00:00:00`);

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
      throw new Error("Receipt preview not found.");
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

    const dataUrl = canvas.toDataURL("image/png");

    const response = await fetch(dataUrl);

    const blob = await response.blob();

    return {
      dataUrl,
      blob,
    };
  }

  async function saveReceiptImage() {
    if (!validateReceipt()) return;

    try {
      setGenerating(true);

      const { dataUrl } =
        await createReceiptImage();

      const link = document.createElement("a");

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

  async function shareReceiptImage() {
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

      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        const canShareFile =
          navigator.canShare
            ? navigator.canShare({
                files: [file],
              })
            : false;

        if (canShareFile) {
          await navigator.share({
            title: `${mandalName} - ${t.receipt}`,
            text: `${mandalName} - ${t.receipt}`,
            files: [file],
          });

          return;
        }

        await navigator.share({
          title: `${mandalName} - ${t.receipt}`,
          text: `${mandalName} - ${t.receipt}`,
        });

        return;
      }

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

      URL.revokeObjectURL(downloadUrl);

      alert(
        "तुमच्या device/browser मध्ये direct sharing उपलब्ध नाही. Receipt image save केली आहे."
      );
    } catch (error) {
      console.error(
        "Receipt sharing error:",
        error
      );

      /*
       * User ने share window cancel केली असेल
       * तर error दाखवायचा नाही.
       */
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      alert(t.shareError);
    } finally {
      setGenerating(false);
    }
  }

  function handleDone() {
    router.push("/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f6f1",
        padding: "24px 16px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
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
            marginBottom: "22px",
            border: "none",
            background: "transparent",
            color: "#c2410c",
            fontWeight: 800,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {t.back}
        </button>

        {/* HEADER */}

        <div
          style={{
            marginBottom: "28px",
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
            gap: "30px",
            alignItems: "start",
          }}
        >
          {/* =========================
              LEFT FORM
          ========================== */}

          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "22px",
              padding: "24px",
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            {/* LANGUAGE */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
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
                marginBottom: "22px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#374151",
                }}
              >
                🏛️ {t.logo}
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt="Mandal Logo"
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "14px",
                      border:
                        "1px solid #d1d5db",
                      objectFit: "contain",
                      padding: "7px",
                      backgroundColor:
                        "#ffffff",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "76px",
                      height: "76px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border:
                        "2px dashed #d1d5db",
                      borderRadius: "14px",
                      fontSize: "28px",
                      color: "#d1d5db",
                      flexShrink: 0,
                    }}
                  >
                    🏛️
                  </div>
                )}

                <label
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#f97316",
                    color: "#ffffff",
                    padding: "11px 14px",
                    borderRadius: "11px",
                    fontWeight: 800,
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
                marginBottom: "18px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* MOBILE */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* AMOUNT */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                placeholder={t.enterAmount}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* PURPOSE */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                  padding: "12px 14px",
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

                <option
                  value={t.donation}
                >
                  {t.donation}
                </option>

                <option
                  value={t.program}
                >
                  {t.program}
                </option>

                <option
                  value={t.event}
                >
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
                marginBottom: "18px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 800,
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
                  boxSizing: "border-box",
                  padding: "12px 14px",
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
                  fontWeight: 800,
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
                placeholder={t.enterNote}
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "none",
                  padding: "12px 14px",
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
          </div>

          {/* =========================
              RIGHT SIDE
          ========================== */}

          <div
            style={{
              width: "100%",
            }}
          >
            {/* RECEIPT */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
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
                    "5px solid #f97316",
                  borderRadius: "22px",
                  backgroundColor:
                    "#fffdf8",
                  boxSizing: "border-box",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                {/* TOP DECORATIVE LINE */}

                <div
                  style={{
                    height: "8px",
                    backgroundColor:
                      "#f97316",
                  }}
                />

                {/* RECEIPT HEADER */}

                <div
                  style={{
                    position: "relative",
                    padding:
                      "28px 24px 24px",
                    textAlign: "center",
                    backgroundColor:
                      "#fffdf8",
                    color: "#9a3412",
                  }}
                >
                  {/* CORNER DECORATION */}

                  <div
                    style={{
                      position:
                        "absolute",
                      left: "10px",
                      top: "10px",
                      width: "42px",
                      height: "42px",
                      borderTop:
                        "2px solid #f97316",
                      borderLeft:
                        "2px solid #f97316",
                      borderRadius:
                        "24px 0 0 0",
                    }}
                  />

                  <div
                    style={{
                      position:
                        "absolute",
                      right: "10px",
                      top: "10px",
                      width: "42px",
                      height: "42px",
                      borderTop:
                        "2px solid #f97316",
                      borderRight:
                        "2px solid #f97316",
                      borderRadius:
                        "0 24px 0 0",
                    }}
                  />

                  {/* LOGO */}

                  <div
                    style={{
                      position:
                        "relative",
                      width: "92px",
                      height: "92px",
                      margin:
                        "0 auto 14px",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      borderRadius:
                        "50%",
                      backgroundColor:
                        "#ffffff",
                      border:
                        "3px solid #f97316",
                      padding: "6px",
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
                            "42px",
                        }}
                      >
                        🏛️
                      </span>
                    )}
                  </div>

                  {/* MANDAL NAME */}

                  <h2
                    style={{
                      position:
                        "relative",
                      margin: 0,
                      fontSize:
                        "28px",
                      lineHeight: 1.25,
                      fontWeight: 900,
                      color:
                        "#9a3412",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {mandalName}
                  </h2>

                  {/* SUBTITLE */}

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      fontSize:
                        "13px",
                      color:
                        "#78716c",
                    }}
                  >
                    {language ===
                    "Marathi"
                      ? "सार्वजनिक उपक्रम व मंडळासाठी"
                      : language ===
                        "Hindi"
                      ? "मंडल के लिए"
                      : "For Mandal activities"}
                  </p>

                  {/* RECEIPT TITLE */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      marginTop:
                        "18px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        backgroundColor:
                          "#f2b38c",
                      }}
                    />

                    <span
                      style={{
                        color:
                          "#ea580c",
                        fontSize:
                          "18px",
                        fontWeight:
                          900,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      ◆ {t.receipt} ◆
                    </span>

                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        backgroundColor:
                          "#f2b38c",
                      }}
                    />
                  </div>
                </div>

                {/* RECEIPT BODY */}

                <div
                  style={{
                    padding:
                      "24px 26px 28px",
                    backgroundColor:
                      "#fffdf8",
                    color:
                      "#292524",
                  }}
                >
                  {/* RECEIPT NUMBER + DATE */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: "20px",
                      marginBottom:
                        "24px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "11px",
                          fontWeight:
                            800,
                          color:
                            "#78716c",
                        }}
                      >
                        {t.receiptNo}
                      </p>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          fontSize:
                            "17px",
                          fontWeight:
                            900,
                          color:
                            "#292524",
                        }}
                      >
                        {receiptNumber}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                        flex: 1,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "11px",
                          fontWeight:
                            800,
                          color:
                            "#78716c",
                        }}
                      >
                        {t.date}
                      </p>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          fontSize:
                            "17px",
                          fontWeight:
                            900,
                          color:
                            "#292524",
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
                      padding:
                        "18px",
                      borderTop:
                        "1px solid #e7e5e4",
                      borderBottom:
                        "1px solid #e7e5e4",
                      marginBottom:
                        "22px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "11px",
                        fontWeight:
                          900,
                        color:
                          "#c2410c",
                      }}
                    >
                      {t.receivedFrom}
                    </p>

                    <p
                      style={{
                        margin:
                          "7px 0 0",
                        fontSize:
                          "21px",
                        lineHeight:
                          1.3,
                        fontWeight:
                          900,
                        color:
                          "#292524",
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
                            "13px",
                          color:
                            "#78716c",
                        }}
                      >
                        📱 {mobile}
                      </p>
                    )}
                  </div>

                  {/* PURPOSE */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: "18px",
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
                          fontWeight:
                            900,
                          color:
                            "#78716c",
                        }}
                      >
                        {t.purpose}
                      </p>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          fontSize:
                            "17px",
                          fontWeight:
                            900,
                          color:
                            "#292524",
                        }}
                      >
                        {purpose ||
                          "________________"}
                      </p>
                    </div>

                    <div
                      style={{
                        width:
                          "38px",
                        height:
                          "38px",
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
                        border:
                          "1px solid #fdba74",
                        color:
                          "#ea580c",
                        fontSize:
                          "19px",
                        fontWeight:
                          900,
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
                        "12px",
                      border:
                        "2px solid #f97316",
                      padding:
                        "18px 16px",
                      textAlign:
                        "center",
                      backgroundColor:
                        "#fff7ed",
                    }}
                  >
                    <p
                      style={{
                        position:
                          "relative",
                        margin: 0,
                        fontSize:
                          "12px",
                        fontWeight:
                          800,
                        color:
                          "#9a3412",
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
                          "42px",
                        lineHeight:
                          1.1,
                        fontWeight:
                          900,
                        color:
                          "#9a3412",
                      }}
                    >
                      ₹
                      {amount ||
                        "0"}
                    </p>
                  </div>

                  {/* AMOUNT IN WORDS */}

                  {amount && (
                    <p
                      style={{
                        margin:
                          "10px 0 0",
                        textAlign:
                          "center",
                        fontSize:
                          "13px",
                        color:
                          "#57534e",
                        fontWeight:
                          700,
                      }}
                    >
                      {language ===
                      "Marathi"
                        ? `रु. ${amount} प्राप्त झाले`
                        : language ===
                          "Hindi"
                        ? `₹${amount} प्राप्त हुए`
                        : `₹${amount} received`}
                    </p>
                  )}

                  {/* NOTE */}

                  {note && (
                    <div
                      style={{
                        marginTop:
                          "20px",
                        padding:
                          "13px",
                        border:
                          "1px dashed #d6d3d1",
                        borderRadius:
                          "10px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "10px",
                          fontWeight:
                            900,
                          color:
                            "#78716c",
                        }}
                      >
                        {t.note}
                      </p>

                      <p
                        style={{
                          margin:
                            "4px 0 0",
                          fontSize:
                            "13px",
                          color:
                            "#57534e",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {note}
                      </p>
                    </div>
                  )}

                  {/* THANK YOU */}

                  <div
                    style={{
                      marginTop:
                        "28px",
                      paddingTop:
                        "18px",
                      borderTop:
                        "1px dashed #d6d3d1",
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-end",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "14px",
                          fontWeight:
                            900,
                          color:
                            "#44403c",
                        }}
                      >
                        {t.thankYou}
                      </p>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          fontSize:
                            "11px",
                          color:
                            "#a8a29e",
                        }}
                      >
                        {mandalName}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign:
                          "center",
                        minWidth:
                          "105px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "105px",
                          height:
                            "1px",
                          backgroundColor:
                            "#a8a29e",
                          marginBottom:
                            "7px",
                        }}
                      />

                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "10px",
                          color:
                            "#78716c",
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
                    height: "8px",
                    backgroundColor:
                      "#f97316",
                  }}
                />
              </div>
            </div>

            {/* =========================
                THREE OPTIONS
            ========================== */}

            <div
              style={{
                marginTop: "22px",
                backgroundColor:
                  "#ffffff",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "14px",
                boxShadow:
                  "0 3px 14px rgba(0,0,0,0.05)",
              }}
            >
              {/* SHARE */}

              <button
                type="button"
                onClick={
                  shareReceiptImage
                }
                disabled={generating}
                style={{
                  width: "100%",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "12px",
                  backgroundColor:
                    generating
                      ? "#f3f4f6"
                      : "#ffffff",
                  color: "#292524",
                  padding: "15px",
                  fontSize: "17px",
                  fontWeight: 900,
                  cursor: generating
                    ? "not-allowed"
                    : "pointer",
                  marginBottom:
                    "10px",
                }}
              >
                {generating
                  ? `⏳ ${t.sharing}`
                  : `📤 ${t.share}`}
              </button>

              {/* SAVE + DONE */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    saveReceiptImage
                  }
                  disabled={generating}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "12px",
                    backgroundColor:
                      generating
                        ? "#f3f4f6"
                        : "#ffffff",
                    color: "#292524",
                    padding: "15px 10px",
                    fontSize: "16px",
                    fontWeight: 900,
                    cursor: generating
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {generating
                    ? "⏳"
                    : `⬇️ ${t.save}`}
                </button>

                <button
                  type="button"
                  onClick={handleDone}
                  disabled={generating}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "12px",
                    backgroundColor:
                      generating
                        ? "#f3f4f6"
                        : "#ffffff",
                    color: "#292524",
                    padding: "15px 10px",
                    fontSize: "16px",
                    fontWeight: 900,
                    cursor: generating
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  ✓ {t.done}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}