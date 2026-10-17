/**
 * 1930s MAFIA OFFICE ROOM & INTERACTIVE DESK PROPS
 * ------------------------------------------------
 * Builds the 1930s detective/mobster back-office scene:
 * - Mahogany executive desk, wooden floor, wood-paneled walls, Venetian blinds window
 * - Green glass banker's lamp & ashtray with glowing cigarette
 * - 4 Interactive prop groups mapped to SECTIONS in `src/config.js`:
 *   1. `prop_dossier`: Manila folder, classified stamp, vintage paper sheets
 *   2. `prop_operations`: Framed investigation pinboard on the wall with pinned maps/notes & red string
 *   3. `prop_arsenal`: 1930s dark Fedora hat with crimson band, gold pocket watch, and revolver silhouette
 *   4. `prop_telegram`: Vintage black rotary telephone & telegram pad
 *
 * Also supports replacing any procedural prop with a custom `.glb` model via `CUSTOM_MODELS` in `src/config.js`.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CUSTOM_MODELS } from '../config.js';

export class Room {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.interactiveGroups = new Map(); // objectName -> THREE.Group
    this.gltfLoader = new GLTFLoader();

    this.buildArchitecture();
    this.buildDesk();
    this.buildBankersLamp();
    this.buildAshtrayAndCigar();

    // Interactive section props
    this.buildDossierProp();
    this.buildOperationsBoardProp();
    this.buildArsenalProp();
    this.buildTelegramPhoneProp();

    this.scene.add(this.root);
    this.loadConfiguredCustomModels();
  }

  buildArchitecture() {
    // Dark hardwood floor
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a110b,
      roughness: 0.75,
      metalness: 0.08
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.root.add(floor);

    // Back wall (dark olive/charcoal wallpaper + mahogany wainscoting)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x161412,
      roughness: 0.9
    });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), wallMat);
    backWall.position.set(0, 3.5, -1.55);
    backWall.receiveShadow = true;
    this.root.add(backWall);

    // Wood wainscoting panel on back wall
    const wainscotMat = new THREE.MeshStandardMaterial({
      color: 0x24150e,
      roughness: 0.65
    });
    const wainscot = new THREE.Mesh(new THREE.BoxGeometry(14, 1.35, 0.06), wainscotMat);
    wainscot.position.set(0, 0.675, -1.52);
    wainscot.receiveShadow = true;
    this.root.add(wainscot);

    // Left wall with Venetian blinds window frame
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.2, 3.5, 0);
    leftWall.receiveShadow = true;
    this.root.add(leftWall);

    // Window glow & Venetian blind slats on the left wall
    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: 0x5c7d99,
      transparent: true,
      opacity: 0.32
    });
    const windowPane = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.2), windowGlowMat);
    windowPane.rotation.y = Math.PI / 2;
    windowPane.position.set(-3.16, 2.45, -0.35);
    this.root.add(windowPane);

    const slatMat = new THREE.MeshStandardMaterial({ color: 0x120d0a, roughness: 0.8 });
    for (let i = 0; i < 14; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 1.82), slatMat);
      slat.position.set(-3.13, 1.48 + i * 0.14, -0.35);
      slat.rotation.z = 0.25;
      slat.castShadow = true;
      this.root.add(slat);
    }
  }

  buildDesk() {
    const deskGroup = new THREE.Group();

    const mahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x2d170e,
      roughness: 0.42,
      metalness: 0.12
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x141d17,
      roughness: 0.68,
      metalness: 0.05
    });

    // Main desktop slab
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.09, 1.45), mahoganyMat);
    top.position.set(0, 0.78, 0);
    top.castShadow = true;
    top.receiveShadow = true;
    deskGroup.add(top);

    // Inlaid dark-green/black desk blotter pad
    const blotter = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.012, 0.76), leatherMat);
    blotter.position.set(-0.05, 0.828, 0.05);
    blotter.receiveShadow = true;
    deskGroup.add(blotter);

    // Left and right desk pedestals
    const leftPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.76, 1.32), mahoganyMat);
    leftPedestal.position.set(-0.95, 0.38, 0);
    leftPedestal.castShadow = true;
    leftPedestal.receiveShadow = true;
    deskGroup.add(leftPedestal);

    const rightPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.76, 1.32), mahoganyMat);
    rightPedestal.position.set(0.95, 0.38, 0);
    rightPedestal.castShadow = true;
    rightPedestal.receiveShadow = true;
    deskGroup.add(rightPedestal);

    this.root.add(deskGroup);
  }

  buildBankersLamp() {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.62, 0.825, -0.42);
    lampGroup.rotation.y = 0.38;

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc59b47,
      roughness: 0.28,
      metalness: 0.82
    });

    const emeraldShadeMat = new THREE.MeshStandardMaterial({
      color: 0x165b33,
      emissive: 0x0d3b1e,
      emissiveIntensity: 0.65,
      roughness: 0.22,
      metalness: 0.1
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.04, 24), brassMat);
    base.position.y = 0.02;
    base.castShadow = true;
    lampGroup.add(base);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.42, 16), brassMat);
    stem.position.y = 0.23;
    stem.castShadow = true;
    lampGroup.add(stem);

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.19, 0.14, 18, 1, false, 0, Math.PI),
      emeraldShadeMat
    );
    shade.rotation.z = Math.PI / 2;
    shade.rotation.y = Math.PI / 2;
    shade.position.set(0.04, 0.44, 0.05);
    shade.castShadow = true;
    lampGroup.add(shade);

    // Warm glowing bulb core inside shade
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffcf77 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), bulbMat);
    bulb.position.set(0.04, 0.4, 0.05);
    lampGroup.add(bulb);

    this.root.add(lampGroup);
  }

  buildAshtrayAndCigar() {
    const ashGroup = new THREE.Group();
    ashGroup.position.set(0.36, 0.825, 0.25);

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x2b2623,
      roughness: 0.2,
      metalness: 0.35
    });

    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.032, 20), glassMat);
    tray.position.y = 0.016;
    tray.castShadow = true;
    tray.receiveShadow = true;
    ashGroup.add(tray);

    // Resting cigarette/cigar with glowing ember tip
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xdcd2c0, roughness: 0.8 });
    const cig = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 12), paperMat);
    cig.rotation.z = Math.PI / 2 - 0.12;
    cig.rotation.y = 0.45;
    cig.position.set(-0.02, 0.036, 0.01);
    ashGroup.add(cig);

    const emberMat = new THREE.MeshBasicMaterial({ color: 0xff4518 });
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 10), emberMat);
    ember.position.set(0.032, 0.042, -0.015);
    ashGroup.add(ember);

    this.emberMesh = ember;
    this.smokeOrigin = new THREE.Vector3(0.39, 0.87, 0.235);
    this.root.add(ashGroup);
  }

  /**
   * 1. DOSSIER PROP (Center desk: Manila Folder, Classified Stamp, Typed Sheet)
   */
  buildDossierProp() {
    const group = new THREE.Group();
    group.name = 'prop_dossier';
    group.position.set(-0.08, 0.835, 0.04);

    const folderMat = new THREE.MeshStandardMaterial({
      color: 0xc8a974,
      roughness: 0.78
    });
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xefe6d5,
      roughness: 0.85
    });
    const crimsonStampMat = new THREE.MeshStandardMaterial({
      color: 0x9e1b1b,
      roughness: 0.6
    });

    const folder = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.014, 0.34), folderMat);
    folder.rotation.y = -0.08;
    folder.castShadow = true;
    folder.receiveShadow = true;
    group.add(folder);

    const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.008, 0.28), paperMat);
    sheet.position.set(0.02, 0.01, -0.01);
    sheet.rotation.y = 0.06;
    sheet.receiveShadow = true;
    group.add(sheet);

    const redStripe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.01, 0.035), crimsonStampMat);
    redStripe.position.set(-0.08, 0.013, -0.06);
    redStripe.rotation.y = 0.06;
    group.add(redStripe);

    // Fountain pen next to the dossier
    const penMat = new THREE.MeshStandardMaterial({
      color: 0x181310,
      roughness: 0.25,
      metalness: 0.6
    });
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.005, 0.22, 12), penMat);
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.32;
    pen.position.set(0.24, 0.012, 0.05);
    pen.castShadow = true;
    group.add(pen);

    this.registerInteractiveGroup('prop_dossier', group);
  }

  /**
   * 2. OPERATIONS PROP (Back wall: Framed Investigation Pinboard & City Map)
   */
  buildOperationsBoardProp() {
    const group = new THREE.Group();
    group.name = 'prop_operations';
    group.position.set(0.55, 1.92, -1.48);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2c160d,
      roughness: 0.55
    });
    const corkMat = new THREE.MeshStandardMaterial({
      color: 0x5c3e26,
      roughness: 0.92
    });
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0xe3d5bc,
      roughness: 0.85
    });
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xcc2929,
      roughness: 0.4
    });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.02, 0.05), frameMat);
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);

    const cork = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.88, 0.06), corkMat);
    cork.position.z = 0.01;
    cork.receiveShadow = true;
    group.add(cork);

    // Pinned intelligence cards & photos on the board
    const cardOffsets = [
      { x: -0.42, y: 0.16, w: 0.34, h: 0.26, rot: 0.04 },
      { x: 0.02, y: 0.14, w: 0.42, h: 0.3, rot: -0.03 },
      { x: 0.44, y: 0.18, w: 0.3, h: 0.24, rot: 0.05 },
      { x: -0.25, y: -0.2, w: 0.38, h: 0.24, rot: -0.05 },
      { x: 0.28, y: -0.18, w: 0.36, h: 0.26, rot: 0.02 }
    ];

    cardOffsets.forEach((c) => {
      const card = new THREE.Mesh(new THREE.BoxGeometry(c.w, c.h, 0.01), cardMat);
      card.position.set(c.x, c.y, 0.042);
      card.rotation.z = c.rot;
      group.add(card);

      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 10), pinMat);
      pin.position.set(c.x, c.y + c.h * 0.36, 0.052);
      group.add(pin);
    });

    this.registerInteractiveGroup('prop_operations', group);
  }

  /**
   * 3. ARSENAL PROP (Right desk: 1930s Fedora Hat, Gold Pocket Watch & Revolver)
   */
  buildArsenalProp() {
    const group = new THREE.Group();
    group.name = 'prop_arsenal';
    group.position.set(0.84, 0.83, -0.12);

    // Dark charcoal Fedora hat
    const feltMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.85
    });
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x7d1919,
      roughness: 0.55
    });

    const fedoraGroup = new THREE.Group();
    fedoraGroup.position.set(0.05, 0.02, -0.12);
    fedoraGroup.rotation.set(0.08, -0.42, -0.05);

    // Brim
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.018, 28), feltMat);
    brim.scale.set(1.0, 1.0, 1.18);
    brim.castShadow = true;
    brim.receiveShadow = true;
    fedoraGroup.add(brim);

    // Crown
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.175, 0.16, 24), feltMat);
    crown.position.y = 0.085;
    crown.scale.set(0.95, 1.0, 1.12);
    crown.castShadow = true;
    fedoraGroup.add(crown);

    // Crimson silk hat band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.176, 0.032, 24), ribbonMat);
    band.position.y = 0.026;
    band.scale.set(0.96, 1.0, 1.13);
    fedoraGroup.add(band);

    group.add(fedoraGroup);

    // Vintage Gold Pocket Watch
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4aa50,
      roughness: 0.25,
      metalness: 0.88
    });
    const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 20), goldMat);
    watch.position.set(-0.18, 0.012, 0.18);
    watch.castShadow = true;
    group.add(watch);

    // Stylized 1930s Snub-Nose Revolver on the desk corner
    const gunMetalMat = new THREE.MeshStandardMaterial({
      color: 0x25282c,
      roughness: 0.32,
      metalness: 0.85
    });
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x3b1e12,
      roughness: 0.65
    });

    const revolver = new THREE.Group();
    revolver.position.set(0.02, 0.025, 0.24);
    revolver.rotation.y = 0.55;
    revolver.rotation.x = Math.PI / 2;

    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.032, 0.026), gunMetalMat);
    barrel.position.set(-0.06, 0, 0);
    barrel.castShadow = true;
    revolver.add(barrel);

    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.055, 12),
      gunMetalMat
    );
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.set(0.02, -0.008, 0);
    cylinder.castShadow = true;
    revolver.add(cylinder);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.1, 0.028), gripMat);
    grip.position.set(0.075, -0.045, 0);
    grip.rotation.z = -0.38;
    grip.castShadow = true;
    revolver.add(grip);

    group.add(revolver);

    this.registerInteractiveGroup('prop_arsenal', group);
  }

  /**
   * 4. TELEGRAM PROP (Left desk: Vintage 1930s Black Rotary Telephone & Notepad)
   */
  buildTelegramPhoneProp() {
    const group = new THREE.Group();
    group.name = 'prop_telegram';
    group.position.set(-0.82, 0.83, -0.05);
    group.rotation.y = 0.28;

    const bakeliteMat = new THREE.MeshStandardMaterial({
      color: 0x141312,
      roughness: 0.26,
      metalness: 0.4
    });
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0xe6dac3,
      roughness: 0.5
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc59b47,
      roughness: 0.3,
      metalness: 0.8
    });

    // Phone base pyramid/box
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.11, 4), bakeliteMat);
    base.rotation.y = Math.PI / 4;
    base.position.y = 0.055;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Rotary dial plate
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.012, 20), dialMat);
    dial.position.set(0, 0.095, 0.065);
    dial.rotation.x = 0.52;
    group.add(dial);

    // Cradle prongs
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.04), brassMat);
    cradle.position.set(0, 0.125, 0);
    group.add(cradle);

    // Handset bar + ear/mouth bells
    const handsetBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.26, 12),
      bakeliteMat
    );
    handsetBar.rotation.z = Math.PI / 2;
    handsetBar.position.set(0, 0.15, 0);
    handsetBar.castShadow = true;
    group.add(handsetBar);

    const leftBell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.026, 0.045, 16),
      bakeliteMat
    );
    leftBell.position.set(-0.12, 0.132, 0);
    leftBell.castShadow = true;
    group.add(leftBell);

    const rightBell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.026, 0.045, 16),
      bakeliteMat
    );
    rightBell.position.set(0.12, 0.132, 0);
    rightBell.castShadow = true;
    group.add(rightBell);

    this.registerInteractiveGroup('prop_telegram', group);
  }

  registerInteractiveGroup(name, group) {
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.interactiveParent = name;
      }
    });
    this.interactiveGroups.set(name, group);
    this.root.add(group);
  }

  /**
   * Highlights or un-highlights a 3D prop group on pointer hover
   */
  setHoveredProp(objectName) {
    this.interactiveGroups.forEach((group, name) => {
      const isHovered = name === objectName;
      group.traverse((child) => {
        if (child.isMesh && child.material && 'emissive' in child.material) {
          if (!child.userData.baseEmissive) {
            child.userData.baseEmissive = child.material.emissive.clone();
          }
          if (isHovered) {
            child.material.emissive.setHex(0x3d1c0a);
          } else {
            child.material.emissive.copy(child.userData.baseEmissive);
          }
        }
      });
    });
  }

  /**
   * Optional GLB loader: if `CUSTOM_MODELS` in `src/config.js` specifies a `modelPath`,
   * loads the `.glb` and replaces the procedural children inside that interactive group.
   */
  loadConfiguredCustomModels() {
    const mapping = {
      dossier: 'prop_dossier',
      operations: 'prop_operations',
      arsenal: 'prop_arsenal',
      telegram: 'prop_telegram'
    };

    Object.entries(CUSTOM_MODELS).forEach(([key, cfg]) => {
      if (!cfg || !cfg.modelPath) return;
      const groupName = mapping[key];
      const targetGroup = this.interactiveGroups.get(groupName);
      if (!targetGroup) return;

      this.gltfLoader.load(
        cfg.modelPath,
        (gltf) => {
          // Clear procedural meshes and insert custom GLB
          while (targetGroup.children.length > 0) {
            targetGroup.remove(targetGroup.children[0]);
          }
          const model = gltf.scene;
          const scale = cfg.scale ?? 1.0;
          model.scale.setScalar(scale);
          if (cfg.positionOffset) {
            model.position.set(
              cfg.positionOffset.x || 0,
              cfg.positionOffset.y || 0,
              cfg.positionOffset.z || 0
            );
          }
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.userData.interactiveParent = groupName;
            }
          });
          targetGroup.add(model);
        },
        undefined,
        (err) => {
          console.warn(
            `[Mafia Scene] Could not load custom model "${cfg.modelPath}" for "${key}". Keeping procedural prop.`,
            err
          );
        }
      );
    });
  }
}
