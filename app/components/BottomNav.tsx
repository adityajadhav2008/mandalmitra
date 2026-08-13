"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../language-provider";

const translations = {
  English: {
    dashboard: "Dashboard",
    members: "Members",
    events: "Events",
    profile: "Profile",
  },

  Marathi: {
    dashboard: "डॅशबोर्ड",
    members: "सदस्य",
    events: "कार्यक्रम",
    profile: "प्रोफाइल",
  },

  Hindi: {
    dashboard: "डैशबोर्ड",
    members: "सदस्य",
    events: "कार्यक्रम",
    profile: "प्रोफाइल",
  },
};

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const { language } = useLanguage();
  const t = translations[language];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-black/10 bg-[#f7f6f2] px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] lg:hidden">
      <div className="mx-auto flex h-[76px] max-w-xl items-center justify-around">

        {/* DASHBOARD */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={`flex min-w-[65px] flex-col items-center justify-center gap-1 ${
            isActive("/dashboard")
              ? "text-[#252d3a]"
              : "text-[#252d3a]"
          }`}
        >
          <span className="text-2xl leading-none">
            🏠
          </span>

          <span className="text-[11px] font-bold">
            {t.dashboard}
          </span>

          {isActive("/dashboard") && (
            <span className="h-0.5 w-8 rounded-full bg-[#ff6b00]" />
          )}
        </button>

        {/* MEMBERS */}
        <button
          type="button"
          onClick={() => router.push("/members")}
          className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
        >
          <span className="text-2xl leading-none">
            👥
          </span>

          <span className="text-[11px] font-semibold">
            {t.members}
          </span>

          {isActive("/members") && (
            <span className="h-0.5 w-8 rounded-full bg-[#ff6b00]" />
          )}
        </button>

        {/* EVENTS */}
        <button
          type="button"
          onClick={() => router.push("/events")}
          className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
        >
          <span className="text-2xl leading-none">
            📅
          </span>

          <span className="text-[11px] font-semibold">
            {t.events}
          </span>

          {isActive("/events") && (
            <span className="h-0.5 w-8 rounded-full bg-[#ff6b00]" />
          )}
        </button>

        {/* PROFILE */}
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="flex min-w-[65px] flex-col items-center justify-center gap-1 text-[#252d3a]"
        >
          <span className="text-2xl leading-none">
            👤
          </span>

          <span className="text-[11px] font-semibold">
            {t.profile}
          </span>

          {isActive("/settings") && (
            <span className="h-0.5 w-8 rounded-full bg-[#ff6b00]" />
          )}
        </button>

      </div>
    </nav>
  );
}