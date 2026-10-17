/**
 * MAFIA 1 DOM MENU, DOSSIER PANEL & CAMERA TUNER UI
 * -------------------------------------------------
 * Renders the authentic top-left crumpled paper menu from Mafia: The City of Lost Heaven,
 * unlocks and plays the real Vladimir Simunek Main Theme (`public/audio/theme.mp3`),
 * and triggers camera pans across the honey-oak desk.
 */

import gsap from 'gsap';
import { SITE_META, SECTIONS } from '../config.js';

export class MenuUI {
  constructor({ cameraController, soundManager }) {
    this.cameraController = cameraController;
    this.soundManager = soundManager;
    this.activeSectionId = 'overview';

    // DOM elements
    this.titleEl = document.getElementById('site-title');
    this.menuNavEl = document.getElementById('menu-nav');
    this.mainMenuEl = document.getElementById('main-menu');

    this.panelEl = document.getElementById('section-panel');
    this.panelKickerEl = document.getElementById('panel-kicker');
    this.panelTitleEl = document.getElementById('panel-title');
    this.panelBodyEl = document.getElementById('panel-body');
    this.btnBack = document.getElementById('btn-back');

    this.tooltipEl = document.getElementById('object-tooltip');
    this.tooltipTitleEl = document.getElementById('tooltip-title');
    this.tooltipSubEl = document.getElementById('tooltip-sub');

    this.btnPanTour = document.getElementById('btn-pan-tour');
    this.btnAudio = document.getElementById('btn-audio');
    this.audioLed = document.getElementById('audio-led');
    this.audioLabel = document.getElementById('audio-label');

    this.btnDebug = document.getElementById('btn-debug');
    this.debugPanel = document.getElementById('debug-panel');
    this.dbgSection = document.getElementById('dbg-section');
    this.dbgPos = document.getElementById('dbg-pos');
    this.dbgTarget = document.getElementById('dbg-target');
    this.btnCopyCam = document.getElementById('btn-copy-cam');

    this.sliders = {
      camX: document.getElementById('sl-cam-x'),
      camY: document.getElementById('sl-cam-y'),
      camZ: document.getElementById('sl-cam-z'),
      tarX: document.getElementById('sl-tar-x'),
      tarY: document.getElementById('sl-tar-y'),
      tarZ: document.getElementById('sl-tar-z')
    };

    this.init();
  }

  init() {
    this.titleEl.textContent = SITE_META.title;
    this.renderMenuItems();
    this.bindEvents();
    this.syncDebugSlidersToCurrent();

    // Auto-start orchestral soundtrack on first user click anywhere if browser blocked autoplay
    const unlockAudioOnce = () => {
      if (!this.soundManager.isPlaying) {
        this.soundManager.start();
        this.updateAudioHUD(true);
      }
      window.removeEventListener('pointerdown', unlockAudioOnce);
    };
    window.addEventListener('pointerdown', unlockAudioOnce);
  }

  renderMenuItems() {
    this.menuNavEl.innerHTML = '';
    SECTIONS.forEach((section) => {
      const btn = document.createElement('button');
      btn.className = `paper-menu-item ${section.id === this.activeSectionId ? 'active' : ''}`;
      btn.dataset.sectionId = section.id;
      btn.textContent = section.title;

      btn.addEventListener('mouseenter', () => {
        this.soundManager.playHoverSound();
      });

      btn.addEventListener('click', () => {
        this.selectSection(section.id);
      });

      this.menuNavEl.appendChild(btn);
    });
  }

  bindEvents() {
    this.btnBack.addEventListener('click', () => {
      this.selectSection('overview');
    });

    this.btnPanTour.addEventListener('click', () => {
      this.playVideoCameraPan();
    });

    this.btnAudio.addEventListener('click', (e) => {
      e.stopPropagation();
      const playing = this.soundManager.toggle();
      this.updateAudioHUD(playing);
    });

    this.btnDebug.addEventListener('click', () => {
      this.toggleDebugPanel();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeSectionId !== 'overview') {
        this.selectSection('overview');
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        this.toggleDebugPanel();
      }
    });

    Object.values(this.sliders).forEach((slider) => {
      slider.addEventListener('input', () => {
        const pos = {
          x: parseFloat(this.sliders.camX.value),
          y: parseFloat(this.sliders.camY.value),
          z: parseFloat(this.sliders.camZ.value)
        };
        const target = {
          x: parseFloat(this.sliders.tarX.value),
          y: parseFloat(this.sliders.tarY.value),
          z: parseFloat(this.sliders.tarZ.value)
        };
        this.cameraController.setManualTransform(pos, target);
        this.updateDebugReadout();
      });
    });

    this.btnCopyCam.addEventListener('click', () => {
      const p = this.cameraController.basePosition;
      const t = this.cameraController.lookAtTarget;
      const snippet = `cameraPos: { x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}, z: ${p.z.toFixed(2)} },\ncameraTarget: { x: ${t.x.toFixed(2)}, y: ${t.y.toFixed(2)}, z: ${t.z.toFixed(2)} },`;
      navigator.clipboard.writeText(snippet).then(() => {
        const orig = this.btnCopyCam.textContent;
        this.btnCopyCam.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => {
          this.btnCopyCam.textContent = orig;
        }, 1600);
      });
    });
  }

  /**
   * Replays the iconic slow camera pan from the Mafia 1 YouTube video:
   * Starts facing the Green Dome Lamp, Gang Photo & Rotary Phone (2.jpg),
   * then pans down across the Map & Keychain to settle over the Twin M1911 Pistols & Cigar Ashtray (maxres.jpg).
   */
  playVideoCameraPan() {
    this.panelEl.classList.add('hidden');
    const pos = this.cameraController.basePosition;
    const tar = this.cameraController.lookAtTarget;

    gsap.killTweensOf(pos);
    gsap.killTweensOf(tar);

    // Start at Green Dome Lamp & Sepia Photo view (frame 2.jpg)
    pos.set(-0.22, 1.16, 0.44);
    tar.set(-0.22, 0.98, -0.45);

    const tl = gsap.timeline();
    tl.to(pos, { x: -0.18, y: 1.38, z: 0.62, duration: 4.0, ease: 'sine.inOut' }, 0)
      .to(tar, { x: -0.15, y: 0.84, z: -0.05, duration: 4.0, ease: 'sine.inOut' }, 0)
      .to(pos, { x: 0.06, y: 1.54, z: 0.68, duration: 4.5, ease: 'power1.inOut' }, 4.0)
      .to(tar, { x: 0.04, y: 0.82, z: 0.04, duration: 4.5, ease: 'power1.inOut' }, 4.0);
  }

  selectSection(sectionId) {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    this.activeSectionId = sectionId;
    this.soundManager.playSelectSound();
    this.cameraController.transitionToSection(sectionId);

    const buttons = this.menuNavEl.querySelectorAll('.paper-menu-item');
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sectionId === sectionId);
    });

    if (section.content) {
      this.panelKickerEl.textContent = section.kicker || '';
      this.panelTitleEl.textContent = `${section.title} — ${section.subtitle}`;
      this.panelBodyEl.innerHTML = section.content;
      this.panelEl.classList.remove('hidden');
    } else {
      this.panelEl.classList.add('hidden');
    }

    this.dbgSection.textContent = sectionId;
    setTimeout(() => this.syncDebugSlidersToCurrent(), 50);
  }

  handleObjectHover(section, clientX, clientY) {
    if (!section) {
      this.tooltipEl.classList.add('hidden');
      return;
    }
    this.tooltipTitleEl.textContent = `${section.title} (${section.subtitle})`;
    this.tooltipSubEl.textContent = section.tooltip || 'Click to inspect';
    this.tooltipEl.style.left = `${clientX}px`;
    this.tooltipEl.style.top = `${clientY}px`;
    this.tooltipEl.classList.remove('hidden');
  }

  updateAudioHUD(playing) {
    this.audioLed.classList.toggle('active', playing);
    this.audioLabel.textContent = playing ? 'MAFIA THEME: ON' : 'MAFIA THEME: OFF';
  }

  toggleDebugPanel() {
    this.debugPanel.classList.toggle('hidden');
    this.syncDebugSlidersToCurrent();
  }

  syncDebugSlidersToCurrent() {
    const section = SECTIONS.find((s) => s.id === this.activeSectionId) || SECTIONS[0];
    this.sliders.camX.value = section.cameraPos.x;
    this.sliders.camY.value = section.cameraPos.y;
    this.sliders.camZ.value = section.cameraPos.z;
    this.sliders.tarX.value = section.cameraTarget.x;
    this.sliders.tarY.value = section.cameraTarget.y;
    this.sliders.tarZ.value = section.cameraTarget.z;
    this.updateDebugReadout();
  }

  updateDebugReadout() {
    const p = this.cameraController.basePosition;
    const t = this.cameraController.lookAtTarget;
    this.dbgPos.textContent = `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
    this.dbgTarget.textContent = `${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}`;
  }
}
