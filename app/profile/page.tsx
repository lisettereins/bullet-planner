'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";

import ProfileCard from "@/components/ui/profile/ProfileCard";
import EmailChange from "@/components/ui/profile/EmailChange";
import PasswordChange from "@/components/ui/profile/PasswordChange";
import DeleteAccount from "@/components/ui/profile/DeleteAccount";

interface UserProfile {
  name: string;
  bio: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({ name: "", bio: "", avatar: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserEmail(data.user.email);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileData) {
        setProfile({
          name: profileData.name || "",
          bio: profileData.bio || "",
          avatar: profileData.avatar || ""
        });
        setEditName(profileData.name || "");
        setEditBio(profileData.bio || "");
        setEditAvatar(profileData.avatar || "");
      }
    };
    fetchUser();
  }, [router, supabase]);

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!editName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: (await supabase.auth.getUser()).data.user?.id,
          name: editName,
          bio: editBio,
          avatar: editAvatar
        });
      if (error) throw error;

      setProfile({ name: editName, bio: editBio, avatar: editAvatar });
      setMessage("Profile updated successfully!");
      setEditingProfile(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Card */}
            {!editingProfile ? (
              <ProfileCard
                name={profile.name}
                bio={profile.bio}
                avatar={profile.avatar}
                onEdit={() => setEditingProfile(true)}
              />
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 border-2 border-black rounded-sm p-8">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  className="w-full border p-2 rounded-sm"
                />
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Bio"
                  className="w-full border p-2 rounded-sm"
                />
                <input
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Avatar URL"
                  className="w-full border p-2 rounded-sm"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="bg-white border-2 border-black px-4 py-2 rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Other components */}
            <EmailChange
              currentEmail={userEmail}
              setUserEmail={setUserEmail}
              onSuccessMessage={setMessage}
              onErrorMessage={setError}
            />

            <PasswordChange
              setMessage={setMessage}
              setError={setError}
            />

            <DeleteAccount
              setMessage={setMessage}
              setError={setError}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
