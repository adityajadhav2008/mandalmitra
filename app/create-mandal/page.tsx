"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Language = "English" | "Marathi" | "Hindi";

export default function CreateMandal() {
  const router = useRouter();
  const supabase = createClient();

  const [mandalName, setMandalName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");

  const [language, setLanguage] =
    useState<Language>("English");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanMandalName = mandalName.trim();
    const cleanLeaderName = leaderName.trim();
    const cleanMobile = mobile.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCity = city.trim();

    if (!cleanMandalName || !cleanLeaderName) {
      setError(
        "Please enter Mandal name and leader name."
      );
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      setError(
        "Please enter a valid 10 digit mobile number."
      );
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      setLoading(false);
      return;
    }

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError(
        "Account could not be created."
      );
      setLoading(false);
      return;
    }

    const { error: mandalError } =
      await supabase
        .from("mandals")
        .insert({
          user_id: data.user.id,
          mandal_name: cleanMandalName,
          leader_name: cleanLeaderName,
          mobile: cleanMobile,
          city: cleanCity,
          state: state,
          language: language,
        });

    if (mandalError) {
      console.error(
        "MANDAL CREATE ERROR:",
        mandalError
      );

      setError(
        mandalError.message
      );

      setLoading(false);
      return;
    }

    localStorage.setItem(
      "mandalLanguage",
      language
    );

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl">
            🏛️
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Mandal
          </h1>

          <p className="mt-2 text-gray-500">
            Register your Mandal on MandalMitra
          </p>

        </div>

        {/* FORM CARD */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleCreate}
            className="space-y-5"
          >

            {/* MANDAL NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mandal Name
              </label>

              <input
                value={mandalName}
                onChange={(e) =>
                  setMandalName(e.target.value)
                }
                placeholder="Example: Shree Ganesh Mandal"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            {/* LEADER */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                President / Leader Name
              </label>

              <input
                value={leaderName}
                onChange={(e) =>
                  setLeaderName(e.target.value)
                }
                placeholder="Enter name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            {/* MOBILE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mobile Number
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value)
                }
                placeholder="10 digit mobile number"
                maxLength={10}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

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

            {/* CITY + STATE */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City / Village
                </label>

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  State
                </label>

                <select
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                >
                  <option value="">
                    Select State
                  </option>

                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Gujarat">
                    Gujarat
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Madhya Pradesh">
                    Madhya Pradesh
                  </option>

                  <option value="Rajasthan">
                    Rajasthan
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

            </div>

            {/* LANGUAGE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Preferred Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value as Language
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              >
                <option value="English">
                  English
                </option>

                <option value="Marathi">
                  मराठी
                </option>

                <option value="Hindi">
                  हिंदी
                </option>
              </select>

              <p className="mt-2 text-xs text-gray-400">
                This language will be used as your default app language.
              </p>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Create Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create password"
                minLength={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                required
              />

            </div>

            {/* CREATE BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Mandal..."
                : "Create Mandal"}
            </button>

          </form>

          {/* BACK HOME */}

          <Link
            href="/"
            className="mt-5 block text-center text-sm text-gray-500"
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}