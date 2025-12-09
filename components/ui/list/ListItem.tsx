'use client';

import { Trash2 } from "lucide-react";
import { Item } from "@/types";

interface Props {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
}

export default function ListItem({ item, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between p-3 border border-black/10 rounded-sm hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={item.done}
          onChange={onToggle}
          className="w-5 h-5 cursor-pointer accent-black"
        />
        <span>{item.title}</span>
      </div>
      <button onClick={onDelete} className="p-1 hover:bg-red-100 rounded-sm text-red-600">
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>
    </li>
  );
}
