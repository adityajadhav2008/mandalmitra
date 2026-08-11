"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  useLanguage,
} from "../language-provider";

type EventItem = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
};

const translations = {
  English: {
    back: "← Back to Dashboard",
    events: "Events",
    subtitle: "Manage Mandal events and programs.",
    addEvent: "Add Event",
    eventName: "Event name",
    location: "Location",
    eventDescription: "Event description",
    add: "+ Add Event",
    upcoming: "Upcoming Events",
    eventCount: "Events",
    noEvents: "No events added yet.",
    delete: "Delete",
    deleteConfirm:
      "Are you sure you want to delete this event?",
    loading: "Loading Events...",
    validation:
      "Please enter event name, location and date.",
    loadFailed: "Events load failed.",
    saveFailed: "Event save failed.",
    deleteFailed: "Event delete failed.",
    todayTitle: "📅 Event Today!",
    tomorrowTitle: "🔔 Event Tomorrow",
    todayBody: "is today at",
    tomorrowBody: "is tomorrow at",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    events: "कार्यक्रम",
    subtitle: "मंडळाचे कार्यक्रम आणि उपक्रम व्यवस्थापित करा.",
    addEvent: "कार्यक्रम जोडा",
    eventName: "कार्यक्रमाचे नाव",
    location: "ठिकाण",
    eventDescription: "कार्यक्रमाचे वर्णन",
    add: "+ कार्यक्रम जोडा",
    upcoming: "आगामी कार्यक्रम",
    eventCount: "कार्यक्रम",
    noEvents: "अजून कोणताही कार्यक्रम जोडलेला नाही.",
    delete: "हटवा",
    deleteConfirm:
      "तुम्हाला हा कार्यक्रम हटवायचा आहे का?",
    loading: "कार्यक्रम लोड होत आहेत...",
    validation:
      "कृपया कार्यक्रमाचे नाव, ठिकाण आणि तारीख भरा.",
    loadFailed: "कार्यक्रम लोड करण्यात अडचण आली.",
    saveFailed: "कार्यक्रम सेव्ह करण्यात अडचण आली.",
    deleteFailed: "कार्यक्रम हटवण्यात अडचण आली.",
    todayTitle: "📅 आज कार्यक्रम आहे!",
    tomorrowTitle: "🔔 उद्याचा कार्यक्रम",
    todayBody: "आज",
    tomorrowBody: "उद्या",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएं",
    events: "कार्यक्रम",
    subtitle: "मंडल के कार्यक्रम और गतिविधियां प्रबंधित करें।",
    addEvent: "कार्यक्रम जोड़ें",
    eventName: "कार्यक्रम का नाम",
    location: "स्थान",
    eventDescription: "कार्यक्रम का विवरण",
    add: "+ कार्यक्रम जोड़ें",
    upcoming: "आगामी कार्यक्रम",
    eventCount: "कार्यक्रम",
    noEvents: "अभी तक कोई कार्यक्रम नहीं जोड़ा गया है।",
    delete: "हटाएं",
    deleteConfirm:
      "क्या आप इस कार्यक्रम को हटाना चाहते हैं?",
    loading: "कार्यक्रम लोड हो रहे हैं...",
    validation:
      "कृपया कार्यक्रम का नाम, स्थान और तारीख भरें।",
    loadFailed: "कार्यक्रम लोड करने में समस्या हुई।",
    saveFailed: "कार्यक्रम सेव करने में समस्या हुई।",
    deleteFailed: "कार्यक्रम हटाने में समस्या हुई।",
    todayTitle: "📅 आज कार्यक्रम है!",
    tomorrowTitle: "🔔 कल का कार्यक्रम",
    todayBody: "आज",
    tomorrowBody: "कल",
  },
};

export default function EventsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadEvents();
  }, [language]);

  function checkEventReminders(
    eventList: EventItem[]
  ) {
    if (typeof window === "undefined") {
      return;
    }

    const notificationsEnabled =
      localStorage.getItem(
        "mandalNotifications"
      ) === "true";

    if (!notificationsEnabled) {
      return;
    }

    if (
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    eventList.forEach((event) => {
      if (!event.date) {
        return;
      }

      const eventDate = new Date(
        `${event.date}T00:00:00`
      );

      eventDate.setHours(0, 0, 0, 0);

      const difference =
        eventDate.getTime() -
        today.getTime();

      const daysLeft = Math.round(
        difference /
          (1000 * 60 * 60 * 24)
      );

      if (
        daysLeft < 0 ||
        daysLeft > 1
      ) {
        return;
      }

      const reminderKey =
        `mandalEventReminder-${event.id}-${event.date}`;

      if (
        localStorage.getItem(
          reminderKey
        )
      ) {
        return;
      }

      let notificationTitle = "";
      let notificationBody = "";

      if (daysLeft === 0) {
        notificationTitle =
          t.todayTitle;

        if (language === "English") {
          notificationBody =
            `${event.title} is today at ${event.location}.`;
        } else if (language === "Marathi") {
          notificationBody =
            `${event.title} आज ${event.location} येथे आहे.`;
        } else {
          notificationBody =
            `${event.title} आज ${event.location} में है।`;
        }
      } else {
        notificationTitle =
          t.tomorrowTitle;

        if (language === "English") {
          notificationBody =
            `${event.title} is tomorrow at ${event.location}.`;
        } else if (language === "Marathi") {
          notificationBody =
            `${event.title} उद्या ${event.location} येथे आहे.`;
        } else {
          notificationBody =
            `${event.title} कल ${event.location} में है।`;
        }
      }

      new Notification(
        notificationTitle,
        {
          body: notificationBody,
        }
      );

      localStorage.setItem(
        reminderKey,
        "true"
      );
    });
  }

  async function loadEvents() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } =
      await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", {
          ascending: true,
        });

    if (error) {
      console.error(
        "EVENT LOAD ERROR:",
        error
      );

      alert(
        `${t.loadFailed}\n\nCode: ${error.code}\nMessage: ${error.message}\nDetails: ${
          error.details || "None"
        }`
      );

      setEvents([]);
      setLoading(false);
      return;
    }

    const fixedData: EventItem[] =
      (data || []).map((item) => ({
        id: String(item.id),
        title: item.title || "",
        location: item.location || "",
        date: item.date || "",
        description:
          item.description || "",
      }));

    setEvents(fixedData);

    checkEventReminders(fixedData);

    setLoading(false);
  }

  async function addEvent(
    e: FormEvent
  ) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanLocation =
      location.trim();
    const cleanDescription =
      description.trim();

    if (
      !cleanTitle ||
      !cleanLocation ||
      !date
    ) {
      alert(t.validation);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } =
      await supabase
        .from("events")
        .insert({
          user_id: user.id,
          title: cleanTitle,
          location: cleanLocation,
          date: date,
          description:
            cleanDescription,
        });

    if (error) {
      console.error(
        "EVENT INSERT ERROR:",
        error
      );

      alert(
        `${t.saveFailed}\n\nCode: ${error.code}\nMessage: ${error.message}\nDetails: ${
          error.details || "None"
        }`
      );

      return;
    }

    setTitle("");
    setLocation("");
    setDate("");
    setDescription("");

    await loadEvents();
  }

  async function deleteEvent(
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

    const { error } =
      await supabase
        .from("events")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
      console.error(
        "EVENT DELETE ERROR:",
        error
      );

      alert(
        `${t.deleteFailed}\n\nCode: ${error.code}\nMessage: ${error.message}\nDetails: ${
          error.details || "None"
        }`
      );

      return;
    }

    await loadEvents();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-500">
            {t.loading}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          className="mb-6 cursor-pointer font-semibold text-orange-500"
        >
          {t.back}
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {t.events}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            {t.addEvent}
          </h2>

          <form
            onSubmit={addEvent}
            className="mt-5 space-y-4"
          >

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder={t.eventName}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder={t.location}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder={
                t.eventDescription
              }
              rows={4}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {t.add}
            </button>

          </form>

        </div>

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              {t.upcoming}
            </h2>

            <span className="font-semibold text-orange-500">
              {events.length}{" "}
              {t.eventCount}
            </span>

          </div>

          {events.length === 0 ? (

            <p className="py-12 text-center text-gray-500">
              {t.noEvents}
            </p>

          ) : (

            <div className="mt-5 space-y-4">

              {events.map((event) => (

                <div
                  key={event.id}
                  className="rounded-2xl border p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        📍 {event.location}
                      </p>

                      <p className="mt-1 text-sm text-orange-500">
                        📅 {event.date}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteEvent(
                          event.id
                        )
                      }
                      className="cursor-pointer rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-500"
                    >
                      {t.delete}
                    </button>

                  </div>

                  {event.description && (
                    <p className="mt-4 text-gray-600">
                      {event.description}
                    </p>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}