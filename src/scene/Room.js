/**
 * AUTHENTIC MAFIA: THE CITY OF LOST HEAVEN (2002) ROOM & DESK SCENE
 * -----------------------------------------------------------------
 * Replicates the exact room view from the uploaded Mafia 1 screenshot:
 * - High-angle room perspective showing the full honey-oak desk, hardwood plank floor,
 *   aged olive-grey plaster wall with 3 vintage pin-up posters & 1 B&W car photo
 * - Pulled-out wooden desk chair with burnt-orange/red upholstered cushion in foreground
 * - Left glass-door bookcase/cabinet, gold trophy cup on mahogany plinth, and printed
 *   cardboard shipping box ("PLEASE HANDLE / PICK UP") on the floor
 * - Right-side round slatted wastebasket (trash bin) on the floor
 * - Photorealistic Poly Haven GLTF 3D models on the desk:
 *   * Twin Colt M1911 Service Pistols (`service_pistol.gltf`) + standing .45 bullet on map
 *   * Vintage Pocket Watch (`vintage_pocket_watch.gltf`)
 *   * Standing Picture Frame (`standing_picture_frame_01.gltf`) with sepia gang photo
 *   * Ornate Brass Trophy Goblet (`brass_goblets.gltf`)
 * - Detailed sculpted 1930s Typewriter (42 round silver-ringed keys, dual ribbon spools, platen roller),
 *   Lathe-sculpted Green Mushroom-Dome Lamp, Bakelite Rotary Telephone, Lathe-carved Stone Ashtray & Cigar,
 *   Folded Lost Heaven Map, and Leather Keychain Fob & Key.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CUSTOM_MODELS } from '../config.js';
import {
  createHoneyWoodTexture,
  createHardwoodFloorTexture,
  createPlasterWallTexture,
  createChairCushionTexture,
  createCardboardBoxTexture,
  createWallPosterTexture,
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

    // High-res procedural & canvas textures
    this.woodTex = createHoneyWoodTexture();
    this.floorTex = createHardwoodFloorTexture();
    this.wallTex = createPlasterWallTexture();
    this.cushionTex = createChairCushionTexture();
    this.boxTex = createCardboardBoxTexture();
    this.ashtrayTex = createMottledAshtrayTexture();
    this.mapTex = createLostHeavenMapTexture();
    this.medallionTex = createKeyFobMedallionTexture();
    this.photoTex = createSepiaGangPhotoTexture();
    this.ceramicTex = createTurquoiseCeramicTexture();

    this.buildRoomArchitecture();
    this.buildWallPosters();
    this.buildLeftCabinetAndCardboardBox();
    this.buildDesk();
    this.buildDeskChair();
    this.buildWastebasket();

    // Desk props (matching the exact left-to-right layout of the screenshot)
    this.buildTypewriterAndPencilCup();
    this.buildPocketWatchAndPen();
    this.buildGangPhotoFrame();
    this.buildGreenDomeLamp();
    this.buildMapAndKeychain();
    this.buildTwinM1911Pistols();
    this.buildAshtrayAndCigar();
    this.buildRotaryTelephone();

    this.scene.add(this.root);
    this.loadConfiguredCustomModels();
  }

  /**
   * 1. Room Floor, Back Plaster Wall, Baseboard & Left Wall
   */
  buildRoomArchitecture() {
    // Hardwood plank floor
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.floorTex,
      roughness: 0.68,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.root.add(floor);

    // Back olive-grey plaster wall (angled slightly or flush behind the desk)
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.wallTex,
      roughness: 0.92
    });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5.5), wallMat);
    backWall.position.set(0, 2.75, -0.68);
    backWall.receiveShadow = true;
    this.root.add(backWall);

    // Distressed mottled baseboard trim along bottom of back wall
    const baseboardMat = new THREE.MeshStandardMaterial({
      map: this.ashtrayTex,
      color: 0x6e5236,
      roughness: 0.78
    });
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(10, 0.16, 0.03), baseboardMat);
    baseboard.position.set(0, 0.08, -0.665);
    baseboard.receiveShadow = true;
    this.root.add(baseboard);

    // Left wall behind the bookcase
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5.5), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-1.95, 2.75, 0);
    leftWall.receiveShadow = true;
    this.root.add(leftWall);
  }

  /**
   * 2. Vintage Pin-Up Posters & B&W Car Photo on the Back Wall (matching screenshot top)
   */
  buildWallPosters() {
    const posterSpecs = [
      { x: -0.62, y: 1.72, w: 0.34, h: 0.44, rot: 0.01, variant: 0 },
      { x: -0.08, y: 1.68, w: 0.32, h: 0.44, rot: -0.01, variant: 1 },
      { x: 0.44, y: 1.74, w: 0.26, h: 0.42, rot: 0.02, variant: 2 },
      { x: 1.08, y: 1.56, w: 0.34, h: 0.28, rot: -0.02, variant: 3 } // White-bordered B&W car photo on right
    ];

    posterSpecs.forEach((p) => {
      const mat = new THREE.MeshStandardMaterial({
        map: createWallPosterTexture(p.variant),
        roughness: 0.75
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), mat);
      mesh.position.set(p.x, p.y, -0.662);
      mesh.rotation.z = p.rot;
      this.root.add(mesh);
    });
  }

  /**
   * 3. Left Bookcase / Glass Cabinet, Gold Trophy on Plinth & Cardboard Box on Floor
   */
  buildLeftCabinetAndCardboardBox() {
    const woodMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      roughness: 0.48
    });

    // Lower wooden side cabinet on the left wall
    const sideCounter = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.05, 1.6), woodMat);
    sideCounter.position.set(-1.62, 0.525, 0.35);
    sideCounter.castShadow = true;
    sideCounter.receiveShadow = true;
    this.root.add(sideCounter);

    // Tall glass-door bookcase in the foreground-left corner
    const bookcase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.1, 1.05), woodMat);
    bookcase.position.set(-1.68, 1.05, 1.38);
    bookcase.castShadow = true;
    this.root.add(bookcase);

    // Frosted greenish glass pane in the bookcase door
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x8ca69e,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });
    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.65), glassMat);
    glassPane.rotation.y = Math.PI / 2;
    glassPane.position.set(-1.39, 1.1, 1.38);
    this.root.add(glassPane);

    // Red mahogany trophy plinth on the left cabinet top + Gold Trophy Goblet
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x6b2314,
      roughness: 0.4
    });
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), plinthMat);
    plinth.position.set(-1.52, 1.13, -0.18);
    plinth.castShadow = true;
    this.root.add(plinth);

    // Load photorealistic brass goblet for the trophy cup
    this.gltfLoader.load('/models/brass_goblets/brass_goblets.gltf', (gltf) => {
      const goblet = gltf.scene.getObjectByName('brass_goblet_01') || gltf.scene.children[0];
      if (goblet) {
        const clone = goblet.clone();
        clone.position.set(-1.52, 1.21, -0.18);
        clone.scale.setScalar(1.45);
        clone.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        this.root.add(clone);
      }
    });

    // Printed Cardboard Box on the floor in the bottom-left corner ("PICK UP / PLEASE HANDLE")
    const cardBoxMat = new THREE.MeshStandardMaterial({
      map: this.boxTex,
      roughness: 0.85
    });
    const cardBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.38), cardBoxMat);
    cardBox.position.set(-1.18, 0.17, 0.78);
    cardBox.rotation.y = 0.42;
    cardBox.castShadow = true;
    cardBox.receiveShadow = true;
    this.root.add(cardBox);
  }

  /**
   * 4. Honey-Oak Executive Desk (Solid Left Side Panel + Right Square Legs, matching screenshot)
   */
  buildDesk() {
    const deskGroup = new THREE.Group();

    const deskWoodMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      roughness: 0.42,
      metalness: 0.05
    });

    // Main honey-oak tabletop slab (width 2.25, depth 1.05, height 0.78)
    const topSlab = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.055, 1.06), deskWoodMat);
    topSlab.position.set(0, 0.78, -0.12);
    topSlab.castShadow = true;
    topSlab.receiveShadow = true;
    deskGroup.add(topSlab);

    // Front apron beam under desktop
    const frontApron = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.085, 0.04), deskWoodMat);
    frontApron.position.set(0, 0.715, 0.36);
    frontApron.castShadow = true;
    deskGroup.add(frontApron);

    // Solid wooden side panel on the left side of the desk (visible behind the chair in screenshot)
    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.76, 0.98), deskWoodMat);
    leftPanel.position.set(-1.05, 0.38, -0.12);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    deskGroup.add(leftPanel);

    // Back modesty panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.52, 0.04), deskWoodMat);
    backPanel.position.set(0, 0.49, -0.58);
    backPanel.receiveShadow = true;
    deskGroup.add(backPanel);

    // Right front & right back square-tapered wooden legs
    const legGeo = new THREE.BoxGeometry(0.075, 0.76, 0.075);
    const rightFrontLeg = new THREE.Mesh(legGeo, deskWoodMat);
    rightFrontLeg.position.set(1.04, 0.38, 0.35);
    rightFrontLeg.castShadow = true;
    rightFrontLeg.receiveShadow = true;
    deskGroup.add(rightFrontLeg);

    const rightBackLeg = new THREE.Mesh(legGeo, deskWoodMat);
    rightBackLeg.position.set(1.04, 0.38, -0.58);
    rightBackLeg.castShadow = true;
    rightBackLeg.receiveShadow = true;
    deskGroup.add(rightBackLeg);

    // Side rail connecting the two right legs
    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.085, 0.94), deskWoodMat);
    rightRail.position.set(1.04, 0.715, -0.12);
    deskGroup.add(rightRail);

    this.root.add(deskGroup);
  }

  /**
   * 5. Pulled-Out Wooden Office Chair with Burnt-Orange/Red Cushion in Foreground
   */
  buildDeskChair() {
    const chair = new THREE.Group();
    chair.position.set(-0.22, 0.0, 0.62);
    chair.rotation.y = 0.65; // Angled toward the desk just like in the screenshot

    const darkWoodMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      color: 0x6e3b19,
      roughness: 0.46
    });

    const cushionMat = new THREE.MeshStandardMaterial({
      map: this.cushionTex,
      roughness: 0.68
    });

    // Rounded wooden seat frame
    const seatFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.04, 0.48),
      darkWoodMat
    );
    seatFrame.position.y = 0.44;
    seatFrame.castShadow = true;
    seatFrame.receiveShadow = true;
    chair.add(seatFrame);

    // Plush red-orange upholstered seat pad with beveled top
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.042, 0.45),
      cushionMat
    );
    cushion.position.y = 0.47;
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    chair.add(cushion);

    // 4 Cylindrical/tapered wooden chair legs
    const legCoords = [
      [-0.2, -0.2],
      [0.2, -0.2],
      [-0.2, 0.2],
      [0.2, 0.2]
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.016, 0.44, 14),
        darkWoodMat
      );
      leg.position.set(lx, 0.22, lz);
      leg.castShadow = true;
      chair.add(leg);
    });

    // Curved backrest posts & horizontal slats
    [-0.2, 0.2].forEach((bx) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.022, 0.46, 14),
        darkWoodMat
      );
      post.position.set(bx, 0.66, -0.21);
      post.rotation.x = -0.12;
      post.castShadow = true;
      chair.add(post);
    });

    // Top curved backrest bar & middle slat
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.065, 0.028), darkWoodMat);
    topBar.position.set(0, 0.85, -0.235);
    topBar.castShadow = true;
    chair.add(topBar);

    const midBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.038, 0.022), darkWoodMat);
    midBar.position.set(0, 0.66, -0.215);
    midBar.castShadow = true;
    chair.add(midBar);

    this.root.add(chair);
  }

  /**
   * 6. Round Slatted Wire/Wicker Wastebasket on the Floor to the Right of the Desk
   */
  buildWastebasket() {
    const binGroup = new THREE.Group();
    binGroup.position.set(1.38, 0.0, 0.22);

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x5c4a35,
      roughness: 0.6,
      metalness: 0.3
    });
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e1d1b,
      roughness: 0.7
    });

    // Heavy dark bottom ring
    const bottomBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.185, 0.185, 0.06, 28),
      baseMat
    );
    bottomBase.position.y = 0.03;
    bottomBase.castShadow = true;
    binGroup.add(bottomBase);

    // Top open rim ring
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.012, 12, 32), rimMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = 0.44;
    binGroup.add(topRim);

    // Middle reinforcement ring
    const midRim = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.007, 10, 28), rimMat);
    midRim.rotation.x = Math.PI / 2;
    midRim.position.y = 0.24;
    binGroup.add(midRim);

    // 28 Vertical wire/wicker ribs around the cylinder
    const numRibs = 28;
    for (let i = 0; i < numRibs; i++) {
      const angle = (i / numRibs) * Math.PI * 2;
      const rib = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.4, 8),
        rimMat
      );
      rib.position.set(Math.cos(angle) * 0.192, 0.24, Math.sin(angle) * 0.192);
      rib.rotation.z = -Math.cos(angle) * 0.045;
      rib.rotation.x = Math.sin(angle) * 0.045;
      rib.castShadow = true;
      binGroup.add(rib);
    }

    this.root.add(binGroup);
  }

  /**
   * 7. Detailed 1930s Vintage Typewriter & Pencil Cup (Left-Back of Desk)
   */
  buildTypewriterAndPencilCup() {
    const group = new THREE.Group();
    group.name = 'prop_typewriter';
    group.position.set(-0.56, 0.808, -0.25);
    group.rotation.y = 0.18; // Angled slightly toward center-front like in the screenshot

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x262423,
      roughness: 0.36,
      metalness: 0.65
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x151413,
      roughness: 0.5,
      metalness: 0.4
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc49c48,
      roughness: 0.28,
      metalness: 0.85
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xc8c4bc,
      roughness: 0.22,
      metalness: 0.88
    });

    // Lower chassis frame
    const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.34), ironMat);
    lowerChassis.position.set(0, 0.04, 0.02);
    lowerChassis.castShadow = true;
    lowerChassis.receiveShadow = true;
    group.add(lowerChassis);

    // Upper rear body housing
    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.11, 0.2), ironMat);
    upperBody.position.set(0, 0.125, -0.04);
    upperBody.castShadow = true;
    group.add(upperBody);

    // Two iconic exposed round ribbon spools on top of the typewriter (clearly visible in screenshot!)
    [-0.115, 0.115].forEach((sx) => {
      const spoolWell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052, 0.052, 0.018, 24),
        darkTrimMat
      );
      spoolWell.position.set(sx, 0.182, -0.02);
      group.add(spoolWell);

      const spoolFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.044, 0.022, 24),
        brassMat
      );
      spoolFlange.position.set(sx, 0.186, -0.02);
      group.add(spoolFlange);

      const spoolCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.026, 16),
        silverMat
      );
      spoolCore.position.set(sx, 0.188, -0.02);
      group.add(spoolCore);
    });

    // Rubber platen roller & carriage assembly across the top-back
    const platen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.44, 24),
      darkTrimMat
    );
    platen.rotation.z = Math.PI / 2;
    platen.position.set(0, 0.21, -0.11);
    platen.castShadow = true;
    group.add(platen);

    // Platen knobs on both ends
    [-0.24, 0.24].forEach((kx) => {
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.03, 18),
        darkTrimMat
      );
      knob.rotation.z = Math.PI / 2;
      knob.position.set(kx, 0.21, -0.11);
      group.add(knob);
    });

    // Angled paper guide plate behind the platen
    const paperGuide = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.09, 0.008),
      ironMat
    );
    paperGuide.position.set(0, 0.25, -0.145);
    paperGuide.rotation.x = -0.35;
    group.add(paperGuide);

    // Chrome carriage return lever on the left
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.1, 10), silverMat);
    lever.position.set(-0.2, 0.24, -0.08);
    lever.rotation.x = 0.6;
    group.add(lever);

    // Sloped keyboard recess + 4 staggered rows of round glass/silver typewriter keys!
    const keyBed = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.14), darkTrimMat);
    keyBed.position.set(0, 0.085, 0.12);
    keyBed.rotation.x = 0.38;
    group.add(keyBed);

    const keyCapMat = new THREE.MeshStandardMaterial({
      color: 0xd8ceb8,
      roughness: 0.3
    });

    for (let row = 0; row < 4; row++) {
      const numKeys = 10 - (row % 2);
      for (let col = 0; col < numKeys; col++) {
        const kx = (col - (numKeys - 1) / 2) * 0.033;
        const ky = 0.11 - row * 0.014;
        const kz = 0.075 + row * 0.03;

        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.008, 14),
          silverMat
        );
        ring.position.set(kx, ky, kz);
        group.add(ring);

        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.009, 0.009, 0.01, 12),
          keyCapMat
        );
        cap.position.set(kx, ky + 0.001, kz);
        group.add(cap);
      }
    }

    // Spacebar at bottom of keyboard
    const spacebar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.022), darkTrimMat);
    spacebar.position.set(0, 0.055, 0.195);
    group.add(spacebar);

    // White ceramic cup with pencils/pens to the left of the typewriter
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xcfc9bc,
      roughness: 0.35
    });
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.036, 0.11, 20),
      cupMat
    );
    cup.position.set(-0.34, 0.055, -0.02);
    cup.castShadow = true;
    group.add(cup);

    // Pencils sticking out of the cup
    const pencilColors = [0xb8862d, 0x8f2418, 0x2b4c3f, 0xd4c29a];
    pencilColors.forEach((col, idx) => {
      const pMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
      const pencil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.16, 8),
        pMat
      );
      pencil.position.set(
        -0.34 + (idx - 1.5) * 0.012,
        0.1,
        -0.02 + ((idx % 2) - 0.5) * 0.014
      );
      pencil.rotation.z = (idx - 1.5) * 0.08;
      pencil.rotation.x = ((idx % 2) - 0.5) * 0.1;
      group.add(pencil);
    });

    this.root.add(group);
  }

  /**
   * 8. Photorealistic Vintage Pocket Watch (`vintage_pocket_watch.gltf`) & Pen (Left-Front of Desk)
   */
  buildPocketWatchAndPen() {
    this.gltfLoader.load('/models/vintage_pocket_watch/vintage_pocket_watch.gltf', (gltf) => {
      const watch = gltf.scene;
      const box = new THREE.Box3().setFromObject(watch);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const targetSize = 0.095;
      watch.scale.setScalar(targetSize / maxDim);

      watch.position.set(-0.74, 0.812, 0.06);
      watch.rotation.y = 0.45;
      watch.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      this.root.add(watch);
    });
  }

  /**
   * 9. Photorealistic Framed Sepia Gang Photograph (`standing_picture_frame_01.gltf`, Center-Back)
   */
  buildGangPhotoFrame() {
    const group = new THREE.Group();
    group.name = 'prop_operations';
    group.position.set(-0.1, 0.808, -0.32);
    group.rotation.y = -0.25;

    // Fallback frame until GLTF finishes loading in a few ms
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.55 });
    const photoMat = new THREE.MeshStandardMaterial({ map: this.photoTex, roughness: 0.5 });

    const border = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.018), frameMat);
    border.position.y = 0.12;
    border.rotation.x = -0.18;
    border.castShadow = true;
    group.add(border);

    const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.2), photoMat);
    pic.position.set(0, 0.12, 0.011);
    pic.rotation.x = -0.18;
    group.add(pic);

    this.registerInteractiveGroup('prop_operations', group);
  }

  /**
   * 10. Sculpted Green Mushroom-Dome Lamp with Turquoise Ceramic Base (Center-Right of Desk)
   */
  buildGreenDomeLamp() {
    const group = new THREE.Group();
    group.name = 'prop_lamp';
    group.position.set(0.24, 0.808, -0.22);

    // Sculpted bulbous ceramic base using 32-segment LatheGeometry
    const basePoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.095, 0.0),
      new THREE.Vector2(0.115, 0.025),
      new THREE.Vector2(0.105, 0.055),
      new THREE.Vector2(0.065, 0.08),
      new THREE.Vector2(0.022, 0.09),
      new THREE.Vector2(0.0, 0.09)
    ];
    const baseGeo = new THREE.LatheGeometry(basePoints, 36);
    const baseMat = new THREE.MeshStandardMaterial({
      map: this.ceramicTex,
      roughness: 0.28,
      metalness: 0.15
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Curved brass arm rising from the ceramic base and arching over the shade
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(0.04, 0.22, -0.02),
      new THREE.Vector3(0.02, 0.36, 0.01),
      new THREE.Vector3(-0.04, 0.39, 0.04)
    ]);
    const armGeo = new THREE.TubeGeometry(curve, 24, 0.011, 12, false);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0x9c824a,
      roughness: 0.3,
      metalness: 0.85
    });
    const armMesh = new THREE.Mesh(armGeo, brassMat);
    armMesh.castShadow = true;
    group.add(armMesh);

    // Sculpted dark teal-green mushroom dome shade (matching the exact tilted dome in screenshot!)
    const shadePoints = [
      new THREE.Vector2(0.001, 0.16),
      new THREE.Vector2(0.045, 0.155),
      new THREE.Vector2(0.105, 0.125),
      new THREE.Vector2(0.155, 0.065),
      new THREE.Vector2(0.175, 0.0),
      new THREE.Vector2(0.168, 0.004)
    ];
    const shadeGeo = new THREE.LatheGeometry(shadePoints, 40);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x203b31,
      roughness: 0.38,
      metalness: 0.22,
      side: THREE.DoubleSide
    });
    const shadeGroup = new THREE.Group();
    shadeGroup.position.set(-0.04, 0.22, 0.04);
    shadeGroup.rotation.z = 0.14;
    shadeGroup.rotation.x = 0.08;

    const shadeMesh = new THREE.Mesh(shadeGeo, shadeMat);
    shadeMesh.castShadow = true;
    shadeGroup.add(shadeMesh);

    // Warm glowing interior bulb
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe099 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), bulbMat);
    bulb.position.y = 0.08;
    shadeGroup.add(bulb);

    group.add(shadeGroup);
    this.registerInteractiveGroup('prop_lamp', group);
  }

  /**
   * 11. Folded Lost Heaven Map, Fountain Pen & Leather Keychain Fob (Center-Front of Desk)
   */
  buildMapAndKeychain() {
    const group = new THREE.Group();
    group.name = 'prop_dossier';

    // Unfolded Lost Heaven Map angled slightly on center-left of desk (matching screenshot!)
    const mapMat = new THREE.MeshStandardMaterial({
      map: this.mapTex,
      roughness: 0.82
    });
    const mapSheet = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.004, 0.38), mapMat);
    mapSheet.position.set(-0.08, 0.81, 0.05);
    mapSheet.rotation.y = -0.22;
    mapSheet.receiveShadow = true;
    group.add(mapSheet);

    // Fountain pen lying at the left edge of the map (visible in screenshot!)
    const penBodyMat = new THREE.MeshStandardMaterial({
      color: 0x4a2010,
      roughness: 0.3,
      metalness: 0.4
    });
    const penTipMat = new THREE.MeshStandardMaterial({
      color: 0xd4b872,
      roughness: 0.25,
      metalness: 0.85
    });
    const penGroup = new THREE.Group();
    penGroup.position.set(-0.38, 0.814, 0.15);
    penGroup.rotation.y = 0.12;

    const penShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.004, 0.18, 12),
      penBodyMat
    );
    penShaft.rotation.z = Math.PI / 2;
    penShaft.castShadow = true;
    penGroup.add(penShaft);

    const penNib = new THREE.Mesh(
      new THREE.ConeGeometry(0.005, 0.025, 10),
      penTipMat
    );
    penNib.rotation.z = -Math.PI / 2;
    penNib.position.x = 0.1;
    penGroup.add(penNib);
    group.add(penGroup);

    // Leather Keychain Fob & Metal Key at the bottom-right corner of the map
    const keyGroup = new THREE.Group();
    keyGroup.position.set(0.22, 0.812, 0.14);
    keyGroup.rotation.y = -0.32;

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x7a4222,
      roughness: 0.58
    });
    const fob = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.006, 24), leatherMat);
    fob.scale.set(1.0, 1.0, 1.32);
    fob.castShadow = true;
    keyGroup.add(fob);

    const medallionMat = new THREE.MeshStandardMaterial({
      map: this.medallionTex,
      roughness: 0.38
    });
    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.008, 24),
      medallionMat
    );
    medallion.position.set(0, 0.001, -0.006);
    keyGroup.add(medallion);

    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xb8b2a6,
      roughness: 0.25,
      metalness: 0.88
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.0025, 10, 24), silverMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.006, 0.003, 0.052);
    keyGroup.add(ring);

    const keyHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.005, 16),
      silverMat
    );
    keyHead.position.set(0.014, 0.003, 0.078);
    keyHead.castShadow = true;
    keyGroup.add(keyHead);

    const keyBlade = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.004, 0.065), silverMat);
    keyBlade.position.set(0.022, 0.003, 0.115);
    keyBlade.rotation.y = 0.22;
    keyBlade.castShadow = true;
    keyGroup.add(keyBlade);

    group.add(keyGroup);
    this.registerInteractiveGroup('prop_dossier', group);
  }

  /**
   * 12. TWO Photorealistic Colt M1911 Pistols (`service_pistol.gltf` from Poly Haven!)
   *     + Standing .45 ACP Bullet Cartridge on the Map
   */
  buildTwinM1911Pistols() {
    const group = new THREE.Group();
    group.name = 'prop_arsenal';
    this.registerInteractiveGroup('prop_arsenal', group);

    this.gltfLoader.load('/models/service_pistol/service_pistol.gltf', (gltf) => {
      // Assemble Pistol A from its nodes (`service_pistol_pistol_a`, `slide_a`, `hammer_a`, `trigger_a`)
      const pistolTemplate = new THREE.Group();
      const partNames = [
        'service_pistol_pistol_a',
        'service_pistol_slide_a',
        'service_pistol_hammer_a',
        'service_pistol_trigger_a'
      ];
      partNames.forEach((name) => {
        const node = gltf.scene.getObjectByName(name);
        if (node) {
          pistolTemplate.add(node.clone());
        }
      });

      // Compute exact bounding box of the assembled M1911 so it scales & sits flush on the desk
      const box = new THREE.Box3().setFromObject(pistolTemplate);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 0.22;
      const scale = 0.26 / maxDim; // Realistic M1911 length on the desk

      // Pistol 1 (Upper-Left of pair, pointing toward upper-right like in the screenshot & video!)
      const pistol1 = pistolTemplate.clone();
      pistol1.scale.setScalar(scale);
      pistol1.rotation.order = 'YXZ';
      pistol1.rotation.x = -Math.PI / 2;
      pistol1.rotation.y = 0.42;
      pistol1.position.set(0.38, 0.822, 0.06);
      group.add(pistol1);

      // Pistol 2 (Lower-Right foreground of pair, pointing up/left beside the ashtray!)
      const pistol2 = pistolTemplate.clone();
      pistol2.scale.setScalar(scale);
      pistol2.rotation.order = 'YXZ';
      pistol2.rotation.x = -Math.PI / 2;
      pistol2.rotation.y = 1.68;
      pistol2.position.set(0.49, 0.822, 0.27);
      group.add(pistol2);

      // Standing .45 ACP Bullet Cartridge on the Lost Heaven Map (visible in the screenshot!)
      const bulletNode = gltf.scene.getObjectByName('service_pistol_bullet');
      if (bulletNode) {
        const bullet = bulletNode.clone();
        bullet.scale.setScalar(scale * 1.15);
        bullet.position.set(-0.08, 0.814, -0.02);
        group.add(bullet);
      }

      // Register all meshes for hover highlight & click raycasting
      group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData.interactiveParent = 'prop_arsenal';
        }
      });
    });
  }

  /**
   * 13. Sculpted Round Mottled Stone Ashtray (`LatheGeometry`) & Cigar (Right of Pistols)
   */
  buildAshtrayAndCigar() {
    const group = new THREE.Group();
    group.name = 'prop_ashtray';
    group.position.set(0.76, 0.808, 0.14);

    // Sculpted ashtray cross-section (flat bottom, rounded outer wall, wide rim, deep inner bowl)
    const ashProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.11, 0.0),
      new THREE.Vector2(0.125, 0.02),
      new THREE.Vector2(0.122, 0.045),
      new THREE.Vector2(0.082, 0.046),
      new THREE.Vector2(0.072, 0.018),
      new THREE.Vector2(0.0, 0.016)
    ];
    const ashGeo = new THREE.LatheGeometry(ashProfile, 40);
    const stoneMat = new THREE.MeshStandardMaterial({
      map: this.ashtrayTex,
      roughness: 0.35,
      metalness: 0.08
    });
    const ashtray = new THREE.Mesh(ashGeo, stoneMat);
    ashtray.castShadow = true;
    ashtray.receiveShadow = true;
    group.add(ashtray);

    // Hand-rolled brown cigar resting across the rim
    const cigarGroup = new THREE.Group();
    cigarGroup.position.set(-0.02, 0.048, 0.02);
    cigarGroup.rotation.y = -1.1;

    const tobaccoMat = new THREE.MeshStandardMaterial({
      color: 0x4b2c16,
      roughness: 0.7
    });
    const cigarBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.011, 0.18, 18),
      tobaccoMat
    );
    cigarBody.rotation.z = Math.PI / 2 - 0.08;
    cigarBody.castShadow = true;
    cigarGroup.add(cigarBody);

    const ashMat = new THREE.MeshStandardMaterial({
      color: 0xa6aaa4,
      roughness: 0.9
    });
    const ashTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.012, 0.026, 16),
      ashMat
    );
    ashTip.rotation.z = Math.PI / 2 - 0.08;
    ashTip.position.set(-0.095, 0.008, 0);
    cigarGroup.add(ashTip);

    const emberMat = new THREE.MeshBasicMaterial({ color: 0xe04e1a });
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 12), emberMat);
    ember.position.set(-0.106, 0.009, 0);
    cigarGroup.add(ember);

    group.add(cigarGroup);

    this.smokeOrigin = new THREE.Vector3(0.78, 0.87, 0.09);
    this.root.add(group);
  }

  /**
   * 14. Sculpted 1930s Black Bakelite Rotary Telephone (Right-Back Corner of Desk)
   */
  buildRotaryTelephone() {
    const group = new THREE.Group();
    group.name = 'prop_telegram';
    group.position.set(0.76, 0.808, -0.22);
    group.rotation.y = -0.52;

    const bakeliteMat = new THREE.MeshStandardMaterial({
      color: 0x0d0e0d,
      roughness: 0.18,
      metalness: 0.35
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb88642,
      roughness: 0.3,
      metalness: 0.85
    });
    const dialFaceMat = new THREE.MeshStandardMaterial({
      color: 0xf7e4ad,
      emissive: 0x6e5420,
      emissiveIntensity: 0.4,
      roughness: 0.28
    });

    // Beveled base using ExtrudeGeometry for smooth rounded Bakelite corners
    const shape = new THREE.Shape();
    const w = 0.11;
    const d = 0.095;
    const r = 0.022;
    shape.moveTo(-w + r, -d);
    shape.lineTo(w - r, -d);
    shape.quadraticCurveTo(w, -d, w, -d + r);
    shape.lineTo(w, d - r);
    shape.quadraticCurveTo(w, d, w - r, d);
    shape.lineTo(-w + r, d);
    shape.quadraticCurveTo(-w, d, -w, d - r);
    shape.lineTo(-w, -d + r);
    shape.quadraticCurveTo(-w, -d, -w + r, -d);

    const extrudeSettings = {
      depth: 0.048,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.014
    };
    const baseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    baseGeo.rotateX(-Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, bakeliteMat);
    baseMesh.position.y = 0.012;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Sloped upper pyramid body
    const upperBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.135, 0.085, 4),
      bakeliteMat
    );
    upperBody.rotation.y = Math.PI / 4;
    upperBody.position.set(0, 0.095, -0.008);
    upperBody.castShadow = true;
    group.add(upperBody);

    // Rectangular brass nameplate on the front base
    const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.02, 0.006), brassMat);
    frontPlate.position.set(0, 0.028, 0.106);
    group.add(frontPlate);

    // Rotary dial wheel & finger holes
    const dialGroup = new THREE.Group();
    dialGroup.position.set(0, 0.092, 0.072);
    dialGroup.rotation.x = 0.68;

    const dialWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.056, 0.056, 0.01, 28),
      dialFaceMat
    );
    dialGroup.add(dialWheel);

    const dialCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.019, 0.013, 18),
      bakeliteMat
    );
    dialGroup.add(dialCenter);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.4;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0075, 0.0075, 0.014, 12),
        bakeliteMat
      );
      hole.position.set(Math.cos(angle) * 0.036, 0, Math.sin(angle) * 0.036);
      dialGroup.add(hole);
    }
    group.add(dialGroup);

    // Chrome cradle prongs
    [-0.038, 0.038].forEach((cx) => {
      const prong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.008, 0.035, 10),
        brassMat
      );
      prong.position.set(cx, 0.145, -0.01);
      group.add(prong);
    });

    // Sculpted Curved Handset Bar + Bell Earpieces
    const handsetCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.105, 0.145, -0.01),
      new THREE.Vector3(-0.05, 0.168, -0.01),
      new THREE.Vector3(0.05, 0.168, -0.01),
      new THREE.Vector3(0.105, 0.145, -0.01)
    ]);
    const handsetBar = new THREE.Mesh(
      new THREE.TubeGeometry(handsetCurve, 20, 0.015, 12, false),
      bakeliteMat
    );
    handsetBar.castShadow = true;
    group.add(handsetBar);

    [-0.105, 0.105].forEach((bx) => {
      const earCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.024, 0.042, 20),
        bakeliteMat
      );
      earCup.position.set(bx, 0.132, -0.01);
      earCup.rotation.z = bx < 0 ? -0.25 : 0.25;
      earCup.castShadow = true;
      group.add(earCup);
    });

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

      this.gltfLoader.load(cfg.modelPath, (gltf) => {
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
      });
    });
  }
}
