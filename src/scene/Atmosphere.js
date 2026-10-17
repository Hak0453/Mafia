/**
 * 1930s NOIR ATMOSPHERE, LIGHTING & PARTICLES
 * -------------------------------------------
 * - Banker's lamp warm point light with subtle organic filament flicker
 * - Window moonlight directional light casting slatted shadows
 * - Rising cigarette/cigar smoke wisps from the ashtray
 * - Floating dust motes in the room air
 */

import * as THREE from 'three';
import { THEME } from '../config.js';

export class Atmosphere {
  constructor(scene, smokeOrigin) {
    this.scene = scene;
    this.smokeOrigin = smokeOrigin || new THREE.Vector3(0.39, 0.87, 0.235);

    this.setupLighting();
    this.setupCigaretteSmoke();
    this.setupDustMotes();
  }

  setupLighting() {
    // 1. Soft warm ambient base
    this.ambientLight = new THREE.AmbientLight(
      THEME.ambientLight.color,
      THEME.ambientLight.intensity
    );
    this.scene.add(this.ambientLight);

    // 2. Banker's desk lamp warm spotlight/pointlight
    this.lampLight = new THREE.PointLight(
      THEME.lampLight.color,
      THEME.lampLight.intensity,
      THEME.lampLight.distance,
      THEME.lampLight.decay
    );
    this.lampLight.position.set(-0.56, 1.24, -0.35);
    this.lampLight.castShadow = true;
    this.lampLight.shadow.mapSize.width = 1024;
    this.lampLight.shadow.mapSize.height = 1024;
    this.lampLight.shadow.bias = -0.002;
    this.scene.add(this.lampLight);

    // 3. Cool street/moonlight streaming through left Venetian blinds
    this.windowLight = new THREE.DirectionalLight(
      THEME.windowLight.color,
      THEME.windowLight.intensity
    );
    this.windowLight.position.set(
      THEME.windowLight.position.x,
      THEME.windowLight.position.y,
      THEME.windowLight.position.z
    );
    this.windowLight.castShadow = true;
    this.windowLight.shadow.mapSize.width = 1024;
    this.windowLight.shadow.mapSize.height = 1024;
    this.windowLight.shadow.camera.near = 0.5;
    this.windowLight.shadow.camera.far = 12;
    this.scene.add(this.windowLight);

    // 4. Subtle crimson/amber backroom fill light
    this.fillLight = new THREE.PointLight(
      THEME.fillLight.color,
      THEME.fillLight.intensity,
      8
    );
    this.fillLight.position.set(1.8, 2.2, 1.6);
    this.scene.add(this.fillLight);
  }

  setupCigaretteSmoke() {
    this.smokeCount = 42;
    const positions = new Float32Array(this.smokeCount * 3);
    this.smokeData = [];

    for (let i = 0; i < this.smokeCount; i++) {
      const progress = i / this.smokeCount;
      this.smokeData.push({
        age: progress,
        speed: 0.14 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2
      });
      positions[i * 3] = this.smokeOrigin.x;
      positions[i * 3 + 1] = this.smokeOrigin.y + progress * 0.75;
      positions[i * 3 + 2] = this.smokeOrigin.z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xc8c2b8,
      size: 0.045,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.smokePoints = new THREE.Points(geo, mat);
    this.scene.add(this.smokePoints);
  }

  setupDustMotes() {
    const count = 90;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 1] = 0.7 + Math.random() * 2.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffdfb0,
      size: 0.018,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    this.dustPoints = new THREE.Points(geo, mat);
    this.scene.add(this.dustPoints);
  }

  update(elapsedTime, deltaTime) {
    // 1. Subtle organic filament flicker on banker's lamp
    const flicker =
      Math.sin(elapsedTime * 13.0) * 0.04 +
      Math.sin(elapsedTime * 29.0) * 0.03 +
      Math.cos(elapsedTime * 3.7) * THEME.lampLight.flickerAmount;
    this.lampLight.intensity = THEME.lampLight.intensity + flicker;

    // 2. Update rising curling cigarette smoke
    const posAttr = this.smokePoints.geometry.attributes.position;
    for (let i = 0; i < this.smokeCount; i++) {
      const p = this.smokeData[i];
      p.age += deltaTime * p.speed;
      if (p.age > 1.0) {
        p.age = 0;
      }

      const height = p.age * 0.85;
      const curlX = Math.sin(elapsedTime * 1.6 + p.phase + p.age * 5.0) * (0.045 * p.age);
      const curlZ = Math.cos(elapsedTime * 1.3 + p.phase + p.age * 4.0) * (0.045 * p.age);

      posAttr.setXYZ(
        i,
        this.smokeOrigin.x + curlX,
        this.smokeOrigin.y + height,
        this.smokeOrigin.z + curlZ
      );
    }
    posAttr.needsUpdate = true;

    // 3. Gently drift room dust motes
    this.dustPoints.rotation.y = elapsedTime * 0.018;
  }
}
