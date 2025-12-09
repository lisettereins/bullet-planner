'use client';

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteAccountProps {
  onDelete: (confirmText: string) => void;
  isLoading: boolean;
  error: string;
  setError: (msg: string) => void;
}

export default function DeleteAccount({ onDelete, isLoading, error, setError }: DeleteAccountProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm account deletion');
      return;
    }
    onDelete(confirmText);
  };

  return (
    <div className="border-2 border-red-200 rounded-sm p-6 bg-red-50">
      <div className="flex items-center gap-3 mb-4">
        <Trash2 className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors text-sm"
        >
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border border-red-200 rounded-sm">
          <input
            type="text"
            placeholder='Type "DELETE"'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-red-500"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || confirmText !== "DELETE"}
              className="flex-1 bg-red-600 text-white py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Permanently Delete Account"}
            </button>
            <button
              type="button"
              onClick={() => { setShowConfirm(false); setConfirmText(""); setError(""); }}
              className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
