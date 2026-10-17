/**
 * PROCEDURAL HIGH-RES TEXTURE GENERATOR FOR MAFIA 1 DESK SCENE
 * ------------------------------------------------------------
 * Generates authentic 2002 Mafia: The City of Lost Heaven textures on HTML5 Canvas:
 * - Warm honey-oak wood grain table surface (matching the video's golden-brown wood)
 * - Checkered walnut M1911 pistol grip panels with screw heads
 * - Mottled brown/olive stone ashtray texture
 * - Vintage 1930s Lost Heaven folded street map
 * - Sepia 1930s mobster family photograph
 * - Mottled turquoise/emerald ceramic lamp base
 */

import * as THREE from 'three';

export function createHoneyWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base warm honey-chestnut wood tone from the video
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#8d4f20');
  grad.addColorStop(0.5, '#9e5b27');
  grad.addColorStop(1, '#7c4319');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Fine wood fibers and darker grain streaks
  for (let i = 0; i < 420; i++) {
    const y = Math.random() * 1024;
    const h = 1 + Math.random() * 4;
    const alpha = 0.04 + Math.random() * 0.11;
    ctx.fillStyle = i % 3 === 0 ? `rgba(45, 20, 6, ${alpha})` : `rgba(195, 125, 62, ${alpha * 0.7})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const wave = (Math.random() - 0.5) * 18;
    ctx.bezierCurveTo(340, y + wave, 680, y - wave, 1024, y + (Math.random() - 0.5) * 10);
    ctx.lineTo(1024, y + h);
    ctx.lineTo(0, y + h);
    ctx.closePath();
    ctx.fill();
  }

  // Subtle plank seams
  ctx.strokeStyle = 'rgba(38, 16, 4, 0.28)';
  ctx.lineWidth = 2;
  [256, 512, 768].forEach((py) => {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(1024, py);
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPistolGripTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep walnut brown base
  ctx.fillStyle = '#4e2714';
  ctx.fillRect(0, 0, 256, 512);

  // Border frame
  ctx.strokeStyle = '#33170a';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, 240, 496);

  // Diamond checkering pattern
  ctx.strokeStyle = 'rgba(28, 11, 4, 0.65)';
  ctx.lineWidth = 2;
  const step = 12;
  for (let i = -512; i < 512; i += step) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i + 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(256, i);
    ctx.lineTo(0, i + 256);
    ctx.stroke();
  }

  // Two silver grip screws (top & bottom like the M1911 in the video)
  [90, 420].forEach((sy) => {
    ctx.fillStyle = '#9e9a90';
    ctx.beginPath();
    ctx.arc(128, sy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2b2622';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Screw slot
    ctx.beginPath();
    ctx.moveTo(116, sy - 6);
    ctx.lineTo(140, sy + 6);
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMottledAshtrayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4a3d2c';
  ctx.fillRect(0, 0, 512, 512);

  // Mottled stone patches (olive, taupe, charcoal, warm ochre)
  const palette = ['#5c4c38', '#382e21', '#6e5d45', '#2a2218', '#7d6b50'];
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.18 + Math.random() * 0.25;
    ctx.beginPath();
    ctx.arc(
      Math.random() * 512,
      Math.random() * 512,
      4 + Math.random() * 26,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createLostHeavenMapTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Aged yellowish-green parchment map paper (visible on left of video)
  ctx.fillStyle = '#cbbd8c';
  ctx.fillRect(0, 0, 512, 512);

  // Tinted district blocks
  ctx.fillStyle = 'rgba(165, 178, 120, 0.55)';
  ctx.fillRect(30, 40, 200, 180);
  ctx.fillRect(260, 220, 210, 240);

  // West River waterway
  ctx.fillStyle = '#8fa69b';
  ctx.beginPath();
  ctx.moveTo(210, 0);
  ctx.bezierCurveTo(240, 180, 190, 340, 235, 512);
  ctx.lineTo(275, 512);
  ctx.bezierCurveTo(230, 340, 280, 180, 250, 0);
  ctx.closePath();
  ctx.fill();

  // Red street grid & transit lines (matching the red lines on the map in maxres.jpg)
  ctx.strokeStyle = '#b8432e';
  ctx.lineWidth = 3;
  for (let x = 40; x < 480; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x + (Math.random() - 0.5) * 16, 490);
    ctx.stroke();
  }
  for (let y = 40; y < 480; y += 52) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(490, y + (Math.random() - 0.5) * 16);
    ctx.stroke();
  }

  // Fold creases
  ctx.strokeStyle = 'rgba(60, 45, 25, 0.35)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createKeyFobMedallionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e8d7b4';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#6e4726';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  // Cursive monogram "VS" / "LH" like in the video
  ctx.fillStyle = '#4a2e16';
  ctx.font = 'italic bold 92px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LH', 128, 132);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSepiaGangPhotoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  // Vintage sepia paper border
  ctx.fillStyle = '#cbb692';
  ctx.fillRect(0, 0, 512, 384);

  // Inner photo background
  const bg = ctx.createLinearGradient(0, 20, 0, 360);
  bg.addColorStop(0, '#9e8866');
  bg.addColorStop(0.6, '#6e593d');
  bg.addColorStop(1, '#3b2c1a');
  ctx.fillStyle = bg;
  ctx.fillRect(18, 18, 476, 348);

  // Silhouettes of 1930s mobsters in fedoras & trenchcoats standing by a vintage car
  ctx.fillStyle = '#1e150c';
  const figures = [95, 165, 245, 325, 405];
  figures.forEach((fx, idx) => {
    const h = 155 + (idx % 2) * 14;
    const topY = 350 - h;
    // Coat/suit torso
    ctx.fillRect(fx - 24, topY + 36, 48, h - 36);
    // Head
    ctx.beginPath();
    ctx.arc(fx, topY + 20, 14, 0, Math.PI * 2);
    ctx.fill();
    // Fedora brim
    ctx.fillRect(fx - 22, topY + 8, 44, 6);
    ctx.fillRect(fx - 13, topY, 26, 10);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createTurquoiseCeramicTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3b6e63';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(95, 155, 138, 0.25)' : 'rgba(28, 56, 48, 0.25)';
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
