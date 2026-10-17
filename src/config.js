/**
 * CENTRAL CONFIGURATION — MAFIA 1 PERSONAL SITE SKELETON
 * ------------------------------------------------------
 * Default `overview` camera matches the exact "Room View" screenshot uploaded by the user:
 * High-angle corner shot showing the full wooden desk, red-cushioned wooden chair,
 * hardwood plank floor, left bookcase/trophy/cardboard box, right wastebasket,
 * back wall pin-up posters, typewriter, green dome lamp, map, keychain, rotary phone,
 * and photorealistic Colt M1911 pistols.
 */

export const SITE_META = {
  title: 'Main Menu:',
  subtitle: 'THE CITY OF LOST HEAVEN',
  // Plays the real Mafia: The City of Lost Heaven Main Theme (Vladimir Simunek)
  customAudioUrl: '/audio/theme.mp3'
};

export const THEME = {
  backgroundColor: 0x1e1812,
  fogColor: 0x1e1812,
  fogDensity: 0.032,

  // Warm golden pool of light under the Green Mushroom-Dome Lamp
  lampLight: {
    color: 0xffd28a,
    intensity: 6.8,
    distance: 9,
    decay: 1.25,
    flickerAmount: 0.05
  },

  // Overhead/angled room light illuminating the chair, floor planks, and desk
  windowLight: {
    color: 0xffebd2,
    intensity: 2.3,
    position: { x: 0.4, y: 3.1, z: 1.8 }
  },

  fillLight: {
    color: 0xffc078,
    intensity: 1.5
  },

  ambientLight: {
    color: 0x7d654d,
    intensity: 1.55
  }
};

export const CUSTOM_MODELS = {
  dossier: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  operations: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  arsenal: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  telegram: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } }
};

export const SECTIONS = [
  {
    id: 'overview',
    title: 'Intro',
    subtitle: 'Room View',
    kicker: 'SALIERI BAR • BACK ROOM',
    objectName: null,
    // Matches the exact high-angle Room View from the uploaded screenshot!
    cameraPos: { x: -0.42, y: 2.08, z: 1.82 },
    cameraTarget: { x: 0.02, y: 0.64, z: -0.08 },
    content: null
  },
  {
    id: 'arsenal',
    title: 'New Game',
    subtitle: 'Twin M1911 Pistols',
    kicker: 'ARSENAL • SKILLS & TECH',
    objectName: 'prop_arsenal',
    tooltip: 'Inspect Twin Colt M1911 Pistols & Cigar Ashtray',
    // Matches the close-up tabletop angle on the two Colt M1911 pistols & ashtray
    cameraPos: { x: 0.34, y: 1.34, z: 0.62 },
    cameraTarget: { x: 0.44, y: 0.81, z: 0.14 },
    content: `
      <p>
        Two photorealistic <strong>Colt M1911 Service Pistols</strong> resting on the honey-oak desk
        beside a smoldering cigar. Edit <code>src/config.js</code> to list your technical stack:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>3D &amp; GRAPHICS</h4>
          <p>Three.js, WebGL, PBR Materials &amp; GLTF Models, GSAP Camera Choreography</p>
        </div>
        <div class="dossier-item">
          <h4>FULL-STACK DEVELOPMENT</h4>
          <p>JavaScript / TypeScript, React, Next.js, Node.js, Modern Web Architecture</p>
        </div>
      </div>
      <div class="tag-list">
        <span class="noir-tag">THREE.JS</span>
        <span class="noir-tag">WEBGL</span>
        <span class="noir-tag">GSAP</span>
        <span class="noir-tag">TYPESCRIPT</span>
        <span class="noir-tag">REACT</span>
      </div>
    `
  },
  {
    id: 'dossier',
    title: 'Load Game',
    subtitle: 'Map & Keychain',
    kicker: 'DOSSIER • ABOUT ME',
    objectName: 'prop_dossier',
    tooltip: 'Inspect Lost Heaven Map, Bullet & Keychain',
    cameraPos: { x: -0.05, y: 1.32, z: 0.58 },
    cameraTarget: { x: -0.04, y: 0.81, z: 0.08 },
    content: `
      <p>
        The unfolded street map of Lost Heaven, standing .45 cartridge, fountain pen, and leather
        keychain fob. Customize this card in <code>src/config.js</code> with your bio and story.
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>BACKGROUND</h4>
          <p>Creative Developer crafting atmospheric 3D web experiences and full-stack applications.</p>
        </div>
        <div class="dossier-item">
          <h4>CUSTOMIZATION</h4>
          <p>All menu items, camera waypoints, lighting, and 3D models are controlled from <code>src/config.js</code>.</p>
        </div>
      </div>
    `
  },
  {
    id: 'operations',
    title: 'Carcyclopedia',
    subtitle: 'Projects & Photo',
    kicker: 'OPERATIONS • FEATURED WORK',
    objectName: 'prop_operations',
    tooltip: 'Examine Framed Family Photograph & Lamp',
    cameraPos: { x: 0.04, y: 1.18, z: 0.36 },
    cameraTarget: { x: 0.04, y: 0.92, z: -0.28 },
    content: `
      <p>
        Featured projects, case studies, and interactive builds:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>01. MAFIA 1 OFFICE (THREE.JS)</h4>
          <p>Interactive 1930s office scene with photorealistic M1911 GLTF models, typewriter, and Vladimir Šimůnek's orchestral Main Theme.</p>
        </div>
        <div class="dossier-item">
          <h4>02. YOUR NEXT PROJECT</h4>
          <p>Update <code>SECTIONS</code> in <code>src/config.js</code> with your live links and GitHub repositories.</p>
        </div>
      </div>
    `
  },
  {
    id: 'telegram',
    title: 'Options / Credits',
    subtitle: 'Rotary Telephone',
    kicker: 'DIRECT LINE • CONTACT',
    objectName: 'prop_telegram',
    tooltip: 'Use Vintage Black Rotary Telephone',
    cameraPos: { x: 0.68, y: 1.24, z: 0.34 },
    cameraTarget: { x: 0.76, y: 0.88, z: -0.22 },
    content: `
      <p>
        Pick up the black Bakelite rotary telephone on the corner of the desk to get in touch:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>DIRECT WIRE (EMAIL)</h4>
          <p>your.name@example.com</p>
        </div>
        <div class="dossier-item">
          <h4>LINKS</h4>
          <p>GitHub: github.com/Hak0453 • LinkedIn • X / Twitter</p>
        </div>
      </div>
    `
  }
];
