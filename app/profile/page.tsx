'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Trash2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import ProfileCard from "@/components/ui/profile/ProfileCard";
import EmailChange from "@/components/ui/profile/EmailChange";

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

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentPassword.trim()) {
      setError("Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage("Password updated successfully!");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Error updating password");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (deleteConfirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion');
      return;
    }

    setIsLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase.auth.admin.deleteUser(user.id);
      }

      setTimeout(() => router.push("/"), 500);
    } catch (err: any) {
      setError(err.message || "Error deleting account");
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
          {message && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-700">{message}</div>}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 flex gap-3"><AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />{error}</div>}

          <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile card */}
            {!editingProfile ? (
              <ProfileCard
                name={profile.name}
                bio={profile.bio}
                avatar={profile.avatar}
                onEdit={() => setEditingProfile(true)}
              />
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 border-2 border-black rounded-sm p-8">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded-sm" />
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Bio" className="w-full border p-2 rounded-sm" />
                <input value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} placeholder="Avatar URL" className="w-full border p-2 rounded-sm" />
                <div className="flex gap-2">
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded-sm">Save</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className="bg-white border-2 border-black px-4 py-2 rounded-sm">Cancel</button>
                </div>
              </form>
            )}

            {/* Email change */}
            <EmailChange
              currentEmail={userEmail}
              setEmail={setUserEmail}
              setMessage={setMessage}
              setError={setError}
            />

            {/* Password section */}
            <div className="border border-black/10 rounded-sm p-6">
              <div className="flex items-center gap-3 mb-4"><Lock className="w-5 h-5" /><h2 className="text-xl font-semibold">Password</h2></div>
              {!isChangingPassword ? (
                <button onClick={() => setIsChangingPassword(true)} className="bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors text-sm">Change Password</button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black" required />
                  <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black" required />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black" required />
                  <div className="flex gap-3">
                    <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Updating..." : "Update Password"}</button>
                    <button type="button" onClick={() => { setIsChangingPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setError(""); }} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Danger zone */}
            <div className="border-2 border-red-200 rounded-sm p-6 bg-red-50">
              <div className="flex items-center gap-3 mb-4"><Trash2 className="w-5 h-5 text-red-600" /><h2 className="text-xl font-semibold text-red-600">Danger Zone</h2></div>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors text-sm">Delete Account</button>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-4 p-4 bg-white border border-red-200 rounded-sm">
                  <input type="text" placeholder='Type "DELETE"' value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())} className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-red-500" required />
                  <div className="flex gap-3">
                    <button type="submit" disabled={isLoading || deleteConfirmText !== "DELETE"} className="flex-1 bg-red-600 text-white py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Deleting..." : "Permanently Delete Account"}</button>
                    <button type="button" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); setError(""); }} className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
