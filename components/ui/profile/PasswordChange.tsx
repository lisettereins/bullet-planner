'use client';

import { useState } from "react";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PasswordChangeProps {
  setMessage: (msg: string) => void;
  setError: (err: string) => void;
}

export default function PasswordChange({ setMessage, setError }: PasswordChangeProps) {
  const supabase = createClient();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword.trim()) return setError("Please enter your current password");
    if (!newPassword.trim()) return setError("Please enter a new password");
    if (newPassword.length < 6) return setError("New password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("New passwords do not match");

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

  return (
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
  );
}
