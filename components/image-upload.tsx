"use client";

import { useState, useId } from "react";

export default function ImageUpload({
  currentUrl,
  onUploaded,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputId = useId();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setPreview(url);
      onUploaded(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-uploaded
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-700">
        Featured Image
      </span>
      {preview && (
        <div className="mb-2">
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full rounded-md border object-cover"
          />
        </div>
      )}
      <label
        htmlFor={inputId}
        className={`inline-block cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${uploading ? "pointer-events-none opacity-50" : ""}`}
      >
        {uploading ? "Uploading..." : preview ? "Change Image" : "Upload Image"}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="sr-only"
      />
    </div>
  );
}
