# PWA Setup - Family Command Centre

This document describes the PWA (Progressive Web App) setup for the Family Command Centre application, with offline-first capability for installation on iPhone and Android tablets.

## ✅ What's Been Configured

### 1. Dependencies Installed
- `vite-plugin-pwa` - Main PWA plugin for Vite
- `workbox-window` - Service worker management
- `@vite-pwa/assets-generator` - Automatic icon generation

### 2. Manifest Configuration
**Location:** `public/manifest.json`

- **App Name:** Family Command Centre
- **Short Name:** Family HQ
- **Theme Color:** #1e40af (blue-800)
- **Background Color:** #ffffff
- **Display Mode:** standalone
- **Orientation:** any (supports both portrait and landscape)
- **Icons:** 192x192, 512x512, apple-touch-icon 180x180

### 3. Service Worker Configuration
**Location:** `vite.config.ts`

#### Caching Strategies:

1. **Supabase API Calls** - Network-first with cache fallback
   - Timeout: 10 seconds
   - Cache duration: 24 hours
   - Max entries: 50

2. **Images** - Cache-first
   - Cache duration: 30 days
   - Max entries: 100

3. **Today's Data** - Stale-while-revalidate
   - Cache duration: 1 hour
   - Max entries: 20

#### Offline Support:
- Custom offline fallback page at `public/offline.html`
- Automatic service worker updates
- Precaching of HTML, CSS, JS assets

### 4. PWA Hook
**Location:** `src/hooks/usePWA.ts`

Provides:
- `isInstallable` - Whether the install prompt is available
- `isInstalled` - Whether the app is currently installed
- `isOffline` - Current network status
- `promptInstall()` - Function to trigger install prompt
- `updateAvailable` - Whether a new version is available
- `updateServiceWorker()` - Function to apply updates

### 5. HTML Meta Tags
**Location:** `index.html`

Added meta tags for:
- PWA description and theme color
- Apple mobile web app capability
- Apple touch icons
- Manifest link
- Favicons

### 6. Offline Fallback Page
**Location:** `public/offline.html`

Features:
- Branded offline experience
- Automatic connection detection
- Retry functionality
- Visual feedback for offline state

## 🧪 Testing the PWA

### Testing on Desktop (Chrome/Edge)

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Open the app in Chrome or Edge (http://localhost:5173)

3. Open DevTools (F12) and go to:
   - **Application** tab → **Manifest** (verify manifest loads correctly)
   - **Application** tab → **Service Workers** (verify SW registered)
   - **Lighthouse** tab → Run PWA audit

4. Test install prompt:
   - Look for the install icon in the address bar
   - Or use DevTools → Application → Manifest → "Add to homescreen"

5. Test offline mode:
   - In DevTools Network tab, check "Offline"
   - Reload the page (should show offline.html or cached content)

### Testing on iPhone

1. **Make your dev server accessible on local network:**
   ```bash
   pnpm run dev -- --host
   ```
   Note the local IP address (e.g., http://192.168.1.x:5173)

2. **On iPhone, open Safari:**
   - Navigate to the IP address
   - Tap the Share button
   - Tap "Add to Home Screen"
   - Give it a name and tap "Add"

3. **Test the installed app:**
   - Find the app icon on your home screen
   - Tap to open (should open in standalone mode)
   - Test offline: Enable Airplane mode and reopen the app

### Testing on Android Tablet

1. **Make your dev server accessible:**
   ```bash
   pnpm run dev -- --host
   ```

2. **On Android, open Chrome:**
   - Navigate to the IP address
   - Tap the menu (⋮) → "Install app" or "Add to Home screen"
   - Confirm the installation

3. **Test the installed app:**
   - Find the app in your app drawer
   - Open it (should open in standalone mode)
   - Test offline: Enable Airplane mode and reopen the app

### Production Testing

1. **Build the app:**
   ```bash
   pnpm run build
   ```

2. **Preview the production build:**
   ```bash
   pnpm run preview
   ```

3. **Or serve with a static server:**
   ```bash
   npx serve -s dist
   ```

4. Test installation and offline functionality as described above

## 📱 PWA Installation Checklist

Use this checklist to verify your PWA is properly configured:

- [ ] Manifest is accessible at `/manifest.json`
- [ ] Service worker registers successfully
- [ ] All icons are present and load correctly
- [ ] Install prompt appears on supported browsers
- [ ] App can be added to home screen on iOS
- [ ] App can be installed on Android
- [ ] App opens in standalone mode when installed
- [ ] Offline page displays when network is unavailable
- [ ] App caches and serves content when offline
- [ ] Service worker updates are handled properly

## 🔧 Customization

### Updating the App Icon

Replace `public/logo.svg` with your custom logo, then run:
```bash
pnpm run generate:icons
```

This will automatically generate all required icon sizes.

### Modifying Cache Strategies

Edit the `workbox.runtimeCaching` configuration in `vite.config.ts` to adjust:
- Cache durations
- Maximum entries
- Caching strategies (NetworkFirst, CacheFirst, StaleWhileRevalidate)
- URL patterns

### Customizing the Offline Page

Edit `public/offline.html` to match your brand:
- Colors and styling
- Messaging
- Additional functionality

### Using the PWA Hook in Components

```tsx
import { usePWA } from './hooks/usePWA';

function InstallButton() {
  const { isInstallable, promptInstall } = usePWA();

  if (!isInstallable) return null;

  return (
    <button onClick={promptInstall}>
      Install App
    </button>
  );
}
```

## 🚀 Deployment Considerations

1. **HTTPS Required:** PWAs require HTTPS in production (localhost is exempt)
2. **Service Worker Scope:** The SW will only work for paths under its location
3. **Cache Management:** Monitor cache usage and implement cache cleanup strategies
4. **Update Strategy:** Consider how you'll handle app updates (prompt users, auto-update, etc.)

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)

## 🐛 Troubleshooting

### Install prompt doesn't appear
- Ensure you're using HTTPS (or localhost)
- Check that manifest.json is properly linked
- Verify all required manifest fields are present
- Make sure service worker is registered successfully

### Service worker not updating
- Clear browser cache and service worker
- Check DevTools → Application → Service Workers → "Update on reload"
- Verify `registerType: 'autoUpdate'` in vite.config.ts

### Icons not displaying
- Check browser console for 404 errors
- Verify icon paths in manifest.json match actual file locations
- Ensure icons are properly sized (use `pnpm run generate:icons`)

### Offline mode not working
- Verify service worker is active
- Check cache storage in DevTools
- Ensure offline.html exists in public directory
- Check workbox configuration in vite.config.ts
