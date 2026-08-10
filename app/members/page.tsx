"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  useLanguage,
  type Language,
} from "../language-provider";

type Member = {
  id: string;
  user_id: string;
  name: string;
  mobile: string;
  address?: string;
};

const translations = {
  English: {
    back: "← Back to Dashboard",
    title: "Members",
    subtitle: "Add and manage Mandal members.",
    editMember: "Edit Member",
    addMember: "Add Member",
    memberName: "Member Name",
    mobileNumber: "Mobile Number",
    address: "Address",
    updateMember: "Update Member",
    addMemberButton: "Add Member",
    cancel: "Cancel",
    membersList: "Members List",
    members: "Members",
    noMembers: "No members added yet.",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading members...",
    enterNameMobile:
      "Please enter member name and mobile number.",
    unableLoad: "Unable to load members.",
    unableUpdate: "Unable to update member.",
    unableAdd: "Unable to add member.",
    unableDelete: "Unable to delete member.",
    deleteConfirm:
      "Are you sure you want to delete this member?",
  },

  Marathi: {
    back: "← डॅशबोर्डवर जा",
    title: "सदस्य",
    subtitle: "मंडळाचे सदस्य जोडा आणि व्यवस्थापित करा.",
    editMember: "सदस्य संपादित करा",
    addMember: "सदस्य जोडा",
    memberName: "सदस्याचे नाव",
    mobileNumber: "मोबाईल नंबर",
    address: "पत्ता",
    updateMember: "सदस्य अपडेट करा",
    addMemberButton: "सदस्य जोडा",
    cancel: "रद्द करा",
    membersList: "सदस्यांची यादी",
    members: "सदस्य",
    noMembers: "अजून कोणतेही सदस्य जोडलेले नाहीत.",
    edit: "संपादित करा",
    delete: "हटवा",
    loading: "सदस्य लोड होत आहेत...",
    enterNameMobile:
      "कृपया सदस्याचे नाव आणि मोबाईल नंबर टाका.",
    unableLoad: "सदस्य लोड करता आले नाहीत.",
    unableUpdate: "सदस्य अपडेट करता आला नाही.",
    unableAdd: "सदस्य जोडता आला नाही.",
    unableDelete: "सदस्य हटवता आला नाही.",
    deleteConfirm:
      "तुम्हाला हा सदस्य नक्की हटवायचा आहे का?",
  },

  Hindi: {
    back: "← डैशबोर्ड पर जाएं",
    title: "सदस्य",
    subtitle: "मंडल के सदस्यों को जोड़ें और प्रबंधित करें।",
    editMember: "सदस्य संपादित करें",
    addMember: "सदस्य जोड़ें",
    memberName: "सदस्य का नाम",
    mobileNumber: "मोबाइल नंबर",
    address: "पता",
    updateMember: "सदस्य अपडेट करें",
    addMemberButton: "सदस्य जोड़ें",
    cancel: "रद्द करें",
    membersList: "सदस्यों की सूची",
    members: "सदस्य",
    noMembers: "अभी तक कोई सदस्य नहीं जोड़ा गया है।",
    edit: "संपादित करें",
    delete: "हटाएं",
    loading: "सदस्य लोड हो रहे हैं...",
    enterNameMobile:
      "कृपया सदस्य का नाम और मोबाइल नंबर दर्ज करें।",
    unableLoad: "सदस्य लोड नहीं हो सके।",
    unableUpdate: "सदस्य अपडेट नहीं हो सका।",
    unableAdd: "सदस्य जोड़ा नहीं जा सका।",
    unableDelete: "सदस्य हटाया नहीं जा सका।",
    deleteConfirm:
      "क्या आप इस सदस्य को हटाना चाहते हैं?",
  },
};

export default function MembersPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [members, setMembers] =
    useState<Member[]>([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadMembers() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading members:",
          error
        );

        alert(t.unableLoad);
        setMembers([]);
      } else {
        setMembers(data || []);
      }

      setLoading(false);
    }

    loadMembers();
  }, [router, language]);

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanMobile = mobile.trim();
    const cleanAddress = address.trim();

    if (!cleanName || !cleanMobile) {
      alert(t.enterNameMobile);
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
      const { data, error } =
        await supabase
          .from("members")
          .update({
            name: cleanName,
            mobile: cleanMobile,
            address: cleanAddress,
          })
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select()
          .single();

      if (error) {
        console.error(
          "Update member error:",
          error
        );

        alert(t.unableUpdate);
        return;
      }

      setMembers((current) =>
        current.map((member) =>
          member.id === editingId
            ? data
            : member
        )
      );

      cancelEdit();
      return;
    }

    const { data, error } =
      await supabase
        .from("members")
        .insert({
          user_id: user.id,
          name: cleanName,
          mobile: cleanMobile,
          address: cleanAddress,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Add member error:",
        error
      );

      alert(t.unableAdd);
      return;
    }

    setMembers((current) => [
      data,
      ...current,
    ]);

    setName("");
    setMobile("");
    setAddress("");
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setName(member.name || "");
    setMobile(member.mobile || "");
    setAddress(member.address || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setMobile("");
    setAddress("");
  }

  async function deleteMember(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const confirmed = window.confirm(
      t.deleteConfirm
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Delete member error:",
        error
      );

      alert(t.unableDelete);
      return;
    }

    setMembers((current) =>
      current.filter(
        (member) => member.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
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
          {t.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        {/* ADD / EDIT MEMBER */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">
            {editingId !== null
              ? t.editMember
              : t.addMember}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder={t.memberName}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              placeholder={t.mobileNumber}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder={t.address}
              className="rounded-xl border px-4 py-3 outline-none focus:border-orange-500 sm:col-span-2"
            />

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editingId !== null
                ? t.updateMember
                : t.addMemberButton}
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

        {/* MEMBERS LIST */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              {t.membersList}
            </h2>

            <span className="font-semibold text-orange-500">
              {members.length} {t.members}
            </span>

          </div>

          {members.length === 0 ? (

            <p className="mt-6 text-gray-500">
              {t.noMembers}
            </p>

          ) : (

            <div className="mt-5 space-y-3">

              {members.map((member) => (

                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <h3 className="font-bold text-gray-900">
                      {member.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {member.mobile}
                    </p>

                    {member.address && (
                      <p className="text-sm text-gray-500">
                        {member.address}
                      </p>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(member)
                      }
                      className="cursor-pointer rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-600"
                    >
                      {t.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMember(member.id)
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