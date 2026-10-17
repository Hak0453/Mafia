/**
 * PROCEDURAL HIGH-RES TEXTURE GENERATOR FOR MAFIA 1 OFFICE ROOM & DESK
 * --------------------------------------------------------------------
 * Generates authentic 1930s textures matching the uploaded Mafia 1 room view:
 * - Warm honey-oak desk wood grain + bump map
 * - Weathered brown hardwood plank floor
 * - Grey-olive aged plaster wall
 * - 3 Vintage 1930s pin-up posters & 1 B&W vintage automobile photo
 * - Burnt-orange/red upholstered chair seat cushion with piping trim
 * - Printed vintage cardboard box ("PLEASE HANDLE WITH CARE / PICK UP")
 * - Lost Heaven street map, sepia gang photo, mottled stone ashtray, turquoise lamp base
 */

import * as THREE from 'three';

export function createHoneyWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#7c3f16');
  grad.addColorStop(0.45, '#914d1e');
  grad.addColorStop(1, '#68320f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 500; i++) {
    const y = Math.random() * 1024;
    const h = 1 + Math.random() * 3.5;
    const alpha = 0.04 + Math.random() * 0.1;
    ctx.fillStyle =
      i % 3 === 0 ? `rgba(35, 14, 4, ${alpha})` : `rgba(185, 110, 50, ${alpha * 0.65})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const wave = (Math.random() - 0.5) * 14;
    ctx.bezierCurveTo(340, y + wave, 680, y - wave, 1024, y + (Math.random() - 0.5) * 8);
    ctx.lineTo(1024, y + h);
    ctx.lineTo(0, y + h);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHardwoodFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4a3523';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankCount = 12;
  const plankH = 1024 / plankCount;
  const plankColors = ['#4d3724', '#422e1d', '#543d29', '#3d2a1a', '#493422'];

  for (let row = 0; row < plankCount; row++) {
    const y = row * plankH;
    ctx.fillStyle = plankColors[row % plankColors.length];
    ctx.fillRect(0, y, 1024, plankH);

    // Wood grain streaks along each floorboard
    for (let g = 0; g < 35; g++) {
      ctx.fillStyle = g % 2 === 0 ? 'rgba(20, 11, 5, 0.14)' : 'rgba(110, 82, 54, 0.08)';
      ctx.fillRect(0, y + Math.random() * plankH, 1024, 1 + Math.random() * 3);
    }

    // Plank horizontal seam
    ctx.strokeStyle = 'rgba(18, 10, 4, 0.72)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Vertical plank joints
    const jointX = ((row * 310 + 180) % 820) + 100;
    ctx.beginPath();
    ctx.moveTo(jointX, y);
    ctx.lineTo(jointX, y + plankH);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPlasterWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#46453d');
  grad.addColorStop(0.7, '#58564c');
  grad.addColorStop(1, '#3d3b33');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle aged plaster mottling
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(35, 34, 28, 0.06)' : 'rgba(120, 116, 102, 0.05)';
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 1024, 6 + Math.random() * 36, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createChairCushionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Burnt rust-red / terracotta upholstery matching the chair in the screenshot
  const rad = ctx.createRadialGradient(256, 256, 30, 256, 256, 260);
  rad.addColorStop(0, '#9e4125');
  rad.addColorStop(0.75, '#7e3019');
  rad.addColorStop(1, '#582010');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 512, 512);

  // Woven fabric grain
  ctx.strokeStyle = 'rgba(40, 12, 5, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Light tan/gold piping trim around edge
  ctx.strokeStyle = '#b58d58';
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 476, 476);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCardboardBoxTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#9e8864';
  ctx.fillRect(0, 0, 512, 512);

  // Distressed cardboard stains & borders
  ctx.strokeStyle = '#5c4a32';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, 488, 488);

  // Vintage shipping stencil typography ("PLEASE HANDLE WITH CARE / PICK UP")
  ctx.fillStyle = '#5a2618';
  ctx.font = 'bold 42px Impact, sans-serif';
  ctx.fillText('PLEASE HANDLE', 40, 120);
  ctx.fillStyle = '#241e18';
  ctx.font = 'bold 54px Impact, sans-serif';
  ctx.fillText('PICK UP', 40, 220);
  ctx.font = 'bold 34px Courier New, monospace';
  ctx.fillText('LOST HEAVEN • NO. 4', 40, 310);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWallPosterTexture(variant = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');

  if (variant === 3) {
    // Framed white-bordered B&W 1930s automobile photograph on right wall
    ctx.fillStyle = '#d8d0be';
    ctx.fillRect(0, 0, 256, 340);
    ctx.fillStyle = '#26231e';
    ctx.fillRect(18, 18, 220, 304);
    // Vintage 1930s coupe silhouette & white grille
    ctx.fillStyle = '#6e685c';
    ctx.fillRect(36, 170, 184, 95);
    ctx.fillStyle = '#cfc8b8';
    ctx.fillRect(102, 180, 52, 72);
    ctx.beginPath();
    ctx.arc(78, 215, 16, 0, Math.PI * 2);
    ctx.arc(178, 215, 16, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Vintage 1930s muted sepia/warm pin-up poster on back wall
    const bgColors = ['#3b3630', '#7c5d46', '#726a58'];
    ctx.fillStyle = bgColors[variant % bgColors.length];
    ctx.fillRect(0, 0, 256, 340);

    // Stylized 1930s vintage illustration silhouette
    ctx.fillStyle = '#b88564';
    ctx.beginPath();
    ctx.arc(128, 110, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 210, 42, 78, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Corner thumbtacks
    ctx.fillStyle = '#1c1815';
    [
      [12, 12],
      [244, 12],
      [12, 328],
      [244, 328]
    ].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPistolGripTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4e2714';
  ctx.fillRect(0, 0, 256, 512);

  ctx.strokeStyle = '#33170a';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, 240, 496);

  ctx.strokeStyle = 'rgba(28, 11, 4, 0.65)';
  ctx.lineWidth = 2;
  for (let i = -512; i < 512; i += 12) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i + 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(256, i);
    ctx.lineTo(0, i + 256);
    ctx.stroke();
  }

  [90, 420].forEach((sy) => {
    ctx.fillStyle = '#9e9a90';
    ctx.beginPath();
    ctx.arc(128, sy, 16, 0, Math.PI * 2);
    ctx.fill();
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

  ctx.fillStyle = '#cbbd8c';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(155, 172, 112, 0.55)';
  ctx.fillRect(30, 40, 200, 180);
  ctx.fillRect(260, 220, 210, 240);

  ctx.fillStyle = '#8fa69b';
  ctx.beginPath();
  ctx.moveTo(210, 0);
  ctx.bezierCurveTo(240, 180, 190, 340, 235, 512);
  ctx.lineTo(275, 512);
  ctx.bezierCurveTo(230, 340, 280, 180, 250, 0);
  ctx.closePath();
  ctx.fill();

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

  ctx.fillStyle = '#efe2c6';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#6e4726';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#4a2e16';
  ctx.font = 'italic bold 92px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', 128, 132);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSepiaGangPhotoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#d4c19c';
  ctx.fillRect(0, 0, 512, 384);

  const bg = ctx.createLinearGradient(0, 20, 0, 360);
  bg.addColorStop(0, '#b59f7b');
  bg.addColorStop(0.55, '#7a6344');
  bg.addColorStop(1, '#3b2c1a');
  ctx.fillStyle = bg;
  ctx.fillRect(18, 18, 476, 348);

  ctx.fillStyle = '#1e150c';
  const figures = [85, 145, 205, 265, 325, 385, 430];
  figures.forEach((fx, idx) => {
    const h = 150 + (idx % 3) * 12;
    const topY = 348 - h;
    ctx.fillRect(fx - 20, topY + 34, 40, h - 34);
    ctx.beginPath();
    ctx.arc(fx, topY + 18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(fx - 18, topY + 6, 36, 5);
    ctx.fillRect(fx - 11, topY, 22, 8);
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

  ctx.fillStyle = '#3b7368';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 240; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(110, 178, 160, 0.3)' : 'rgba(24, 52, 44, 0.28)';
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
