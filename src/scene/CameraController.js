/**
 * GSAP CAMERA CHOREOGRAPHY & 3D OBJECT RAYCASTER
 * ----------------------------------------------
 * - Smoothly pans and zooms camera position + lookAt target between SECTIONS
 * - Adds subtle handheld/breathing sway + mouse parallax like Mafia 1's main menu
 * - Raycasts pointer hover/clicks onto interactive 3D props on the desk and wall
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { SECTIONS } from '../config.js';

export class CameraController {
  constructor(camera, domElement, room, callbacks = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.room = room;
    this.onSectionSelect = callbacks.onSectionSelect || (() => {});
    this.onObjectHover = callbacks.onObjectHover || (() => {});

    // Base camera coordinates driven by GSAP or Camera Tuner
    const initial = SECTIONS[0];
    this.basePosition = new THREE.Vector3(
      initial.cameraPos.x,
      initial.cameraPos.y,
      initial.cameraPos.z
    );
    this.lookAtTarget = new THREE.Vector3(
      initial.cameraTarget.x,
      initial.cameraTarget.y,
      initial.cameraTarget.z
    );

    this.camera.position.copy(this.basePosition);
    this.camera.lookAt(this.lookAtTarget);

    this.pointer = new THREE.Vector2(0, 0);
    this.smoothPointer = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.hoveredObjectName = null;
    this.isDebugOverride = false;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.checkRaycast(e.clientX, e.clientY);
    });

    this.domElement.addEventListener('click', () => {
      if (this.hoveredObjectName) {
        const matched = SECTIONS.find((s) => s.objectName === this.hoveredObjectName);
        if (matched) {
          this.onSectionSelect(matched.id);
        }
      }
    });
  }

  checkRaycast(clientX, clientY) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = [];
    this.room.interactiveGroups.forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });
    });

    const hits = this.raycaster.intersectObjects(meshes, false);
    if (hits.length > 0) {
      const parentName = hits[0].object.userData.interactiveParent;
      if (parentName !== this.hoveredObjectName) {
        this.hoveredObjectName = parentName;
        this.room.setHoveredProp(parentName);
        document.body.style.cursor = 'pointer';
      }
      const section = SECTIONS.find((s) => s.objectName === parentName);
      this.onObjectHover(section, clientX, clientY);
    } else if (this.hoveredObjectName !== null) {
      this.hoveredObjectName = null;
      this.room.setHoveredProp(null);
      document.body.style.cursor = 'default';
      this.onObjectHover(null, clientX, clientY);
    }
  }

  /**
   * Smoothly animates camera position & lookAt target to the chosen section
   */
  transitionToSection(sectionId, duration = 1.65) {
    const section = SECTIONS.find((s) => s.id === sectionId) || SECTIONS[0];
    this.isDebugOverride = false;

    gsap.killTweensOf(this.basePosition);
    gsap.killTweensOf(this.lookAtTarget);

    gsap.to(this.basePosition, {
      x: section.cameraPos.x,
      y: section.cameraPos.y,
      z: section.cameraPos.z,
      duration,
      ease: 'power2.inOut'
    });

    gsap.to(this.lookAtTarget, {
      x: section.cameraTarget.x,
      y: section.cameraTarget.y,
      z: section.cameraTarget.z,
      duration,
      ease: 'power2.inOut'
    });
  }

  /**
   * Used by the live Camera Tuner [C] so you can dial in new waypoints interactively
   */
  setManualTransform(pos, target) {
    this.isDebugOverride = true;
    this.basePosition.set(pos.x, pos.y, pos.z);
    this.lookAtTarget.set(target.x, target.y, target.z);
  }

  update(elapsedTime) {
    // Smooth mouse parallax interpolation
    this.smoothPointer.x += (this.pointer.x - this.smoothPointer.x) * 0.05;
    this.smoothPointer.y += (this.pointer.y - this.smoothPointer.y) * 0.05;

    if (!this.isDebugOverride) {
      // Subtle 1930s cinematic breathing sway + gentle mouse parallax
      const swayX = Math.sin(elapsedTime * 0.45) * 0.025 + this.smoothPointer.x * 0.06;
      const swayY = Math.cos(elapsedTime * 0.35) * 0.015 + this.smoothPointer.y * 0.04;

      this.camera.position.set(
        this.basePosition.x + swayX,
        this.basePosition.y + swayY,
        this.basePosition.z
      );
    } else {
      this.camera.position.copy(this.basePosition);
    }

    this.camera.lookAt(this.lookAtTarget);
  }
}
