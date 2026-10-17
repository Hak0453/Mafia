/**
 * MAFIA 1 PERSONAL SITE — MAIN THREE.JS ENTRY POINT
 * -------------------------------------------------
 * Sets up the WebGLRenderer, PerspectiveCamera, PMREM RoomEnvironment (for realistic
 * PBR reflections on the M1911 pistols, pocket watch, typewriter, and wood),
 * 1930s Office Room, Noir Atmosphere, GSAP CameraController, and MenuUI.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { THEME } from './config.js';
import { Room } from './scene/Room.js';
import { Atmosphere } from './scene/Atmosphere.js';
import { CameraController } from './scene/CameraController.js';
import { SoundManager } from './audio/SoundManager.js';
import { MenuUI } from './ui/MenuUI.js';

class MafiaApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    this.initScene();
    this.initModules();
    this.bindResize();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(THEME.backgroundColor);
    this.scene.fog = new THREE.FogExp2(THEME.fogColor, THEME.fogDensity);

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.08,
      40
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Realistic PBR Image-Based Lighting (IBL) so gunmetal, brass, and wood look lifelike
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    if ('environmentIntensity' in this.scene) {
      this.scene.environmentIntensity = 0.48;
    }

    this.container.appendChild(this.renderer.domElement);
  }

  initModules() {
    this.soundManager = new SoundManager();
    this.room = new Room(this.scene);
    this.atmosphere = new Atmosphere(this.scene, this.room.smokeOrigin);

    this.cameraController = new CameraController(
      this.camera,
      this.renderer.domElement,
      this.room,
      {
        onSectionSelect: (sectionId) => {
          if (this.menuUI) this.menuUI.selectSection(sectionId);
        },
        onObjectHover: (section, x, y) => {
          if (this.menuUI) this.menuUI.handleObjectHover(section, x, y);
        }
      }
    );

    this.menuUI = new MenuUI({
      cameraController: this.cameraController,
      soundManager: this.soundManager
    });
  }

  bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this.atmosphere.update(elapsed, delta);
    this.cameraController.update(elapsed);

    if (!this.menuUI.debugPanel.classList.contains('hidden')) {
      this.menuUI.updateDebugReadout();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MafiaApp();
});
