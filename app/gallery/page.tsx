'use client';

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import GalleryCategories from "@/components/ui/gallery/GalleryCategories";
import PhotoCard from "@/components/ui/gallery/PhotoCard";
import PhotoUploadForm from "@/components/ui/gallery/PhotoUploadForm";
import EnlargedPhotoModal from "@/components/ui/gallery/EnlargedPhotoModal";
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

export default function PhotoGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<Photo | null>(null);

  // --------------------------
  // LOAD USER + PHOTOS
  // --------------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) {
          setError("Failed to get session.");
          return console.error(error);
        }

        const uid = sessionData?.session?.user?.id ?? null;
        if (!mounted) return;

        setUserId(uid);
        if (uid) await fetchPhotos(uid);
      } catch (err) {
        setError("Initialization failed.");
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

  // --------------------------
  // FETCH PHOTOS
  // --------------------------
  const fetchPhotos = async (uid: string) => {
    setError(null);
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("user_id", uid)
      .order("uploaded_at", { ascending: false });

    if (error) {
      setError("Failed to load photos.");
      console.error(error);
      return;
    }

    setPhotos(data || []);
    const dynamicCategories = Array.from(
      new Set(["All", ...(data || []).map(p => p.category).filter(Boolean)])
    );
    setCategories(dynamicCategories);
  };

  // --------------------------
  // DELETE PHOTO
  // --------------------------
  const handleDeletePhoto = async (id: string) => {
    setError(null);
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) {
      setError("Failed to delete photo: " + error.message);
      console.error(error);
    } else {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  // --------------------------
  // FILTERED PHOTOS
  // --------------------------
  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter(p => p.category === selectedCategory);

  // --------------------------
  // RENDER
  // --------------------------
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">You must be logged in to see your photo gallery.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-8 py-12">

            {/* HEADER */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-8 h-8" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Photo Gallery</h1>
              </div>
              <p className="text-gray-600">
                Upload and organize your photos. {photos.length} photo{photos.length !== 1 ? "s" : ""}.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-sm">
                {error}
              </div>
            )}

            {/* CATEGORIES */}
            <GalleryCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* ADD PHOTO FORM */}
            <div className="mb-8">
              {!showAddPhoto && (
                <button
                  onClick={() => setShowAddPhoto(true)}
                  className="w-full sm:w-auto flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
                >
                  <Plus className="w-5 h-5" strokeWidth={2} /> Add Photo
                </button>
              )}

              {showAddPhoto && userId && (
                <PhotoUploadForm
                  userId={userId}
                  categories={categories}
                  onUpload={(newPhoto) => {
                    setPhotos([newPhoto, ...photos]);
                    if (newPhoto.category && !categories.includes(newPhoto.category)) {
                      setCategories([...categories, newPhoto.category]);
                    }
                    setShowAddPhoto(false);
                  }}
                  onCancel={() => setShowAddPhoto(false)}
                />
              )}
            </div>

            {/* PHOTO GRID */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map(photo => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onDelete={handleDeletePhoto}
                    onClick={() => setEnlargedPhoto(photo)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 mb-4">No photos yet. Start building your gallery!</p>
                <button
                  onClick={() => setShowAddPhoto(true)}
                  className="text-black font-semibold hover:underline"
                >
                  Add your first photo
                </button>
              </div>
            )}

            {/* ENLARGED PHOTO MODAL */}
            {enlargedPhoto && (
              <EnlargedPhotoModal
                photoUrl={enlargedPhoto.url}
                photoTitle={enlargedPhoto.title}
                onClose={() => setEnlargedPhoto(null)}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
