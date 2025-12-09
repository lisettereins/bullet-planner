'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import GalleryCategories from "@/components/ui/gallery/GalleryCategories";

const supabase = createClient();

interface Photo {
  id: string;
  user_id: string;
  url: string;
  title: string;
  category?: string;
  uploaded_at: string;
}

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageTitle, setImageTitle] = useState<string>("");
  const [imageCategory, setImageCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) {
          setError("Failed to get session. Please log in.");
          return console.error("Auth session error:", error);
        }

        const uid = sessionData?.session?.user?.id ?? null;
        if (!mounted) return;

        setUserId(uid);
        if (uid) await fetchPhotos(uid);
      } catch (err) {
        setError("Initialization failed. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) fetchPhotos(uid);
      else setPhotos([]);
    });

    return () => {
      mounted = false;
      listener.subscription?.unsubscribe?.();
    };
  }, []);

  const fetchPhotos = async (uid: string) => {
    setError(null);
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("user_id", uid)
      .order("uploaded_at", { ascending: false });

    if (error) {
      setError("Failed to load photos. Please refresh.");
      console.error("Fetch photos error:", error);
    } else {
      setPhotos(data || []);
      const dynamicCategories = Array.from(
        new Set(["All", ...(data || []).map(p => p.category).filter(Boolean)])
      );
      setCategories(dynamicCategories);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("You must be logged in to upload photos.");
      return;
    }

    let photoUrl = imageUrl;

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
        console.error("Upload error:", uploadError);
        return;
      }

      const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
      if (!data?.publicUrl) {
        setError("Failed to get public URL for uploaded file.");
        return;
      }

      photoUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from("photos")
      .insert({
        user_id: userId,
        url: photoUrl,
        title: imageTitle || "Untitled",
        category: imageCategory || null
      })
      .select()
      .single();

    if (error) {
      setError("Failed to save photo: " + error.message);
      console.error("Insert photo error:", error);
    } else {
      setPhotos([data as Photo, ...photos]);
      if (data?.category && !categories.includes(data.category)) {
        setCategories([...categories, data.category]);
      }
      resetForm();
    }
  };

  const handleDeletePhoto = async (id: string) => {
    setError(null);
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) {
      setError("Failed to delete photo: " + error.message);
      console.error("Delete photo error:", error);
    } else {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (!file) return setPreviewUrl("");
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setShowAddPhoto(false);
    setImageUrl("");
    setImageTitle("");
    setImageCategory("");
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadMethod("url");
    setError(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">You must be logged in to see your photo gallery.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white rounded-sm">Refresh</button>
      </div>
    );
  }

  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter(p => p.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-8 py-12">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-8 h-8" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Photo Gallery</h1>
              </div>
              <p className="text-gray-600">
                Upload and organize your photos. {photos.length} photo{photos.length !== 1 ? "s" : ""} in your gallery.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-sm">
                {error}
              </div>
            )}

            {/* Categories */}
            <GalleryCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Add Photo Form */}
            {!showAddPhoto && (
              <button
                onClick={() => setShowAddPhoto(true)}
                className="mb-8 w-full sm:w-auto flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={2} /> Add Photo
              </button>
            )}

            {showAddPhoto && (
              <form onSubmit={handleAddPhoto} className="mb-8 p-6 border-2 border-black rounded-sm bg-gray-50">
                {/* Form fields remain unchanged */}
                <div className="mb-6 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="url"
                      checked={uploadMethod === "url"}
                      onChange={() => { setUploadMethod("url"); setPreviewUrl(""); setSelectedFile(null); }}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="font-medium">From URL</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="file"
                      checked={uploadMethod === "file"}
                      onChange={() => { setUploadMethod("file"); setImageUrl(""); }}
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
                      onChange={(e) => setImageUrl(e.target.value)}
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
                    {previewUrl && (
                      <div className="mt-4 rounded-sm overflow-hidden border border-black/10">
                        <img src={previewUrl} alt="Preview" className="max-h-64 w-full object-cover" />
                      </div>
                    )}
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

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors">Add Photo</button>
                  <button type="button" onClick={resetForm} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {/* Photo Grid */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map(photo => (
                  <div key={photo.id} className="border border-black/10 rounded-sm overflow-hidden hover:border-black transition-colors group cursor-pointer">
                    <div className="relative overflow-hidden bg-gray-100 h-64" onClick={() => setEnlargedPhoto(photo)}>
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E"}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{photo.title}</h3>
                      {photo.category && <p className="text-xs text-gray-500 mb-2">Category: {photo.category}</p>}
                      <p className="text-xs text-gray-500 mb-4">{new Date(photo.uploaded_at).toLocaleDateString()}</p>
                      <button onClick={() => handleDeletePhoto(photo.id)} className="w-full p-2 hover:bg-red-100 rounded-sm transition-colors text-red-600 font-medium text-sm flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" strokeWidth={2} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 mb-4">No photos yet. Start building your gallery!</p>
                <button onClick={() => setShowAddPhoto(true)} className="text-black font-semibold hover:underline">Add your first photo</button>
              </div>
            )}

            {/* Enlarged Photo Modal */}
            {enlargedPhoto && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setEnlargedPhoto(null)}>
                <img src={enlargedPhoto.url} alt={enlargedPhoto.title} className="max-h-full max-w-full object-contain" />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
