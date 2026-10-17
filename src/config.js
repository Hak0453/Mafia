/**
 * CENTRAL CONFIGURATION — MAFIA 1 PERSONAL SITE SKELETON
 * ------------------------------------------------------
 * Edit this single file to customize:
 * 1. Site title, subtitle, and audio settings
 * 2. Lighting colors, fog density, and atmosphere
 * 3. Menu items, camera waypoints (position + target), 3D object mappings, and HTML content
 * 4. Optional custom .glb 3D model paths (drop files into /public/models/)
 */

export const SITE_META = {
  title: 'MAFIA',
  subtitle: 'THE CITY OF LOST HEAVEN • PORTFOLIO',
  // Optional: drop an .mp3 into public/audio/theme.mp3 and set customAudioUrl: '/audio/theme.mp3'
  // Leave null to use the built-in WebAudio 1930s Orchestral Noir Theme synthesizer!
  customAudioUrl: null
};

export const THEME = {
  backgroundColor: 0x080605,
  fogColor: 0x080605,
  fogDensity: 0.065,

  // Warm green banker's desk lamp
  lampLight: {
    color: 0xff9e44,
    intensity: 5.5,
    distance: 9,
    decay: 1.6,
    flickerAmount: 0.18
  },

  // Cool 1930s street/moonlight coming through the Venetian blinds
  windowLight: {
    color: 0x5c7d99,
    intensity: 2.2,
    position: { x: -3.8, y: 3.4, z: -2.2 }
  },

  // Subtle crimson/warm fill light from the room interior
  fillLight: {
    color: 0x8c2d19,
    intensity: 0.65
  },

  ambientLight: {
    color: 0x241a14,
    intensity: 0.9
  }
};

/**
 *Optional custom GLB overrides:
 * Set `modelPath: '/models/my-fedora.glb'` on any prop below to replace its procedural mesh
 * with your own 3D model automatically!
 */
export const CUSTOM_MODELS = {
  dossier: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  operations: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  arsenal: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  telegram: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } }
};

/**
 * MENU SECTIONS & CAMERA WAYPOINTS
 * Use the in-app "CAMERA TUNER [C]" button to test new angles and copy coordinates here.
 */
export const SECTIONS = [
  {
    id: 'overview',
    title: 'THE OFFICE',
    subtitle: 'MAIN DESK',
    kicker: 'SALIERI BAR • BACK ROOM',
    objectName: null, // Wide shot
    cameraPos: { x: 0.25, y: 2.15, z: 3.35 },
    cameraTarget: { x: 0.0, y: 1.05, z: -0.4 },
    content: null // Null hides the right-side dossier panel so you enjoy the full 3D scene
  },
  {
    id: 'dossier',
    title: 'DOSSIER',
    subtitle: 'ABOUT ME',
    kicker: 'PERSONNEL FILE NO. 1930-01',
    objectName: 'prop_dossier',
    tooltip: 'Inspect Personnel Dossier & Typewriter',
    cameraPos: { x: -0.05, y: 1.72, z: 0.92 },
    cameraTarget: { x: -0.08, y: 0.82, z: -0.05 },
    content: `
      <p>
        Welcome to my office. This is a customizable <strong>Three.js</strong> personal site
        skeleton inspired by the classic 2002 <em>Mafia: The City of Lost Heaven</em> main menu.
      </p>
      <p>
        Every menu item and interactive object on the desk smoothly pans the camera to a dedicated
        waypoint in 3D space. Edit <code>src/config.js</code> to update this text, tweak camera
        coordinates, adjust lighting, or swap any desk prop with your own <code>.glb</code> models.
      </p>
      <div class="tag-list">
        <span class="noir-tag">CREATIVE DEVELOPER</span>
        <span class="noir-tag">THREE.JS / WEBGL</span>
        <span class="noir-tag">FULL-STACK</span>
        <span class="noir-tag">LOST HEAVEN</span>
      </div>
    `
  },
  {
    id: 'operations',
    title: 'OPERATIONS',
    subtitle: 'PROJECTS',
    kicker: 'CASE BOARD & BLUEPRINTS',
    objectName: 'prop_operations',
    tooltip: 'Examine Investigation Pinboard on Wall',
    cameraPos: { x: 0.45, y: 2.05, z: 0.65 },
    cameraTarget: { x: 0.55, y: 1.92, z: -1.45 },
    content: `
      <p>
        Major operations, commissions, and interactive experiments pinned to the back-room board.
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>OPERATION: LOST HEAVEN 3D</h4>
          <p>Interactive 1930s noir office scene with procedural props, volumetric slatted shadows, and GSAP camera choreography.</p>
        </div>
        <div class="dossier-item">
          <h4>OPERATION: NIGHT RUNNER</h4>
          <p>Replace this card in <code>src/config.js</code> with your featured GitHub repositories, live demos, and case studies.</p>
        </div>
        <div class="dossier-item">
          <h4>OPERATION: SILENT ARCHIVE</h4>
          <p>Custom WebGL shaders, real-time audio synthesis, and high-performance frontend architecture.</p>
        </div>
      </div>
    `
  },
  {
    id: 'arsenal',
    title: 'ARSENAL',
    subtitle: 'SKILLS & TECH',
    kicker: 'TOOLS OF THE TRADE',
    objectName: 'prop_arsenal',
    tooltip: 'Inspect Fedora, Pocket Watch & Revolver',
    cameraPos: { x: 1.25, y: 1.55, z: 0.95 },
    cameraTarget: { x: 0.82, y: 0.86, z: -0.12 },
    content: `
      <p>
        Every job requires the right instruments. Here are the tools and technologies ready on the table:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>3D &amp; GRAPHICS</h4>
          <p>Three.js, WebGL, GLSL Shaders, Blender, GSAP Animation, Post-Processing</p>
        </div>
        <div class="dossier-item">
          <h4>FRONTEND &amp; ARCHITECTURE</h4>
          <p>JavaScript / TypeScript, React, Next.js, Vite, CSS Architecture, Web Audio API</p>
        </div>
      </div>
      <div class="tag-list">
        <span class="noir-tag">THREE.JS</span>
        <span class="noir-tag">GSAP</span>
        <span class="noir-tag">TYPESCRIPT</span>
        <span class="noir-tag">REACT</span>
        <span class="noir-tag">BLENDER</span>
        <span class="noir-tag">NODE.JS</span>
      </div>
    `
  },
  {
    id: 'telegram',
    title: 'TELEGRAM',
    subtitle: 'CONTACT',
    kicker: 'DIRECT LINE • OPERATOR 402',
    objectName: 'prop_telegram',
    tooltip: 'Use Rotary Telephone & Telegram Pad',
    cameraPos: { x: -1.15, y: 1.52, z: 1.02 },
    cameraTarget: { x: -0.78, y: 0.88, z: -0.08 },
    content: `
      <p>
        Need to set up a meeting or discuss a new proposition? Pick up the rotary line or send a wire directly.
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>DIRECT WIRE (EMAIL)</h4>
          <p>your.name@example.com</p>
        </div>
        <div class="dossier-item">
          <h4>DISPATCH CHANNELS</h4>
          <p>GitHub • X / Twitter • LinkedIn</p>
        </div>
      </div>
    `
  }
];
