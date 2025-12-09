'use client';

import { useState, useEffect } from "react";
import { Plus, ListChecks } from "lucide-react";
import NewHeader from "@/components/new-header";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import ListItem from "@/components/ui/list/ListItem";
import NewListForm from "@/components/ui/list/NewListForm";
import TodoList from "@/components/ui/list/TodoList";

const supabase = createClient();

export interface Item {
  id: number;
  title: string;
  done: boolean;
  list_id: number;
  created_at?: string;
}

export interface TodoListType {
  id: number;
  name: string;
  items: Item[];
  created_at?: string;
}

export default function ListsPage() {
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [showNewList, setShowNewList] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lae kasutaja ja listid
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !mounted) return;
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

  //  Lae listid ja itemid
  const fetchLists = async (uid: string) => {
    if (!uid) return;
    setLoading(true);
    try {
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

  //  Listide CRUD funktsioonid
  const handleCreateList = async (name: string) => {
    if (!name.trim() || !userId) return;
    try {
      const { data, error } = await supabase
        .from('lists')
        .insert({ name, user_id: userId })
        .select('*')
        .single();

      if (error) {
        console.error("Insert list error:", error);
        return;
      }

      setLists(prev => [...prev, { ...(data as any), items: [] }]);
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

  const handleAddItem = async (listId: number, title: string) => {
    if (!title?.trim()) return;
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({ list_id: listId, title })
        .select('*')
        .single();

      if (error) console.error("Insert item error:", error);
      else setLists(lists.map(l => l.id === listId ? { ...l, items: [...l.items, data as Item] } : l));
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
              <NewListForm onCreate={handleCreateList} onCancel={() => setShowNewList(false)} />
            )}

            {loading ? (
              <p>Loading…</p>
            ) : lists.length > 0 ? (
              lists.map(list => (
                <TodoList
                  key={list.id}
                  list={list}
                  onDeleteList={handleDeleteList}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleItem={handleToggleDone}
                />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-sm">
                <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 mb-4">No lists yet.</p>
                <button onClick={() => setShowNewList(true)} className="text-black font-semibold hover:underline">
                  Create your first list
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
