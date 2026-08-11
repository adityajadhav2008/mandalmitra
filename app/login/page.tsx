"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const { setLanguage } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const {
      data: loginData,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (loginError) {
      setError(
        "Email or password is incorrect."
      );
      setLoading(false);
      return;
    }

    if (!loginData.user || !loginData.session) {
      setError(
        "Login failed. Please try again."
      );
      setLoading(false);
      return;
    }

    // Make sure the session is stored
    await supabase.auth.setSession({
      access_token: loginData.session.access_token,
      refresh_token: loginData.session.refresh_token,
    });

    const {
      data: mandalData,
      error: mandalError,
    } = await supabase
      .from("mandals")
      .select("language")
      .eq("user_id", loginData.user.id)
      .maybeSingle();

    if (mandalError) {
      console.error(
        "LANGUAGE LOAD ERROR:",
        mandalError
      );
    }

    if (
      mandalData?.language === "English" ||
      mandalData?.language === "Marathi" ||
      mandalData?.language === "Hindi"
    ) {
      setLanguage(mandalData.language);
    } else {
      setLanguage("English");
    }

    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl">
            🏛️
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            MandalSetu
          </h1>

          <p className="mt-2 text-gray-500">
            Login to your Mandal
          </p>
        </div>

        {/* LOGIN CARD */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Login
          </h2>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* CREATE ACCOUNT */}

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have a Mandal?
          </p>

          <Link
            href="/create-mandal"
            className="mt-2 block text-center font-semibold text-orange-500"
          >
            Create Mandal
          </Link>

        </div>

        {/* BACK HOME */}

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-gray-500"
        >
          ← Back to Home
        </Link>

      </div>
    </main>
  );
}