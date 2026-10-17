/**
 * CENTRAL CONFIGURATION — MAFIA 1 PERSONAL SITE SKELETON
 * ------------------------------------------------------
 * Recreates the exact look, camera framing, props, and Vladimir Simunek orchestral
 * soundtrack of Mafia: The City of Lost Heaven (2002) Main Menu
 * (https://www.youtube.com/watch?v=e7XH-nSMXYM)
 */

export const SITE_META = {
  title: 'Main Menu:',
  subtitle: 'THE CITY OF LOST HEAVEN',
  // Plays the real Mafia: The City of Lost Heaven Main Theme (Vladimir Simunek) from public/audio/theme.mp3
  customAudioUrl: '/audio/theme.mp3'
};

export const THEME = {
  backgroundColor: 0x261c14,
  fogColor: 0x261c14,
  fogDensity: 0.04,

  // Warm golden table lamp light illuminating the honey-oak wood & M1911 pistols
  lampLight: {
    color: 0xffd699,
    intensity: 6.5,
    distance: 10,
    decay: 1.2,
    flickerAmount: 0.06
  },

  // Warm overhead/front room light so the wood grain & gunmetal shine clearly like in the video
  windowLight: {
    color: 0xfff0d6,
    intensity: 2.8,
    position: { x: 0.6, y: 2.8, z: 1.6 }
  },

  fillLight: {
    color: 0xffc580,
    intensity: 1.8
  },

  ambientLight: {
    color: 0x8a6d52,
    intensity: 1.75
  }
};

export const CUSTOM_MODELS = {
  dossier: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  operations: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  arsenal: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } },
  telegram: { modelPath: null, scale: 1.0, positionOffset: { x: 0, y: 0, z: 0 } }
};

/**
 * MENU SECTIONS & CAMERA WAYPOINTS
 * Default `overview` matches the exact main menu frame from the YouTube video:
 * looking down at the two Colt M1911 pistols, the cigar ashtray on the right,
 * the LH leather keychain & map on the left, the green dome lamp top-left, and the rotary phone top-right.
 */
export const SECTIONS = [
  {
    id: 'overview',
    title: 'Main Desk',
    subtitle: 'Overview',
    kicker: 'SALIERI BAR • BACK ROOM',
    objectName: null,
    cameraPos: { x: 0.06, y: 1.54, z: 0.68 },
    cameraTarget: { x: 0.04, y: 0.82, z: 0.04 },
    content: null
  },
  {
    id: 'lamp_intro',
    title: 'Intro',
    subtitle: 'Green Lamp & Photo',
    kicker: '1930 • LOST HEAVEN CHRONICLES',
    objectName: 'prop_lamp',
    tooltip: 'Green Dome Lamp & Family Photo',
    // Matches frame 2.jpg from the video (front view of the green dome lamp, gang photo on left, phone on right)
    cameraPos: { x: -0.22, y: 1.18, z: 0.42 },
    cameraTarget: { x: -0.24, y: 0.98, z: -0.45 },
    content: `
      <p>
        <strong>Welcome to Lost Heaven (1930).</strong> This interactive 3D scene recreates the iconic
        <em>Mafia: The City of Lost Heaven</em> main menu desk, complete with Vladimír Šimůnek's
        original orchestral Main Theme.
      </p>
      <p>
        Click any item on the crumpled paper menu on the left—or click the <strong>Colt M1911 pistols,
        leather keychain, city map, sepia gang photo, or rotary telephone</strong> directly on the
        table—to smoothly pan the camera across the desk.
      </p>
      <div class="tag-list">
        <span class="noir-tag">THREE.JS</span>
        <span class="noir-tag">GSAP CAMERA</span>
        <span class="noir-tag">MAFIA 1 (2002)</span>
      </div>
    `
  },
  {
    id: 'arsenal',
    title: 'New Game',
    subtitle: 'Twin M1911s & Cigar',
    kicker: 'ARSENAL • SKILLS & TECH',
    objectName: 'prop_arsenal',
    tooltip: 'Inspect Twin Colt M1911 Pistols & Cigar Ashtray',
    cameraPos: { x: 0.12, y: 1.32, z: 0.54 },
    cameraTarget: { x: 0.14, y: 0.82, z: 0.16 },
    content: `
      <p>
        Two Colt M1911 semi-automatic sidearms resting on the honey-oak desk alongside a smoldering cigar.
        Customize this section in <code>src/config.js</code> with your core technical arsenal:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>3D &amp; INTERACTIVE GRAPHICS</h4>
          <p>Three.js, WebGL, GLSL Shaders, Procedural Texturing, Blender, GSAP Camera Choreography</p>
        </div>
        <div class="dossier-item">
          <h4>FULL-STACK ENGINEERING</h4>
          <p>JavaScript / TypeScript, React, Next.js, Node.js, High-Performance Web Architecture</p>
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
    kicker: 'DOSSIER • ABOUT & TERRITORY',
    objectName: 'prop_dossier',
    tooltip: 'Inspect Lost Heaven Map & LH Keychain',
    cameraPos: { x: -0.52, y: 1.34, z: 0.56 },
    cameraTarget: { x: -0.56, y: 0.82, z: 0.18 },
    content: `
      <p>
        The folded street map of Lost Heaven and brass-medallion leather key fob. Use this section
        for your personal bio, background, and career timeline.
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>TERRITORY &amp; BACKGROUND</h4>
          <p>Creative Developer &amp; Engineer building atmospheric 3D web experiences and modern applications.</p>
        </div>
        <div class="dossier-item">
          <h4>EASY CUSTOMIZATION</h4>
          <p>Open <code>src/config.js</code> to edit menu labels, HTML cards, lighting, or drop custom <code>.glb</code> models into <code>public/models/</code>.</p>
        </div>
      </div>
    `
  },
  {
    id: 'operations',
    title: 'Carcyclopedia',
    subtitle: 'Projects & Crew Photo',
    kicker: 'OPERATIONS • FEATURED WORK',
    objectName: 'prop_operations',
    tooltip: 'Examine 1930s Family Photograph',
    cameraPos: { x: -0.62, y: 1.15, z: 0.14 },
    cameraTarget: { x: -0.74, y: 0.96, z: -0.42 },
    content: `
      <p>
        Featured projects, case studies, and operations from the archive:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>01. LOST HEAVEN 3D MENU</h4>
          <p>Faithful Three.js recreation of the 2002 Mafia main menu desk with twin M1911s, cigar smoke, and original soundtrack.</p>
        </div>
        <div class="dossier-item">
          <h4>02. ADD YOUR NEXT PROJECT</h4>
          <p>Edit the <code>SECTIONS</code> array in <code>src/config.js</code> to link your GitHub repos and live demos.</p>
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
    cameraPos: { x: 0.36, y: 1.24, z: 0.28 },
    cameraTarget: { x: 0.32, y: 0.9, z: -0.34 },
    content: `
      <p>
        Pick up the black rotary line on the corner of the desk to get in touch directly:
      </p>
      <div class="dossier-grid">
        <div class="dossier-item">
          <h4>DIRECT WIRE (EMAIL)</h4>
          <p>your.name@example.com</p>
        </div>
        <div class="dossier-item">
          <h4>PROFILES &amp; LINKS</h4>
          <p>GitHub: github.com/Hak0453 • LinkedIn • X / Twitter</p>
        </div>
      </div>
    `
  }
];
