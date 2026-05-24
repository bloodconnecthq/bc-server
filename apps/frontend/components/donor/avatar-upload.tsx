"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { uploadProfilePhoto } from "@/lib/api/profileApi";

const PLACEHOLDER_AVATAR = "https://placehold.net/avatar-5.svg";

interface Props {
  currentPhoto: string | null;
  initials: string;
  token: string | null;
  onUploaded: (photoBase64: string) => void;
}

const MAX_SIZE_BYTES = 800 * 1024;

export function AvatarUpload({ currentPhoto, initials, token, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentPhoto) setPreview(currentPhoto);
  }, [currentPhoto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG, WebP).");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("Image trop lourde. Maximum 800 Ko.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      await save(base64);
    };
    reader.readAsDataURL(file);
  };

  const save = async (base64: string) => {
    if (!token) return;
    setIsUploading(true);
    try {
      await uploadProfilePhoto(base64, token);
      onUploaded(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
      setPreview(currentPhoto);
    } finally {
      setIsUploading(false);
    }
  };

  const photoSrc = preview || PLACEHOLDER_AVATAR;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 group hover:opacity-90 transition-opacity"
        title="Changer la photo"
      >
        <Image
          src={photoSrc}
          alt={initials}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized={photoSrc.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">Modifier</span>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
        >
          {isUploading ? "Envoi en cours..." : "Changer la photo"}
        </button>
        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — max 800 Ko</p>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
