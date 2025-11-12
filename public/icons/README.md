# PWA Icons

This directory should contain the following icons for your Family Command Centre PWA:

## Required Icons

- `icon-192x192.png` - Standard PWA icon (192x192px)
- `icon-512x512.png` - Large PWA icon (512x512px)
- `apple-touch-icon-180x180.png` - Apple touch icon (180x180px)

## Generating Icons

You can use the `@vite-pwa/assets-generator` package to automatically generate all required icons from a single source image:

1. Create a source image (SVG or high-res PNG, at least 512x512px) and save it as `logo.svg` or `logo.png` in the project root

2. Run the assets generator:
   ```bash
   pnpm pwa-assets-generator --preset minimal public/logo.svg
   ```

3. Or use the full preset for more icon variations:
   ```bash
   pnpm pwa-assets-generator public/logo.svg
   ```

## Manual Creation

If you prefer to create icons manually:

1. Design your app icon (recommended: 1024x1024px)
2. Export at the following sizes:
   - 192x192px → `icon-192x192.png`
   - 512x512px → `icon-512x512.png`
   - 180x180px → `apple-touch-icon-180x180.png`

## Design Guidelines

- Use a simple, recognizable design
- Ensure the icon works well at small sizes
- Add appropriate padding (safe zone) to prevent clipping
- For maskable icons, keep important content in the center 80% of the canvas
- Use the brand color (#1e40af - blue-800) as primary color

## Temporary Placeholder

A temporary SVG logo placeholder has been included (`logo.svg`). You should replace this with your actual app logo.
