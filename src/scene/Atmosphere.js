/**
 * 1930s NOIR ATMOSPHERE, LIGHTING & PARTICLES
 * -------------------------------------------
 * Illuminates the honey-oak desk, twin M1911 pistols, mottled ashtray,
 * keychain, map, green dome lamp, and rotary telephone just like the Mafia 1 video.
 */

import * as THREE from 'three';
import { THEME } from '../config.js';

export class Atmosphere {
  constructor(scene, smokeOrigin) {
    this.scene = scene;
    this.smokeOrigin = smokeOrigin || new THREE.Vector3(0.59, 0.91, 0.02);

    this.setupLighting();
    this.setupCigaretteSmoke();
  }

  setupLighting() {
    // 1. Warm ambient light so the honey-oak wood grain and gunmetal are clearly visible
    this.ambientLight = new THREE.AmbientLight(
      THEME.ambientLight.color,
      THEME.ambientLight.intensity
    );
    this.scene.add(this.ambientLight);

    // 2. Warm golden light radiating from under the Green Dome Lamp onto the desk
    this.lampLight = new THREE.PointLight(
      THEME.lampLight.color,
      THEME.lampLight.intensity,
      THEME.lampLight.distance,
      THEME.lampLight.decay
    );
    this.lampLight.position.set(-0.18, 1.35, -0.15);
    this.lampLight.castShadow = true;
    this.lampLight.shadow.mapSize.width = 2048;
    this.lampLight.shadow.mapSize.height = 2048;
    this.lampLight.shadow.bias = -0.0015;
    this.scene.add(this.lampLight);

    // 3. Key directional light from upper-right/front creating the specular sheen on the M1911 slides & wood grain
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
    this.windowLight.shadow.mapSize.width = 2048;
    this.windowLight.shadow.mapSize.height = 2048;
    this.windowLight.shadow.camera.near = 0.2;
    this.windowLight.shadow.camera.far = 10;
    this.scene.add(this.windowLight);

    // 4. Warm fill light over the foreground pistols & ashtray
    this.fillLight = new THREE.PointLight(
      THEME.fillLight.color,
      THEME.fillLight.intensity,
      6
    );
    this.fillLight.position.set(0.35, 1.45, 0.65);
    this.scene.add(this.fillLight);
  }

  setupCigaretteSmoke() {
    this.smokeCount = 38;
    const positions = new Float32Array(this.smokeCount * 3);
    this.smokeData = [];

    for (let i = 0; i < this.smokeCount; i++) {
      const progress = i / this.smokeCount;
      this.smokeData.push({
        age: progress,
        speed: 0.12 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2
      });
      positions[i * 3] = this.smokeOrigin.x;
      positions[i * 3 + 1] = this.smokeOrigin.y + progress * 0.55;
      positions[i * 3 + 2] = this.smokeOrigin.z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xd8d4cc,
      size: 0.032,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.smokePoints = new THREE.Points(geo, mat);
    this.scene.add(this.smokePoints);
  }

  update(elapsedTime, deltaTime) {
    // Gentle warm lamp glow variation
    const flicker = Math.sin(elapsedTime * 7.0) * THEME.lampLight.flickerAmount;
    this.lampLight.intensity = THEME.lampLight.intensity + flicker;

    // Curling cigar smoke rising from the ashtray
    const posAttr = this.smokePoints.geometry.attributes.position;
    for (let i = 0; i < this.smokeCount; i++) {
      const p = this.smokeData[i];
      p.age += deltaTime * p.speed;
      if (p.age > 1.0) p.age = 0;

      const height = p.age * 0.55;
      const curlX = Math.sin(elapsedTime * 1.5 + p.phase + p.age * 4.5) * (0.032 * p.age);
      const curlZ = Math.cos(elapsedTime * 1.2 + p.phase + p.age * 3.8) * (0.032 * p.age);

      posAttr.setXYZ(
        i,
        this.smokeOrigin.x + curlX,
        this.smokeOrigin.y + height,
        this.smokeOrigin.z + curlZ
      );
    }
    posAttr.needsUpdate = true;
  }
}
