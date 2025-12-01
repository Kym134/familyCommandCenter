import { useMemo } from 'react';
import { useFamily } from '../../../contexts/FamilyContext';
import { useShoppingItems } from '../hooks/useShoppingItems';
import { useCategories } from '../hooks/useCategories';
import { ShoppingHeader } from './ShoppingHeader';
import { AddItemForm } from './AddItemForm';
import { CategorySection } from './CategorySection';
import type { ShoppingItemWithRelations } from '../types';

export function ShoppingList() {
  const { family, loading: familyLoading } = useFamily();

  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    isOnline,
    isSyncing,
    stats,
    addItem,
    toggleItem,
    deleteItem,
    clearCompleted,
  } = useShoppingItems();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string | undefined, ShoppingItemWithRelations[]>();

    // Initialize with all categories (even empty ones won't show, but keeps order)
    categories.forEach((cat) => {
      grouped.set(cat.id, []);
    });
    grouped.set(undefined, []); // Uncategorized

    // Group items
    items.forEach((item) => {
      const categoryId = item.category_id;
      const existing = grouped.get(categoryId) || [];
      grouped.set(categoryId, [...existing, item]);
    });

    return grouped;
  }, [items, categories]);

  const isLoading = familyLoading || itemsLoading || categoriesLoading;
  const error = itemsError || categoriesError;

  if (familyLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12 text-gray-500">
          <p>Loading family...</p>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12 text-red-600">
          <p className="text-lg font-medium">No family found</p>
          <p className="text-sm mt-1 text-gray-500">
            Please check your database configuration.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Header with stats and clear button */}
      <ShoppingHeader
        stats={stats}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onClearCompleted={clearCompleted}
      />

      {/* Add item form */}
      <div className="mb-6">
        <AddItemForm categories={categories} onAdd={addItem} />
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-lg font-medium">Your shopping list is empty</p>
          <p className="text-sm mt-1">Add items to get started</p>
        </div>
      )}

      {/* Category sections */}
      {items.length > 0 && (
        <div className="space-y-2">
          {/* Render categories in order */}
          {categories.map((category) => {
            const categoryItems = itemsByCategory.get(category.id) || [];
            if (categoryItems.length === 0) return null;
            return (
              <CategorySection
                key={category.id}
                category={category}
                items={categoryItems}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            );
          })}

          {/* Uncategorized items at the end */}
          {(itemsByCategory.get(undefined)?.length || 0) > 0 && (
            <CategorySection
              category={null}
              items={itemsByCategory.get(undefined) || []}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          )}
        </div>
      )}
    </div>
  );
}
