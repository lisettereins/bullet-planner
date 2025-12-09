'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, ArrowLeft, BookOpen } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Photo {
  id: string;
  url: string;
  title: string;
  uploaded_at: string;
}

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !mounted) return;
      setUserId(session.user.id);
      await fetchPhotos(session.user.id);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchPhotos(session.user.id);
      } else {
        setUserId(null);
        setPhotos([]);
      }
    });

    return () => {
      mounted = false;
      try {
        (listener as any)?.subscription?.unsubscribe?.();
        (listener as any)?.unsubscribe?.();
      } catch {}
    };
  }, []);

  const fetchPhotos = async (uid: string) => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("user_id", uid)
      .order("uploaded_at", { ascending: false });

    if (error) console.error("Fetch photos error:", error);
    else setPhotos(data || []);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    let photoUrl = imageUrl;

    if (uploadMethod === "file") {
      if (!selectedFile) return alert("Please select a file");

      // Supabase storage upload
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(`${userId}/${fileName}`, selectedFile);

      if (error) return alert("Upload error: " + error.message);

      const { publicUrl } = supabase
        .storage
        .from("photos")
        .getPublicUrl(`${userId}/${fileName}`);

      photoUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("photos")
      .insert({ user_id: userId, url: photoUrl, title: imageTitle || "Untitled" })
      .select()
      .single();

    if (error) console.error("Insert photo error:", error);
    else setPhotos([data as Photo, ...photos]);

    setImageUrl("");
    setImageTitle("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowAddPhoto(false);
  };

  const handleDeletePhoto = async (id: string) => {
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) console.error("Delete photo error:", error);
    else setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setShowAddPhoto(false);
    setImageUrl("");
    setImageTitle("");
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadMethod("url");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-8 py-12">
            {/* Page header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-8 h-8" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Photo Gallery</h1>
              </div>
              <p className="text-gray-600">
                Upload and organize your photos. {photos.length} photo{photos.length !== 1 ? "s" : ""} in your gallery.
              </p>
            </div>

            {/* Add Photo Button */}
            {!showAddPhoto && (
              <button
                onClick={() => setShowAddPhoto(true)}
                className="mb-8 w-full sm:w-auto flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Add Photo
              </button>
            )}

            {/* Add Photo Form */}
            {showAddPhoto && (
              <form onSubmit={handleAddPhoto} className="mb-8 p-6 border-2 border-black rounded-sm bg-gray-50">
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

                {uploadMethod === "url" ? (
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
                ) : (
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
                    {previewUrl && <div className="mt-4 rounded-sm overflow-hidden border border-black/10"><img src={previewUrl} alt="Preview" className="max-h-64 w-full object-cover" /></div>}
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

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors">Add Photo</button>
                  <button type="button" onClick={resetForm} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {/* Photo Gallery Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="border border-black/10 rounded-sm overflow-hidden hover:border-black transition-colors group">
                    <div className="relative overflow-hidden bg-gray-100 h-64">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E"}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{photo.title}</h3>
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
          </div>
        </main>
      </div>
    </div>
  );
}
