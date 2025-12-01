import type { ShoppingStats } from '../types';

interface ShoppingHeaderProps {
  stats: ShoppingStats;
  isOnline: boolean;
  isSyncing: boolean;
  onClearCompleted: () => void;
}

export function ShoppingHeader({
  stats,
  isOnline,
  isSyncing,
  onClearCompleted,
}: ShoppingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>

        {/* Sync status indicator */}
        {!isOnline && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Offline
          </span>
        )}
        {isOnline && isSyncing && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            <svg
              className="w-3 h-3 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Syncing
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="text-sm text-gray-500">
          {stats.remaining > 0 && (
            <span>
              <span className="font-semibold text-gray-700">
                {stats.remaining}
              </span>{' '}
              to get
            </span>
          )}
          {stats.completed > 0 && stats.remaining > 0 && (
            <span className="mx-1">·</span>
          )}
          {stats.completed > 0 && (
            <span>
              <span className="font-semibold text-green-600">
                {stats.completed}
              </span>{' '}
              done
            </span>
          )}
        </div>

        {/* Clear completed button */}
        {stats.completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="
              px-3 py-1.5 text-sm font-medium
              text-gray-600 hover:text-gray-800
              bg-gray-100 hover:bg-gray-200
              rounded-lg transition-colors
            "
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
