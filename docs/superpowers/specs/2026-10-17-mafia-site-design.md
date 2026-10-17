# Mafia 1 Three.js Personal Site Skeleton — Design Spec

**Date:** 2026-10-17  
**Project Name:** `Mafia`  
**Location:** `C:\Users\BLACKROAD\.gemini\antigravity\scratch\Mafia`  
**Reference:** *Mafia: The City of Lost Heaven* (2002) Main Menu (`https://www.youtube.com/watch?v=e7XH-nSMXYM`)

---

## 1. Overview & Goals

Build an interactive 3D personal portfolio skeleton inspired by the iconic 1930s detective/mobster office main menu from *Mafia: The City of Lost Heaven* (2002). The project is designed as a modular, config-driven skeleton so the owner can easily customize menu items, section content, camera waypoints, lighting/theme, audio, and swap procedural 3D props with custom `.glb` models.

---

## 2. Tech Stack & Deployment

- **Bundler / Dev Server:** Vite (Vanilla JS / ES Modules)
- **3D Engine:** Three.js (`three`), including `GLTFLoader` and `DRACOLoader` support for custom 3D models
- **Animation:** GSAP (`gsap`) for smooth camera `position` and `lookAt` target interpolation
- **Styling:** Vanilla CSS with 1930s noir serif typography (`Playfair Display` / `Cinzel` / `Courier Prime`), film grain, and vignette overlays
- **Source Control & Hosting:** Git + GitHub repository (`Mafia`) + Vercel deployment

---

## 3. Architecture & File Structure

```text
Mafia/
├── public/
│   └── models/                # Drop-in folder for custom .glb/.gltf models & audio
├── src/
│   ├── config.js              # Central control file: theme, lighting, waypoints, menu & content
│   ├── main.js                # Entry point: renderer, loop, resize, UI & scene wiring
│   ├── style.css              # 1930s noir typography, menu layout, content cards, film grain
│   ├── scene/
│   │   ├── Room.js            # 1930s office room, desk, procedural props + GLTFLoader helper
│   │   ├── Atmosphere.js      # Volumetric-style slatted window light, smoke particles, dust, lamp flicker
│   │   └── CameraController.js# GSAP camera transitions, idle mouse parallax, 3D object raycasting
│   ├── ui/
│   │   └── MenuUI.js          # DOM menu rendering, active section panel, back-to-desk navigation, debug HUD
│   └── audio/
│       └── SoundManager.js    # Web Audio API noir vinyl crackle, hover/click SFX + optional MP3 player
├── index.html
├── package.json
└── vite.config.js
```

---

## 4. Core Components & Data Flow

### 4.1 Central Configuration (`src/config.js`)
Exports two primary objects that drive the entire application:
- `THEME`:
  - Background & fog color/density (`#090706`)
  - Banker's lamp warm point/spot light color (`#ff9d42`), intensity, and flicker speed
  - Window moonlight/streetlight cool directional light (`#4a6b82`) casting Venetian blind shadows
  - Ambient fill light settings
- `SECTIONS`: Array of menu/camera states:
  1. `overview` (**Main Menu / Desk Overview**): Wide angle of the desk, lamp, ashtray smoke, window blinds.
  2. `dossier` (**Dossier / About**): Camera zooms onto the manila folder & typewriter papers on the center desk.
  3. `operations` (**Operations / Projects**): Camera pans up to the framed investigation pinboard / map on the wall.
  4. `arsenal` (**Arsenal / Skills**): Camera pans to the fedora hat, pocket watch, and revolver on the right side of the desk.
  5. `telegram` (**Telegram / Contact**): Camera pans to the vintage rotary telephone & notepad on the left side of the desk.

Each entry in `SECTIONS` defines:
- `id`, `title`, `subtitle`
- `cameraPos: { x, y, z }` and `cameraTarget: { x, y, z }`
- `objectName`: matching the 3D group name on the desk for raycast hover/click
- `content`: HTML/structured data rendered inside the noir dossier overlay when zoomed in

### 4.2 3D Scene & Props (`src/scene/Room.js` & `src/scene/Atmosphere.js`)
- Builds the room walls, wood-paneled wainscoting, window with Venetian blinds, and mahogany desk.
- Creates stylized procedural 3D groups for each interactive prop (`dossier`, `operations`, `arsenal`, `telegram`, plus the green banker's desk lamp and ashtray with glowing cigarette).
- Provides `loadCustomModel({ path, position, rotation, scale, targetGroup })` using `GLTFLoader` so any procedural prop can be replaced by setting a `modelPath` in `src/config.js`.
- `Atmosphere.js` animates rising cigarette smoke particles from the ashtray, floating dust motes in the light beams, and subtle lamp intensity flicker.

### 4.3 Camera & Interaction (`src/scene/CameraController.js`)
- Maintains a `currentTarget` (`THREE.Vector3`) that the camera looks at each frame.
- On menu click or 3D object click, uses `gsap.to(camera.position, ...)` and `gsap.to(currentTarget, ...)` with `power2.inOut` easing over `1.6s`.
- Adds subtle mouse-driven parallax offset so the scene feels alive even when stationary.
- Raycasts against interactive desk props on pointer move/click; hovered props receive a subtle warm rim/emissive highlight and cursor change.

### 4.4 UI & Camera Helper (`src/ui/MenuUI.js`)
- Renders the classic *Mafia 1* style crimson/gold/parchment serif menu on the left side in `overview` mode.
- When zoomed into a specific object (`dossier`, `operations`, `arsenal`, `telegram`), fades in a period-authentic dossier/card overlay with a **"Return to Desk [ESC]"** button.
- Includes a toggleable **Camera Tuner (`?debug=1` or `[C]` key)** showing live camera `position` and `target` coordinates so the user can easily position new objects and copy coordinates into `src/config.js`.

---

## 5. Error Handling & Testing Verification

- **Model Loading Fallback:** If a custom `.glb` path in `src/config.js` fails to load, `Room.js` logs a clear warning and keeps the procedural fallback mesh visible so the scene never breaks.
- **Audio Autoplay Policy:** Web Audio starts muted/suspended until the first user interaction, with a clear sound toggle button in the corner.
- **Verification Criteria:**
  - `npm run build` completes with zero errors.
  - All 5 camera waypoints smoothly animate via both menu clicks and 3D object clicks.
  - Pressing `Escape` or clicking "Return to Desk" returns smoothly to the `overview` camera.
  - GitHub repository `Mafia` is created, pushed, and deployed to Vercel.
