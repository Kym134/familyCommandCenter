import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useFamily } from '../../../contexts/FamilyContext';
import type { Category } from '../../../types/database.types';

export function useCategories() {
  const { family } = useFamily();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!family) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('family_id', family.id)
      .order('sort_order', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  }, [family]);

  useEffect(() => {
    if (!family) return;
    fetchCategories();
  }, [family, fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
