"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../language-provider";

type DocumentPhoto = {
  id: string;
  url: string;
  name: string;
};

const translations = {
  English: {
    title: "Documents",
    subtitle: "Store important Mandal photos and documents.",
    back: "← Back to Settings",
    addPhoto: "Add Photo",
    adding: "Adding...",
    maxPhotos: "Maximum 10 photos allowed.",
    photos: "photos",
    noPhotos: "No documents added yet.",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this photo?",
    uploadError: "Unable to upload photo. Please try again.",
    deleteError: "Unable to delete photo. Please try again.",
    invalidFile: "Please select an image file.",
    fileTooLarge: "Photo size must be less than 5 MB.",
  },

  Marathi: {
    title: "कागदपत्रे",
    subtitle: "मंडळाचे महत्त्वाचे फोटो आणि कागदपत्रे जतन करा.",
    back: "← सेटिंग्जवर जा",
    addPhoto: "फोटो जोडा",
    adding: "फोटो जोडला जात आहे...",
    maxPhotos: "जास्तीत जास्त 10 फोटो जोडता येतील.",
    photos: "फोटो",
    noPhotos: "अजून कोणतेही कागदपत्र जोडलेले नाही.",
    delete: "हटवा",
    deleteConfirm: "तुम्हाला हा फोटो नक्की हटवायचा आहे का?",
    uploadError: "फोटो अपलोड करता आला नाही. कृपया पुन्हा प्रयत्न करा.",
    deleteError: "फोटो हटवता आला नाही. कृपया पुन्हा प्रयत्न करा.",
    invalidFile: "कृपया image file निवडा.",
    fileTooLarge: "फोटोचा आकार 5 MB पेक्षा कमी असावा.",
  },

  Hindi: {
    title: "दस्तावेज़",
    subtitle: "मंडल के महत्वपूर्ण फोटो और दस्तावेज़ सुरक्षित रखें।",
    back: "← सेटिंग्स पर जाएं",
    addPhoto: "फोटो जोड़ें",
    adding: "फोटो जोड़ा जा रहा है...",
    maxPhotos: "अधिकतम 10 फोटो जोड़े जा सकते हैं।",
    photos: "फोटो",
    noPhotos: "अभी तक कोई दस्तावेज़ नहीं जोड़ा गया है।",
    delete: "हटाएं",
    deleteConfirm: "क्या आप इस फोटो को हटाना चाहते हैं?",
    uploadError: "फोटो अपलोड नहीं हो सका। कृपया फिर से प्रयास करें।",
    deleteError: "फोटो हटाया नहीं जा सका। कृपया फिर से प्रयास करें।",
    invalidFile: "कृपया image file चुनें।",
    fileTooLarge: "फोटो का आकार 5 MB से कम होना चाहिए।",
  },
};

export default function DocumentsPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = translations[language];

  const [photos, setPhotos] = useState<DocumentPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const savedDocuments =
          localStorage.getItem(
            `mandalDocuments_${user.id}`
          );

        if (savedDocuments) {
          try {
            const parsed = JSON.parse(savedDocuments);

            if (Array.isArray(parsed)) {
              setPhotos(parsed);
            }
          } catch (error) {
            console.error(
              "DOCUMENTS LOAD ERROR:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "DOCUMENTS USER ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [router]);

  async function addPhoto(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");

    if (photos.length >= 10) {
      setError(t.maxPhotos);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(t.invalidFile);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t.fileTooLarge);
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      /*
       * Store the selected photo locally.
       * This keeps the Documents feature working
       * without requiring a new Supabase table.
       */

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          setError(t.uploadError);
          setUploading(false);
          return;
        }

        const newPhoto: DocumentPhoto = {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
          url: result,
          name: file.name,
        };

        const updatedPhotos = [
          ...photos,
          newPhoto,
        ];

        try {
          localStorage.setItem(
            `mandalDocuments_${user.id}`,
            JSON.stringify(updatedPhotos)
          );

          setPhotos(updatedPhotos);
        } catch (storageError) {
          console.error(
            "DOCUMENT STORAGE ERROR:",
            storageError
          );

          setError(
            "Photo could not be saved. The browser storage may be full."
          );
        }

        setUploading(false);
      };

      reader.onerror = () => {
        setError(t.uploadError);
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(
        "ADD PHOTO ERROR:",
        error
      );

      setError(t.uploadError);
      setUploading(false);
    }
  }

  async function deletePhoto(
    photoId: string
  ) {
    const confirmed = window.confirm(
      t.deleteConfirm
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const updatedPhotos = photos.filter(
        (photo) => photo.id !== photoId
      );

      localStorage.setItem(
        `mandalDocuments_${user.id}`,
        JSON.stringify(updatedPhotos)
      );

      setPhotos(updatedPhotos);
    } catch (error) {
      console.error(
        "DELETE PHOTO ERROR:",
        error
      );

      setError(t.deleteError);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push("/settings")
          }
          className="mb-6 cursor-pointer font-semibold text-orange-500"
        >
          {t.back}
        </button>

        {/* HEADER */}

        <h1 className="text-3xl font-bold text-gray-900">
          📄 {t.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {t.subtitle}
        </p>

        {/* DOCUMENT CARD */}

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {photos.length}/10 {t.photos}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {t.maxPhotos}
              </p>
            </div>

            <label
              className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition ${
                photos.length >= 10 ||
                uploading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {uploading
                ? t.adding
                : `📷 ${t.addPhoto}`}

              <input
                type="file"
                accept="image/*"
                onChange={addPhoto}
                disabled={
                  photos.length >= 10 ||
                  uploading
                }
                className="hidden"
              />
            </label>

          </div>

          {/* ERROR */}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {/* PHOTOS */}

          {loading ? (
            <p className="mt-8 text-center text-sm text-gray-400">
              Loading...
            </p>
          ) : photos.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
              <div className="text-5xl">
                📄
              </div>

              <p className="mt-3 text-gray-500">
                {t.noPhotos}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border bg-gray-50"
                >

                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-3">

                    <p
                      className="truncate text-xs text-gray-500"
                      title={photo.name}
                    >
                      {photo.name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        deletePhoto(photo.id)
                      }
                      className="mt-2 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      🗑️ {t.delete}
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