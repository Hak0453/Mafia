/**
 * MAFIA 1 PERSONAL SITE — MAIN THREE.JS ENTRY POINT
 * -------------------------------------------------
 * Sets up the WebGLRenderer, PerspectiveCamera, 1930s Office Room,
 * Noir Atmosphere (lamp flicker, blinds shadows, smoke), GSAP CameraController,
 * Orchestral Noir SoundManager, and MenuUI.
 */

import * as THREE from 'three';
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
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      50
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
    this.renderer.toneMappingExposure = 1.1;

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
