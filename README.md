# MAFIA — 1930s Noir Three.js Personal Site

An interactive 3D personal site skeleton inspired by the iconic main menu of **Mafia: The City of Lost Heaven (2002)**.

## Features
- **Interactive 1930s Office Desk Scene (Three.js):** Executive mahogany desk, flickering emerald banker's lamp, curling cigar smoke, Venetian window blinds casting slatted moonlight shadows, and interactive 3D props.
- **GSAP Camera Choreography:** Clicking menu items or clicking 3D objects directly on the desk/wall smoothly pans and zooms the camera to that station and opens its dossier overlay.
- **1930s Orchestral Noir Theme (Web Audio API + MP3 support):** Built-in procedural D-minor orchestral string/horn/timpani noir theme with vintage gramophone vinyl crackle, or drop any `.mp3` into `public/audio/theme.mp3` and set `customAudioUrl` in `src/config.js`.
- **Live Camera Tuner (`[C]` Key):** Dial in new camera positions and `lookAt` targets with live sliders and copy the config snippet with one click.
- **Custom `.glb` Model Loader:** Drop `.glb` files into `public/models/` and set `modelPath` in `src/config.js` to replace any procedural prop automatically.

## Quick Customization Guide

Everything you want to customize is centralized in [`src/config.js`](./src/config.js):
1. **`SITE_META`** — Change the main title, subtitle, or set `customAudioUrl: '/audio/theme.mp3'`.
2. **`THEME`** — Tweak fog density, banker's lamp warmth/flicker, and window moonlight colors.
3. **`CUSTOM_MODELS`** — Replace any desk prop (`dossier`, `operations`, `arsenal`, `telegram`) with a custom `.glb` model placed in `public/models/`.
4. **`SECTIONS`** — Add/edit menu items, camera waypoints (`cameraPos` & `cameraTarget`), and HTML content cards.

## Development

```bash
npm install
npm run dev
```
