import { useState } from 'react';
import type { Category } from '../../../types/database.types';
import type { ShoppingItemWithRelations } from '../types';
import { ShoppingItem } from './ShoppingItem';

interface CategorySectionProps {
  category: Category | null;
  items: ShoppingItemWithRelations[];
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export function CategorySection({
  category,
  items,
  onToggle,
  onDelete,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort items: incomplete first, then by created_at
  const sortedItems = [...items].sort((a, b) => {
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const incompleteCount = items.filter((item) => !item.is_completed).length;
  const completedCount = items.filter((item) => item.is_completed).length;

  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Category header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          w-full flex items-center gap-2 px-4 py-2
          bg-gray-100 hover:bg-gray-200
          rounded-lg transition-colors
          text-left
        "
      >
        {/* Collapse/expand icon */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>

        {/* Category icon and name */}
        <span className="text-lg">{category?.icon || '📦'}</span>
        <span className="font-medium text-gray-700 flex-1">
          {category?.name || 'Uncategorized'}
        </span>

        {/* Item counts */}
        <span className="text-sm text-gray-500">
          {incompleteCount > 0 && (
            <span className="font-medium text-gray-700">{incompleteCount}</span>
          )}
          {completedCount > 0 && (
            <span className="text-gray-400">
              {incompleteCount > 0 ? ' / ' : ''}
              <span className="line-through">{completedCount}</span>
            </span>
          )}
        </span>
      </button>

      {/* Items list */}
      {!isCollapsed && (
        <div className="mt-1 bg-white rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {sortedItems.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
