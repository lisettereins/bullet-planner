'use client';

import React, { useState} from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Photo {
  id: string;
  user_id: string;
  url: string;
  title: string;
  category?: string;
  uploaded_at: string;
}

interface PhotoUploadFormProps {
  userId: string | null;
  categories: string[];
  onUpload: (photo: Photo) => void;
  onCancel: () => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  userId,
  // categories,
  onUpload,
  onCancel,
}) => {
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageCategory, setImageCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (!file) return setPreviewUrl("");
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setUploadMethod("url");
    setImageUrl("");
    setImageTitle("");
    setImageCategory("");
    setSelectedFile(null);
    setPreviewUrl("");
    setError(null);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("You must be logged in to upload photos.");
      return;
    }

    let finalUrl = imageUrl;

    if (uploadMethod === "file") {
      if (!selectedFile) {
        setError("Please select a file.");
        return;
      }

      const fileExt = selectedFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${imageCategory || "Uncategorized"}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, selectedFile);

      if (uploadError) {
        setError("Upload failed: " + uploadError.message);
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
      if (!data?.publicUrl) {
        setError("Failed to get public URL for uploaded file.");
        return;
      }

      finalUrl = data.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("photos")
      .insert({
        user_id: userId,
        url: finalUrl,
        title: imageTitle || "Untitled",
        category: imageCategory || null,
      })
      .select()
      .single();

    if (insertError) {
      setError("Failed to save photo: " + insertError.message);
      console.error(insertError);
      return;
    }

    onUpload(data as Photo);
    resetForm();
  };

  return (
    <form onSubmit={handleAddPhoto} className="mb-8 p-6 border-2 border-black rounded-sm bg-gray-50">
      <div className="mb-6 flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="url"
            checked={uploadMethod === "url"}
            onChange={() => {
              setUploadMethod("url");
              setPreviewUrl(imageUrl); // <- preview uuendub ka URL-i meetodil
              setSelectedFile(null);
            }}
            className="w-4 h-4 accent-black"
          />
          <span className="font-medium">From URL</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="file"
            checked={uploadMethod === "file"}
            onChange={() => {
              setUploadMethod("file");
              setImageUrl("");
              setPreviewUrl("");
            }}
            className="w-4 h-4 accent-black"
          />
          <span className="font-medium">Upload File</span>
        </label>
      </div>

      {uploadMethod === "url" && (
        <div className="mb-4">
          <label htmlFor="image-url" className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            id="image-url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewUrl(e.target.value); // <- nii preview uuendub kohe
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
            required
          />
        </div>
      )}

      {uploadMethod === "file" && (
        <div className="mb-4">
          <label htmlFor="image-file" className="block text-sm font-medium mb-2">Select Image</label>
          <input
            type="file"
            id="image-file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
            required
          />
        </div>
      )}

      {previewUrl && (
        <div className="mb-4 mt-4 rounded-sm overflow-hidden border border-black/10">
          <img src={previewUrl} alt="Preview" className="max-h-64 w-full object-cover" />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="image-title" className="block text-sm font-medium mb-2">Title (optional)</label>
        <input
          type="text"
          id="image-title"
          value={imageTitle}
          onChange={(e) => setImageTitle(e.target.value)}
          placeholder="Photo title"
          className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image-category" className="block text-sm font-medium mb-2">Category (optional)</label>
        <input
          type="text"
          id="image-category"
          value={imageCategory}
          onChange={(e) => setImageCategory(e.target.value)}
          placeholder="e.g. Travel"
          className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
        />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-sm">{error}</div>
      )}

      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors">
          Add Photo
        </button>
        <button type="button" onClick={() => { resetForm(); onCancel(); }} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PhotoUploadForm;
