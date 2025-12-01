import type { ShoppingItem, Category, User } from '../../types/database.types';

export interface ShoppingItemWithRelations extends ShoppingItem {
  category: Category | null;
  added_by_user: User | null;
}

export interface CategoryWithItems extends Category {
  items: ShoppingItemWithRelations[];
}

export interface ShoppingStats {
  total: number;
  completed: number;
  remaining: number;
}
