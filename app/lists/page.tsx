'use client';

import { useState, useEffect } from "react";
import { Trash2, ListChecks, Plus } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Item {
  id: number;
  title: string;
  done: boolean;
  list_id: number;
  created_at?: string;
}

interface TodoList {
  id: number;
  name: string;
  items: Item[];
  created_at?: string;
}

export default function ListsPage() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newItemsByList, setNewItemsByList] = useState<Record<number, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Lae kasutaja ja listid
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      if (!mounted) return;
      setUserId(session.user.id);
      await fetchLists(session.user.id);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchLists(session.user.id);
      } else {
        setUserId(null);
        setLists([]);
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

  // 2️⃣ Lae listid ja itemid eraldi
  const fetchLists = async (uid: string) => {
    if (!uid) return;
    setLoading(true);

    try {
      // Lae listid
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: true });

      if (listsError) {
        console.error("Lists fetch error:", listsError);
        setLoading(false);
        return;
      }

      // Lae itemid
      const listIds = (listsData || []).map(l => l.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .in('list_id', listIds)
        .order('created_at', { ascending: true });

      if (itemsError) {
        console.error("Items fetch error:", itemsError);
        setLoading(false);
        return;
      }

      // Lisa itemid listidele
      const listsWithItems = (listsData || []).map(l => ({
        ...l,
        items: (itemsData || []).filter(i => i.list_id === l.id),
      }));

      setLists(listsWithItems);
    } catch (err) {
      console.error("fetchLists unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Listide CRUD
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert({ name: newListName, user_id: userId })
        .select('*')
        .single();

      if (error) {
        console.error("Insert list error:", error);
        return;
      }

      setLists(prev => [...prev, { ...(data as any), items: [] }]);
      setNewListName('');
      setShowNewList(false);
    } catch (err) {
      console.error("handleCreateList unexpected error:", err);
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      await supabase.from('items').delete().eq('list_id', listId);
      await supabase.from('lists').delete().eq('id', listId);
      setLists(lists.filter(l => l.id !== listId));
    } catch (err) {
      console.error("handleDeleteList error:", err);
    }
  };

  const handleAddItem = async (listId: number, e: React.FormEvent) => {
    e.preventDefault();
    const title = newItemsByList[listId];
    if (!title?.trim()) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .insert({ list_id: listId, title })
        .select('*')
        .single();

      if (error) console.error("Insert item error:", error);
      else setLists(lists.map(l => l.id === listId ? { ...l, items: [...l.items, data as Item] } : l));

      setNewItemsByList({ ...newItemsByList, [listId]: "" });
    } catch (err) {
      console.error("handleAddItem unexpected error:", err);
    }
  };

  const handleDeleteItem = async (listId: number, itemId: number) => {
    try {
      await supabase.from('items').delete().eq('id', itemId);
      setLists(lists.map(l => l.id === listId ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l));
    } catch (err) {
      console.error("handleDeleteItem error:", err);
    }
  };

  const handleToggleDone = async (listId: number, item: Item) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({ done: !item.done })
        .eq('id', item.id)
        .select('*')
        .single();

      if (error) console.error("Toggle item error:", error);
      else setLists(lists.map(l => l.id === listId ? { ...l, items: l.items.map(i => i.id === item.id ? (data as Item) : i) } : l));
    } catch (err) {
      console.error("handleToggleDone unexpected error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <NewHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="w-8 h-8" strokeWidth={2} />
              <h1 className="text-4xl font-bold">Lists</h1>
            </div>

            {!showNewList && (
              <button
                onClick={() => setShowNewList(true)}
                className="mb-8 w-full sm:w-auto flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={2} /> New List
              </button>
            )}

            {showNewList && (
              <form onSubmit={handleCreateList} className="mb-8 p-6 border-2 border-black rounded-sm bg-gray-50">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  className="w-full mb-4 px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black text-lg font-semibold"
                  autoFocus
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-black text-white py-2 rounded-sm font-semibold hover:bg-gray-900 transition-colors">
                    Create List
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewList(false); setNewListName(""); }}
                    className="flex-1 bg-white border-2 border-black text-black py-2 rounded-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p>Loading…</p>
            ) : lists.length > 0 ? (
              lists.map(list => (
                <div key={list.id} className="border border-black/10 rounded-sm p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">{list.name}</h2>
                    <button onClick={() => handleDeleteList(list.id)} className="p-2 hover:bg-red-100 rounded-sm text-red-600">
                      <Trash2 className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>

                  <form onSubmit={(e) => handleAddItem(list.id, e)} className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={newItemsByList[list.id] || ""}
                      onChange={e => setNewItemsByList({ ...newItemsByList, [list.id]: e.target.value })}
                      className="flex-1 px-4 py-2 border border-black/20 rounded-sm focus:outline-none focus:border-black"
                      placeholder="Add item..."
                    />
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-900 flex items-center gap-2">
                      <Plus className="w-4 h-4" strokeWidth={2} /> Add
                    </button>
                  </form>

                  {list.items.length > 0 ? (
                    <ul className="space-y-2">
                      {list.items.map(item => (
                        <li key={item.id} className="flex items-center justify-between p-3 border border-black/10 rounded-sm hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              className="w-5 h-5 cursor-pointer accent-black"
                              checked={item.done}
                              onChange={() => handleToggleDone(list.id, item)}
                            />
                            <span>{item.title}</span>
                          </div>
                          <button onClick={() => handleDeleteItem(list.id, item.id)} className="p-1 hover:bg-red-100 rounded-sm text-red-600">
                            <Trash2 className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items yet.</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 mb-4">No lists yet.</p>
                <button onClick={() => setShowNewList(true)} className="text-black font-semibold hover:underline">Create your first list</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
