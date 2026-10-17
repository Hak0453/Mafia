/**
 * AUTHENTIC MAFIA: THE CITY OF LOST HEAVEN (2002) DESK SCENE
 * ----------------------------------------------------------
 * Recreates the exact table and props from the Mafia 1 Main Menu video
 * (https://www.youtube.com/watch?v=e7XH-nSMXYM):
 * - Warm honey-oak wooden desk surface with rich wood grain
 * - TWO Colt M1911 semi-automatic pistols lying in the center/foreground
 *   (gunmetal-bronze slides, silver ejection port, trigger guard, hammer, checkered walnut grips)
 * - Round mottled stone ashtray on the right with a thick brown cigar & white ash tip
 * - Leather teardrop keychain fob ("LH" medallion) + metal notched key on split ring
 * - Folded Lost Heaven street map on the left
 * - Green mushroom-dome table lamp with mottled turquoise ceramic base
 * - Vintage black rotary telephone with brass front tag & glowing rotary dial
 * - Sepia 1930s mobster family photograph propped near the lamp
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CUSTOM_MODELS } from '../config.js';
import {
  createHoneyWoodTexture,
  createPistolGripTexture,
  createMottledAshtrayTexture,
  createLostHeavenMapTexture,
  createKeyFobMedallionTexture,
  createSepiaGangPhotoTexture,
  createTurquoiseCeramicTexture
} from './Textures.js';

export class Room {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.interactiveGroups = new Map();
    this.gltfLoader = new GLTFLoader();

    // Generate procedural canvas textures matching the video
    this.woodTex = createHoneyWoodTexture();
    this.gripTex = createPistolGripTexture();
    this.ashtrayTex = createMottledAshtrayTexture();
    this.mapTex = createLostHeavenMapTexture();
    this.medallionTex = createKeyFobMedallionTexture();
    this.photoTex = createSepiaGangPhotoTexture();
    this.ceramicTex = createTurquoiseCeramicTexture();

    this.buildRoomAndDesk();
    this.buildGreenDomeLamp();
    this.buildAshtrayAndCigar();
    this.buildTwinM1911Pistols();
    this.buildMapAndKeychain();
    this.buildRotaryTelephone();
    this.buildSepiaGangPhoto();

    this.scene.add(this.root);
    this.loadConfiguredCustomModels();
  }

  buildRoomAndDesk() {
    // Warm muted plaster back wall (seen in 2.jpg behind the green dome lamp)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x6e6552,
      roughness: 0.92
    });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
    backWall.position.set(0, 2.5, -0.95);
    backWall.receiveShadow = true;
    this.root.add(backWall);

    // Honey-oak tabletop matching the exact golden-brown wood in maxres.jpg
    const deskMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      roughness: 0.46,
      metalness: 0.06
    });

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 2.1), deskMat);
    deskTop.position.set(0, 0.74, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    this.root.add(deskTop);

    // Front/side dark wood skirt
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x3d200e,
      roughness: 0.65
    });
    const deskBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.68, 1.9), baseMat);
    deskBase.position.set(0, 0.34, 0);
    deskBase.receiveShadow = true;
    this.root.add(deskBase);
  }

  /**
   * Green Mushroom-Dome Lamp with Mottled Turquoise Ceramic Base (seen in 2.jpg & top of maxres.jpg)
   */
  buildGreenDomeLamp() {
    const group = new THREE.Group();
    group.name = 'prop_lamp';
    group.position.set(-0.26, 0.8, -0.46);

    // Mottled turquoise-green ceramic base
    const baseMat = new THREE.MeshStandardMaterial({
      map: this.ceramicTex,
      roughness: 0.32,
      metalness: 0.12
    });
    const base = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 20), baseMat);
    base.scale.set(1.0, 0.62, 1.0);
    base.position.y = 0.09;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Brass neck & finial
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb89242,
      roughness: 0.3,
      metalness: 0.85
    });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.035, 0.24, 16), brassMat);
    stem.position.y = 0.22;
    group.add(stem);

    // Iconic dark forest-green mushroom dome shade
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3828,
      roughness: 0.45,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.54),
      domeMat
    );
    dome.scale.set(1.05, 0.88, 1.05);
    dome.position.y = 0.22;
    dome.castShadow = true;
    group.add(dome);

    // Top finial cap
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), brassMat);
    finial.position.y = 0.51;
    group.add(finial);

    // Warm inner glow under the dome
    const innerGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd280 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), innerGlowMat);
    bulb.position.y = 0.26;
    group.add(bulb);

    this.root.add(group);
  }

  /**
   * Round Mottled Stone Ashtray & Thick Brown Cigar (right side of maxres.jpg)
   */
  buildAshtrayAndCigar() {
    const group = new THREE.Group();
    group.name = 'prop_ashtray';
    group.position.set(0.56, 0.8, 0.12);

    const stoneMat = new THREE.MeshStandardMaterial({
      map: this.ashtrayTex,
      roughness: 0.38,
      metalness: 0.08
    });

    // Outer thick cylinder rim of ashtray
    const outerRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.075, 36),
      stoneMat
    );
    outerRim.position.y = 0.0375;
    outerRim.castShadow = true;
    outerRim.receiveShadow = true;
    group.add(outerRim);

    // Recessed dark inner bowl
    const bowlMat = new THREE.MeshStandardMaterial({
      map: this.ashtrayTex,
      color: 0x665844,
      roughness: 0.55
    });
    const innerBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.145, 0.11, 0.02, 28),
      bowlMat
    );
    innerBowl.position.y = 0.068;
    group.add(innerBowl);

    // Thick brown cigar resting diagonally from bottom-left rim toward upper-right bowl
    const cigarGroup = new THREE.Group();
    cigarGroup.position.set(-0.03, 0.085, 0.04);
    cigarGroup.rotation.y = -1.15; // Pointing towards upper-right like in maxres.jpg

    const tobaccoMat = new THREE.MeshStandardMaterial({
      color: 0x4b2c16,
      roughness: 0.72
    });
    const cigarBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.021, 0.019, 0.31, 18),
      tobaccoMat
    );
    cigarBody.rotation.z = Math.PI / 2 - 0.08;
    cigarBody.castShadow = true;
    cigarGroup.add(cigarBody);

    // White/grey layered ash tip at the upper-right end of the cigar
    const ashMat = new THREE.MeshStandardMaterial({
      color: 0x9fa39e,
      roughness: 0.9
    });
    const ashTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.021, 0.045, 16),
      ashMat
    );
    ashTip.rotation.z = Math.PI / 2 - 0.08;
    ashTip.position.set(-0.165, 0.013, 0);
    cigarGroup.add(ashTip);

    // Subtle glowing ember core inside the ash
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xd94e1f });
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), emberMat);
    ember.position.set(-0.182, 0.014, 0);
    cigarGroup.add(ember);

    group.add(cigarGroup);

    this.smokeOrigin = new THREE.Vector3(0.59, 0.91, 0.02);
    this.root.add(group);
  }

  /**
   * Builds a detailed Colt M1911 Semi-Automatic Pistol matching maxres.jpg
   */
  createM1911Mesh() {
    const gun = new THREE.Group();

    // Worn bronze-gunmetal steel material (matching the warm reflection in maxres.jpg)
    const slideMat = new THREE.MeshStandardMaterial({
      color: 0x544537,
      roughness: 0.34,
      metalness: 0.78
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x3d332a,
      roughness: 0.4,
      metalness: 0.72
    });

    const silverSteelMat = new THREE.MeshStandardMaterial({
      color: 0x999288,
      roughness: 0.25,
      metalness: 0.88
    });

    const gripMat = new THREE.MeshStandardMaterial({
      map: this.gripTex,
      roughness: 0.62,
      metalness: 0.05
    });

    // 1. Upper Slide (long rectangular top with rounded top bevel)
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.052, 0.038), slideMat);
    slide.position.set(0.06, 0.062, 0);
    slide.castShadow = true;
    slide.receiveShadow = true;
    gun.add(slide);

    const slideTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.019, 0.368, 14),
      slideMat
    );
    slideTop.rotation.z = Math.PI / 2;
    slideTop.position.set(0.06, 0.088, 0);
    gun.add(slideTop);

    // Rear slide serrations
    for (let i = 0; i < 8; i++) {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(0.005, 0.044, 0.041),
        frameMat
      );
      groove.position.set(-0.095 + i * 0.009, 0.062, 0);
      gun.add(groove);
    }

    // 2. Silver Ejection Port / Barrel Hood
    const ejectionPort = new THREE.Mesh(
      new THREE.BoxGeometry(0.068, 0.028, 0.04),
      silverSteelMat
    );
    ejectionPort.position.set(0.015, 0.074, 0.002);
    gun.add(ejectionPort);

    // Barrel muzzle & recoil spring plug at the front
    const muzzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.011, 0.025, 14),
      silverSteelMat
    );
    muzzle.rotation.z = Math.PI / 2;
    muzzle.position.set(0.25, 0.072, 0);
    gun.add(muzzle);

    const recoilPlug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.02, 12),
      frameMat
    );
    recoilPlug.rotation.z = Math.PI / 2;
    recoilPlug.position.set(0.246, 0.048, 0);
    gun.add(recoilPlug);

    // Front & rear sights
    const frontSight = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.012, 0.008), frameMat);
    frontSight.position.set(0.228, 0.106, 0);
    gun.add(frontSight);

    const rearSight = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.014, 0.022), frameMat);
    rearSight.position.set(-0.105, 0.106, 0);
    gun.add(rearSight);

    // 3. Lower Receiver / Dust Cover Frame
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.028, 0.034), frameMat);
    receiver.position.set(0.01, 0.028, 0);
    receiver.castShadow = true;
    gun.add(receiver);

    // 4. Angled Grip Frame & Checkered Walnut Grip Panels
    const gripGroup = new THREE.Group();
    gripGroup.position.set(-0.072, -0.048, 0);
    gripGroup.rotation.z = -0.28; // Classic M1911 grip angle

    const gripFrame = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.185, 0.034), frameMat);
    gripFrame.castShadow = true;
    gripGroup.add(gripFrame);

    // Checkered walnut side panels
    const gripPanels = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.162, 0.042), gripMat);
    gripPanels.castShadow = true;
    gripGroup.add(gripPanels);

    // Magazine baseplate lip at the bottom of the grip
    const magBase = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.016, 0.036), frameMat);
    magBase.position.set(0.004, -0.098, 0);
    gripGroup.add(magBase);

    // Beavertail grip safety tang at top-rear of grip
    const beavertail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.022, 0.028), frameMat);
    beavertail.position.set(-0.036, 0.088, 0);
    beavertail.rotation.z = 0.35;
    gripGroup.add(beavertail);

    gun.add(gripGroup);

    // 5. Trigger Guard & Curved Trigger
    const guardBottom = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.01, 0.024), frameMat);
    guardBottom.position.set(0.002, -0.022, 0);
    gun.add(guardBottom);

    const guardFront = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.042, 0.024), frameMat);
    guardFront.position.set(0.036, -0.004, 0);
    guardFront.rotation.z = -0.18;
    gun.add(guardFront);

    const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.032, 0.016), silverSteelMat);
    trigger.position.set(0.0, 0.0, 0);
    trigger.rotation.z = 0.2;
    gun.add(trigger);

    // 6. Spurred Hammer at Rear of Slide
    const hammer = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.028, 0.014), silverSteelMat);
    hammer.position.set(-0.125, 0.065, 0);
    hammer.rotation.z = 0.45;
    gun.add(hammer);

    return gun;
  }

  /**
   * Places the TWO Colt M1911 Pistols right in the center/foreground of the table
   * in the exact layout of maxres.jpg!
   */
  buildTwinM1911Pistols() {
    const group = new THREE.Group();
    group.name = 'prop_arsenal';

    // Pistol 1 (Upper-Left of center, pointing upper-right toward the telephone/ashtray)
    const pistol1 = this.createM1911Mesh();
    pistol1.scale.setScalar(1.38);
    // Lay flat on its side on the table surface (y = 0.828)
    pistol1.rotation.order = 'YXZ';
    pistol1.rotation.x = -Math.PI / 2;
    pistol1.rotation.y = 0.48;
    pistol1.position.set(-0.08, 0.83, 0.02);
    group.add(pistol1);

    // Pistol 2 (Lower-Right foreground, pointing up/slightly left beside the ashtray)
    const pistol2 = this.createM1911Mesh();
    pistol2.scale.setScalar(1.38);
    pistol2.rotation.order = 'YXZ';
    pistol2.rotation.x = -Math.PI / 2;
    pistol2.rotation.y = 1.72;
    pistol2.position.set(0.18, 0.83, 0.38);
    group.add(pistol2);

    this.registerInteractiveGroup('prop_arsenal', group);
  }

  /**
   * Folded Lost Heaven City Map + Leather Keychain Fob & Key (left/bottom-left of maxres.jpg & 3.jpg)
   */
  buildMapAndKeychain() {
    const group = new THREE.Group();
    group.name = 'prop_dossier';

    // 1. Folded Lost Heaven City Map on the left side of the table
    const mapMat = new THREE.MeshStandardMaterial({
      map: this.mapTex,
      roughness: 0.82
    });
    const mapSheet = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.008, 0.56), mapMat);
    mapSheet.position.set(-0.78, 0.805, 0.14);
    mapSheet.rotation.y = 0.12;
    mapSheet.receiveShadow = true;
    group.add(mapSheet);

    // 2. Leather Keychain Fob & Notched Key (bottom-left of maxres.jpg, next to map)
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-0.43, 0.808, 0.28);
    keyGroup.rotation.y = -0.35;

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x7a4222,
      roughness: 0.62
    });
    const fob = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.01, 24), leatherMat);
    fob.scale.set(1.0, 1.0, 1.32);
    fob.castShadow = true;
    keyGroup.add(fob);

    // Cream/gold circular medallion on the leather fob
    const medallionMat = new THREE.MeshStandardMaterial({
      map: this.medallionTex,
      roughness: 0.4
    });
    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.012, 24),
      medallionMat
    );
    medallion.position.set(0, 0.002, -0.012);
    keyGroup.add(medallion);

    // Silver split key-ring
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xb0aba0,
      roughness: 0.25,
      metalness: 0.88
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.004, 10, 24), silverMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.01, 0.004, 0.095);
    keyGroup.add(ring);

    // Metal key head & notched blade
    const keyHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 0.008, 6),
      silverMat
    );
    keyHead.position.set(0.025, 0.004, 0.14);
    keyHead.castShadow = true;
    keyGroup.add(keyHead);

    const keyBlade = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.006, 0.12), silverMat);
    keyBlade.position.set(0.042, 0.004, 0.21);
    keyBlade.rotation.y = 0.24;
    keyBlade.castShadow = true;
    keyGroup.add(keyBlade);

    group.add(keyGroup);

    this.registerInteractiveGroup('prop_dossier', group);
  }

  /**
   * Black Vintage 1930s Rotary Telephone (top-right of maxres.jpg & 2.jpg)
   */
  buildRotaryTelephone() {
    const group = new THREE.Group();
    group.name = 'prop_telegram';
    group.position.set(0.32, 0.8, -0.34);
    group.rotation.y = -0.48;

    const bakeliteMat = new THREE.MeshStandardMaterial({
      color: 0x0e100f,
      roughness: 0.22,
      metalness: 0.35
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb58342,
      roughness: 0.32,
      metalness: 0.82
    });
    const dialFaceMat = new THREE.MeshStandardMaterial({
      color: 0xf5e2a8,
      emissive: 0x6e5420,
      emissiveIntensity: 0.45,
      roughness: 0.3
    });

    // Lower rectangular base with rounded bevel look
    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.09, 0.32), bakeliteMat);
    baseBox.position.y = 0.045;
    baseBox.castShadow = true;
    baseBox.receiveShadow = true;
    group.add(baseBox);

    // Sloped upper body
    const upperBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.21, 0.13, 4),
      bakeliteMat
    );
    upperBody.rotation.y = Math.PI / 4;
    upperBody.position.set(0, 0.13, -0.01);
    upperBody.castShadow = true;
    group.add(upperBody);

    // Small rectangular copper/brass plate on the front edge (visible in maxres.jpg!)
    const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.032, 0.008), brassMat);
    frontPlate.position.set(0, 0.042, 0.162);
    group.add(frontPlate);

    // Glowing cream/gold rotary dial wheel on the sloped front
    const dialGroup = new THREE.Group();
    dialGroup.position.set(0, 0.135, 0.11);
    dialGroup.rotation.x = 0.68;

    const dialWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.082, 0.082, 0.014, 24),
      dialFaceMat
    );
    dialGroup.add(dialWheel);

    const dialCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.018, 16),
      bakeliteMat
    );
    dialGroup.add(dialCenter);

    // Finger holes around the rotary dial
    for (let i = 0; i < 8; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.4;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.011, 0.019, 10),
        bakeliteMat
      );
      hole.position.set(Math.cos(angle) * 0.054, 0, Math.sin(angle) * 0.054);
      dialGroup.add(hole);
    }
    group.add(dialGroup);

    // Handset resting on the cradle
    const handsetBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.34, 14),
      bakeliteMat
    );
    handsetBar.rotation.z = Math.PI / 2;
    handsetBar.position.set(0, 0.23, -0.02);
    handsetBar.castShadow = true;
    group.add(handsetBar);

    const leftEar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.035, 0.06, 16),
      bakeliteMat
    );
    leftEar.position.set(-0.15, 0.205, -0.02);
    group.add(leftEar);

    const rightMouth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.035, 0.06, 16),
      bakeliteMat
    );
    rightMouth.position.set(0.15, 0.205, -0.02);
    group.add(rightMouth);

    this.registerInteractiveGroup('prop_telegram', group);
  }

  /**
   * Sepia 1930s Gang Photograph propped on the left side of the desk (seen in 2.jpg)
   */
  buildSepiaGangPhoto() {
    const group = new THREE.Group();
    group.name = 'prop_operations';
    group.position.set(-0.74, 0.96, -0.42);
    group.rotation.y = 0.22;
    group.rotation.x = -0.18;

    const photoMat = new THREE.MeshStandardMaterial({
      map: this.photoTex,
      roughness: 0.55
    });
    const backingMat = new THREE.MeshStandardMaterial({
      color: 0x2b1d12,
      roughness: 0.8
    });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.015), backingMat);
    frame.castShadow = true;
    group.add(frame);

    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.32), photoMat);
    photo.position.z = 0.009;
    group.add(photo);

    this.registerInteractiveGroup('prop_operations', group);
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

  setHoveredProp(objectName) {
    this.interactiveGroups.forEach((group, name) => {
      const isHovered = name === objectName;
      group.traverse((child) => {
        if (child.isMesh && child.material && 'emissive' in child.material) {
          if (!child.userData.baseEmissive) {
            child.userData.baseEmissive = child.material.emissive.clone();
          }
          if (isHovered) {
            child.material.emissive.setHex(0x3a200c);
          } else {
            child.material.emissive.copy(child.userData.baseEmissive);
          }
        }
      });
    });
  }

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
          while (targetGroup.children.length > 0) {
            targetGroup.remove(targetGroup.children[0]);
          }
          const model = gltf.scene;
          model.scale.setScalar(cfg.scale ?? 1.0);
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
            `[Mafia Scene] Could not load custom model "${cfg.modelPath}" for "${key}".`,
            err
          );
        }
      );
    });
  }
}
