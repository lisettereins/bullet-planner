'use client';

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ListItem from "./ListItem";
import { Item, TodoList as TodoListType } from "@/app/lists/page";

interface TodoListProps {
  list: TodoListType;
  onDeleteList: (listId: number) => void;
  onAddItem: (listId: number, title: string) => void;
  onDeleteItem: (listId: number, itemId: number) => void;
  onToggleItem: (listId: number, item: Item) => void;
}

export default function TodoList({
  list,
  onDeleteList,
  onAddItem,
  onDeleteItem,
  onToggleItem,
}: TodoListProps) {
  const [expanded, setExpanded] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  return (
    <div className="border border-black/10 rounded-sm p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setExpanded(prev => !prev)}
        >
          {list.name}
        </h2>
        <button
          onClick={() => onDeleteList(list.id)}
          className="p-2 hover:bg-red-100 rounded-sm text-red-600"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {expanded && (
        <>
          {list.items.length > 0 ? (
            <ul className="space-y-2">
              {list.items.map(item => (
                <ListItem
                  key={item.id}
                  item={item}
                  onToggle={() => onToggleItem(list.id, item)}
                  onDelete={() => onDeleteItem(list.id, item.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No items yet.</p>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              onAddItem(list.id, newItemTitle);
              setNewItemTitle("");
            }}
            className="mb-4 flex gap-2"
          >
            <input
              type="text"
              value={newItemTitle}
              onChange={e => setNewItemTitle(e.target.value)}
              className="flex-1 px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
              placeholder="Add item..."
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" strokeWidth={2} /> Add
            </button>
          </form>
        </>
      )}
    </div>
  );
}
