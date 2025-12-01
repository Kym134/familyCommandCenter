import type { ShoppingItemWithRelations } from '../types';

interface ShoppingItemProps {
  item: ShoppingItemWithRelations;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItem({ item, onToggle, onDelete }: ShoppingItemProps) {
  const handleToggle = () => {
    onToggle(item.id, item.is_completed);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div
      onClick={handleToggle}
      className={`
        flex items-center gap-3 px-4 py-3 min-h-[44px] cursor-pointer
        transition-all duration-200 ease-in-out
        hover:bg-gray-50 active:bg-gray-100
        ${item.is_completed ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox */}
      <div
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 flex-shrink-0
          ${
            item.is_completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        {item.is_completed && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-base transition-all duration-200
              ${item.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}
            `}
          >
            {item.title}
          </span>
          {item.quantity && (
            <span className="text-sm text-gray-500 flex-shrink-0">
              ({item.quantity}
              {item.unit ? ` ${item.unit}` : ''})
            </span>
          )}
        </div>
      </div>

      {/* Added by user emoji */}
      {item.added_by_user && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{
            backgroundColor: item.added_by_user.color_primary + '20',
          }}
          title={`Added by ${item.added_by_user.display_name}`}
        >
          {item.added_by_user.avatar_emoji || '👤'}
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="p-2 -mr-2 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete item"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
