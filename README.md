# OnePage Wisdom — PWA test kit (20261013_233000)

## Files
- `index.html` — app shell; styles and app logic remain embedded.
- `manifest.json` — install metadata.
- `service-worker.js` — versioned offline app-shell cache and update lifecycle, following the strategy used by GRIDS.
- `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png` — PWA icons.
- JSON files — sample book packages; book content is not automatically fetched by the app.

## Important: local file versus installed PWA
A service worker cannot be registered from an Android `content://` / downloaded local HTML file. The HTML still opens as a standalone file, but PWA installation and reliable offline app-shell caching require serving this folder from HTTPS (for example, GitHub Pages). This is a browser security restriction, not an app-specific setting.

## Deploy to GitHub Pages
1. Upload the contents of this folder to the root of a dedicated repository (or a folder configured for Pages).
2. Enable GitHub Pages over HTTPS.
3. Open the HTTPS Pages URL in Chrome once while online.
4. In Chrome, use **Add to Home screen** / **Install app** if offered.
5. Reopen from the installed icon; the service worker caches the app shell and serves the cached HTML if offline.

The app uses a unique cache prefix (`onepage-wisdom-cache-`) and will not delete GRIDS or other apps' caches. Bump the cache version in `service-worker.js` for future releases.

## Data storage
The reader continues to use IndexedDB for imported book packages because packages include large embedded Base64 infographic images. The PWA origin is stable under HTTPS, allowing persistent storage to work like other hosted PWAs. Export a library backup before clearing site data or changing browsers/devices. The standalone local-file fallback remains best-effort and cannot guarantee persistence if Android/Chrome restricts storage for that opening method.

## Content display change
The reader no longer renders the literal `detail:` label before description text. JSON schema field names remain intact for compatibility.
