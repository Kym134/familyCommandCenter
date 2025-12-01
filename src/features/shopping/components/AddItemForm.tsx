import { useState, useRef, useEffect } from 'react';
import type { Category } from '../../../types/database.types';

interface AddItemFormProps {
  categories: Category[];
  onAdd: (title: string, categoryId: string | null, quantity?: string) => void;
}

export function AddItemForm({ categories, onAdd }: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim(), categoryId || null, quantity.trim() || undefined);

    setTitle('');
    setQuantity('');
    // Keep category selected for quick consecutive adds
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
      setQuantity('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="
          w-full flex items-center gap-3 px-4 py-3 min-h-[44px]
          text-gray-500 hover:text-gray-700 hover:bg-gray-50
          transition-colors rounded-lg border-2 border-dashed border-gray-200
          hover:border-gray-300
        "
      >
        <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
          +
        </span>
        <span>Add item...</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
          +
        </span>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need?"
          className="flex-1 text-base outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100">
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          className="w-16 px-2 py-1 text-sm border border-gray-200 rounded bg-white outline-none focus:border-blue-400"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded bg-white outline-none focus:border-blue-400"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon ? `${cat.icon} ` : ''}
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setTitle('');
            setQuantity('');
          }}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!title.trim()}
          className="
            px-4 py-1 text-sm font-medium text-white bg-blue-500 rounded
            hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors
          "
        >
          Add
        </button>
      </div>
    </form>
  );
}
