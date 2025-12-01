import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useFamily } from '../../../contexts/FamilyContext';
import type { ShoppingItemWithRelations } from '../types';

export function useShoppingItems() {
  const { family } = useFamily();
  const [items, setItems] = useState<ShoppingItemWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (family) fetchItems();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [family]);

  const fetchItems = useCallback(async () => {
    if (!family) return;

    const { data, error: fetchError } = await supabase
      .from('shopping_items')
      .select('*, category:categories(*), added_by_user:users!added_by(*)')
      .eq('family_id', family.id)
      .order('is_completed', { ascending: true })
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems((data as ShoppingItemWithRelations[]) || []);
      setError(null);
    }
    setLoading(false);
  }, [family]);

  // Fetch items and subscribe to realtime changes
  useEffect(() => {
    if (!family) return;

    fetchItems();

    // Subscribe to realtime changes filtered by family_id
    const channel = supabase
      .channel('shopping_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_items',
          filter: `family_id=eq.${family.id}`,
        },
        () => {
          setIsSyncing(true);
          fetchItems().then(() => setIsSyncing(false));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [family, fetchItems]);

  async function addItem(
    title: string,
    categoryId: string | null,
    quantity?: string
  ) {
    if (!family) {
      setError('No family found');
      return;
    }

    // Get current user from this family (hardcode for now, will add auth later)
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('family_id', family.id)
      .limit(1);
    const userId = users?.[0]?.id;

    const newItem = {
      title,
      category_id: categoryId || undefined,
      quantity: quantity || undefined,
      family_id: family.id,
      added_by: userId || undefined,
      is_needed: true,
      is_completed: false,
    };

    // Optimistic update - add temporary item
    const tempId = `temp-${Date.now()}`;
    const tempItem: ShoppingItemWithRelations = {
      id: tempId,
      ...newItem,
      created_at: new Date().toISOString(),
      category: null,
      added_by_user: users?.[0] || null,
      unit: undefined,
      notes: undefined,
      completed_at: undefined,
      completed_by: undefined,
    };

    setItems((prev) => [tempItem, ...prev]);

    const { error: insertError } = await supabase
      .from('shopping_items')
      .insert(newItem);

    if (insertError) {
      // Revert optimistic update
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      setError(insertError.message);
    }
  }

  async function toggleItem(id: string, isCompleted: boolean) {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              is_completed: !isCompleted,
              completed_at: !isCompleted ? new Date().toISOString() : undefined,
            }
          : item
      )
    );

    const { error: updateError } = await supabase
      .from('shopping_items')
      .update({
        is_completed: !isCompleted,
        completed_at: !isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (updateError) {
      // Revert optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_completed: isCompleted,
                completed_at: isCompleted ? item.completed_at : undefined,
              }
            : item
        )
      );
      setError(updateError.message);
    }
  }

  async function deleteItem(id: string) {
    // Optimistic update
    const deletedItem = items.find((item) => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));

    const { error: deleteError } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      // Revert optimistic update
      if (deletedItem) {
        setItems((prev) => [...prev, deletedItem]);
      }
      setError(deleteError.message);
    }
  }

  async function clearCompleted() {
    const completedIds = items
      .filter((item) => item.is_completed)
      .map((item) => item.id);

    if (completedIds.length === 0) return;

    // Optimistic update
    const completedItems = items.filter((item) => item.is_completed);
    setItems((prev) => prev.filter((item) => !item.is_completed));

    const { error: deleteError } = await supabase
      .from('shopping_items')
      .delete()
      .in('id', completedIds);

    if (deleteError) {
      // Revert optimistic update
      setItems((prev) => [...prev, ...completedItems]);
      setError(deleteError.message);
    }
  }

  const stats = {
    total: items.length,
    completed: items.filter((item) => item.is_completed).length,
    remaining: items.filter((item) => !item.is_completed).length,
  };

  return {
    items,
    loading,
    error,
    isOnline,
    isSyncing,
    stats,
    addItem,
    toggleItem,
    deleteItem,
    clearCompleted,
    refetch: fetchItems,
  };
}
