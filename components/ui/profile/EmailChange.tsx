"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EmailChangeProps {
  currentEmail: string | null;
  setUserEmail: (email: string) => void;
  onSuccessMessage: (msg: string) => void;
  onErrorMessage: (msg: string) => void;
}

export default function EmailChange({
  currentEmail,
  setUserEmail,
  onSuccessMessage,
  onErrorMessage
}: EmailChangeProps) {
  
  const supabase = createClient();
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(currentEmail || "");
  const [isLoading, setIsLoading] = useState(false);

  // Sync when parent updates email
  useEffect(() => {
    setNewEmail(currentEmail || "");
  }, [currentEmail]);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    onSuccessMessage("");
    onErrorMessage("");

    if (!newEmail.trim()) {
      onErrorMessage("Email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      onErrorMessage("Please enter a valid email");
      return;
    }

    if (newEmail === currentEmail) {
      onErrorMessage("New email must be different from current email");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      setUserEmail(newEmail);
      onSuccessMessage("Email updated successfully!");
      setIsChangingEmail(false);

    } catch (err: any) {
      onErrorMessage(err.message || "Error updating email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsChangingEmail(false);
    setNewEmail(currentEmail || "");
    onErrorMessage("");
    onSuccessMessage("");
  };

  return (
    <div className="border border-black/10 rounded-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Email Address</h2>
      </div>

      {!isChangingEmail ? (
        <div>
          <p className="text-gray-600 mb-4">{currentEmail}</p>
          <button
            onClick={() => setIsChangingEmail(true)}
            className="bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors text-sm"
          >
            Change Email
          </button>
        </div>
      ) : (
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="newemail@example.com"
            className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Email"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
