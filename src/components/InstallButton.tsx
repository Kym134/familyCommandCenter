import { usePWA } from '../hooks/usePWA';

export function InstallButton() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();

  // Don't show button if already installed or not installable
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <button
      onClick={promptInstall}
      className="fixed bottom-4 right-4 bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
      aria-label="Install Family Command Centre"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Install App
    </button>
  );
}
