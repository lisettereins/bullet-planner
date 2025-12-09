"use client";

import { User, Edit2 } from "lucide-react";

interface ProfileCardProps {
  name: string;
  bio: string;
  avatar?: string;
  onEdit: () => void;
}

export default function ProfileCard({ name, bio, avatar, onEdit }: ProfileCardProps) {
  return (
    <div className="border-2 border-black rounded-sm p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-sm object-cover border-2 border-black"
              />
            ) : (
              <div className="w-20 h-20 rounded-sm bg-black flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* User info */}
          <div>
            <h1 className="text-2xl font-bold">{name || "Add your name"}</h1>
            {bio && <p className="text-gray-700 mt-3">{bio}</p>}
          </div>
        </div>

        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
