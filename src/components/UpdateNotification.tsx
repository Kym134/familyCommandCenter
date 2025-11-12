import { usePWA } from '../hooks/usePWA';

export function UpdateNotification() {
  const { updateAvailable, updateServiceWorker } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Update Available
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            A new version of Family Command Centre is ready.
          </p>
          <button
            onClick={updateServiceWorker}
            className="mt-3 w-full bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
