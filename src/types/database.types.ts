export interface Family {
  id: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  family_id: string;
  email?: string;
  display_name: string;
  role: 'adult' | 'child';
  color_primary: string;
  color_accent: string;
  age?: number;
  avatar_emoji?: string;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  family_id: string;
  title: string;
  quantity?: string;
  unit?: string;
  category_id?: string;
  is_needed: boolean;
  is_completed: boolean;
  added_by?: string;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  created_at: string;
}

export interface Category {
  id: string;
  family_id: string;
  name: string;
  icon?: string;
  sort_order: number;
  store_section?: string;
}
