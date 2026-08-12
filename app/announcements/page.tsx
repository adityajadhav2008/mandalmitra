"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

const translations = {
  English: {
    title: "Announcements",
    subtitle: "Important updates from your Mandal",
    addAnnouncement: "Add Announcement",
    announcementTitle: "Announcement Title",
    message: "Message",
    titlePlaceholder: "Enter announcement title",
    messagePlaceholder: "Write your announcement...",
    add: "Add Announcement",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    save: "Save Changes",
    noAnnouncements: "No announcements yet.",
    loading: "Loading announcements...",
    deleting: "Deleting...",
    adding: "Adding...",
    saving: "Saving...",
    back: "Back to Dashboard",
    required: "Please fill all fields.",
  },

  Marathi: {
    title: "घोषणा",
    subtitle: "तुमच्या मंडळाच्या महत्त्वाच्या घोषणा",
    addAnnouncement: "घोषणा जोडा",
    announcementTitle: "घोषणेचे शीर्षक",
    message: "संदेश",
    titlePlaceholder: "घोषणेचे शीर्षक लिहा",
    messagePlaceholder: "तुमची घोषणा लिहा...",
    add: "घोषणा जोडा",
    cancel: "रद्द करा",
    delete: "डिलीट करा",
    edit: "एडिट",
    save: "बदल जतन करा",
    noAnnouncements: "अजून कोणतीही घोषणा नाही.",
    loading: "घोषणा लोड होत आहेत...",
    deleting: "डिलीट होत आहे...",
    adding: "जोडत आहे...",
    saving: "जतन करत आहे...",
    back: "डॅशबोर्डवर जा",
    required: "कृपया सर्व माहिती भरा.",
  },

  Hindi: {
    title: "घोषणाएं",
    subtitle: "आपके मंडल की महत्वपूर्ण घोषणाएं",
    addAnnouncement: "घोषणा जोड़ें",
    announcementTitle: "घोषणा का शीर्षक",
    message: "संदेश",
    titlePlaceholder: "घोषणा का शीर्षक लिखें",
    messagePlaceholder: "अपनी घोषणा लिखें...",
    add: "घोषणा जोड़ें",
    cancel: "रद्द करें",
    delete: "डिलीट करें",
    edit: "एडिट",
    save: "बदलाव सेव करें",
    noAnnouncements: "अभी कोई घोषणा नहीं है।",
    loading: "घोषणाएं लोड हो रही हैं...",
    deleting: "डिलीट हो रहा है...",
    adding: "जोड़ा जा रहा है...",
    saving: "सेव हो रहा है...",
    back: "डैशबोर्ड पर जाएं",
    required: "कृपया सभी जानकारी भरें।",
  },
};

export default function AnnouncementsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();
  const t = translations[language];

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [adding, setAdding] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");

  // =========================
  // LOAD ANNOUNCEMENTS
  // =========================

  async function loadAnnouncements() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "ANNOUNCEMENTS LOAD ERROR:",
        error
      );

      setAnnouncements([]);
    } else {
      setAnnouncements(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // =========================
  // ADD ANNOUNCEMENT
  // =========================

  async function handleAddAnnouncement(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert(t.required);
      return;
    }

    setAdding(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("announcements")
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        message: message.trim(),
      });

    if (error) {
      console.error(
        "ANNOUNCEMENT ADD ERROR:",
        error
      );

      alert(error.message);
      setAdding(false);
      return;
    }

    setTitle("");
    setMessage("");
    setShowForm(false);

    await loadAnnouncements();

    setAdding(false);
  }

  // =========================
  // START EDIT
  // =========================

  function startEdit(announcement: Announcement) {
    setEditingId(announcement.id);
    setEditTitle(announcement.title);
    setEditMessage(announcement.message);
  }

  // =========================
  // CANCEL EDIT
  // =========================

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditMessage("");
  }

  // =========================
  // SAVE EDIT
  // =========================

  async function handleSaveEdit(
    id: string
  ) {
    if (
      !editTitle.trim() ||
      !editMessage.trim()
    ) {
      alert(t.required);
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("announcements")
      .update({
        title: editTitle.trim(),
        message: editMessage.trim(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "ANNOUNCEMENT UPDATE ERROR:",
        error
      );

      alert(error.message);
      setLoading(false);
      return;
    }

    setAnnouncements((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              title: editTitle.trim(),
              message: editMessage.trim(),
            }
          : item
      )
    );

    cancelEdit();

    setLoading(false);
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "ANNOUNCEMENT DELETE ERROR:",
        error
      );

      alert(error.message);
      setDeletingId(null);
      return;
    }

    setAnnouncements((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setDeletingId(null);
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(date: string) {
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
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[#101725] px-4 py-5 text-white sm:px-6 lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex items-center justify-between gap-4">

          <div>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="mb-3 text-sm font-semibold text-white/50 transition hover:text-white"
            >
              ← {t.back}
            </button>

            <h1 className="text-3xl font-bold">
              {t.title}
            </h1>

            <p className="mt-1 text-sm text-white/50">
              {t.subtitle}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            + {t.addAnnouncement}
          </button>

        </div>

        {/* =========================
            ADD FORM
        ========================= */}

        {showForm && (
          <form
            onSubmit={
              handleAddAnnouncement
            }
            className="mb-6 rounded-3xl border border-white/10 bg-[#1a2334] p-5 shadow-xl sm:p-6"
          >

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                {t.addAnnouncement}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="text-2xl text-white/40 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* TITLE */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                {t.announcementTitle}
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder={
                  t.titlePlaceholder
                }
                className="w-full rounded-2xl border border-white/10 bg-[#101725] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-orange-500"
              />

            </div>

            {/* MESSAGE */}

            <div className="mt-4">

              <label className="mb-2 block text-sm font-semibold text-white/70">
                {t.message}
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder={
                  t.messagePlaceholder
                }
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#101725] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-orange-500"
              />

            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex gap-3">

              <button
                type="submit"
                disabled={adding}
                className="rounded-2xl bg-orange-500 px-5 py-3 font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding
                  ? t.adding
                  : t.add}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              >
                {t.cancel}
              </button>

            </div>

          </form>
        )}

        {/* =========================
            ANNOUNCEMENTS LIST
        ========================= */}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a2334] p-8 text-center text-white/50">
            {t.loading}
          </div>
        ) : announcements.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-[#1a2334] p-10 text-center">

            <div className="text-5xl">
              📣
            </div>

            <p className="mt-4 text-white/50">
              {t.noAnnouncements}
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {announcements.map(
              (announcement) => (

                <article
                  key={announcement.id}
                  className="rounded-3xl border border-white/10 bg-[#1a2334] p-5 shadow-xl sm:p-6"
                >

                  {/* =========================
                      EDIT MODE
                  ========================= */}

                  {editingId ===
                  announcement.id ? (

                    <div>

                      <div className="flex items-center justify-between">

                        <h2 className="text-xl font-bold">
                          {t.edit}
                        </h2>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-2xl text-white/40 hover:text-white"
                        >
                          ×
                        </button>

                      </div>

                      {/* EDIT TITLE */}

                      <div className="mt-5">

                        <label className="mb-2 block text-sm font-semibold text-white/70">
                          {t.announcementTitle}
                        </label>

                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-[#101725] px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                      </div>

                      {/* EDIT MESSAGE */}

                      <div className="mt-4">

                        <label className="mb-2 block text-sm font-semibold text-white/70">
                          {t.message}
                        </label>

                        <textarea
                          value={editMessage}
                          onChange={(e) =>
                            setEditMessage(
                              e.target.value
                            )
                          }
                          rows={5}
                          className="w-full resize-none rounded-2xl border border-white/10 bg-[#101725] px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                      </div>

                      {/* EDIT BUTTONS */}

                      <div className="mt-5 flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleSaveEdit(
                              announcement.id
                            )
                          }
                          className="rounded-2xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-700"
                        >
                          {t.save}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          {t.cancel}
                        </button>

                      </div>

                    </div>

                  ) : (

                    /* =========================
                       NORMAL MODE
                    ========================= */

                    <div className="flex items-start gap-4">

                      {/* ICON */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl shadow-lg">
                        📣
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                          <div>

                            <h2 className="text-lg font-bold sm:text-xl">
                              {announcement.title}
                            </h2>

                            <p className="mt-1 text-xs text-white/40">
                              {formatDate(
                                announcement.created_at
                              )}
                            </p>

                          </div>

                          {/* ACTIONS */}

                          <div className="flex gap-2">

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  announcement
                                )
                              }
                              className="rounded-xl px-3 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
                            >
                              ✏️ {t.edit}
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  announcement.id
                                )
                              }
                              disabled={
                                deletingId ===
                                announcement.id
                              }
                              className="rounded-xl px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {deletingId ===
                              announcement.id
                                ? t.deleting
                                : `🗑️ ${t.delete}`}
                            </button>

                          </div>

                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/65">
                          {announcement.message}
                        </p>

                      </div>

                    </div>

                  )}

                </article>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}