/**
 * MAFIA 1 DOM MENU, DOSSIER PANEL & CAMERA TUNER UI
 * -------------------------------------------------
 * Connects `src/config.js` sections to the left-side menu, right-side dossier overlay,
 * 3D hover tooltips, and live Camera Tuner [C] panel.
 */

import { SITE_META, SECTIONS } from '../config.js';

export class MenuUI {
  constructor({ cameraController, soundManager }) {
    this.cameraController = cameraController;
    this.soundManager = soundManager;
    this.activeSectionId = 'overview';

    // DOM elements
    this.titleEl = document.getElementById('site-title');
    this.subtitleEl = document.getElementById('site-subtitle');
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

    this.introOverlay = document.getElementById('intro-overlay');
    this.btnEnter = document.getElementById('btn-enter');

    this.init();
  }

  init() {
    this.titleEl.textContent = SITE_META.title;
    this.subtitleEl.textContent = SITE_META.subtitle;

    this.renderMenuItems();
    this.bindEvents();
    this.syncDebugSlidersToCurrent();
  }

  renderMenuItems() {
    this.menuNavEl.innerHTML = '';
    SECTIONS.forEach((section) => {
      const btn = document.createElement('button');
      btn.className = `menu-item ${section.id === this.activeSectionId ? 'active' : ''}`;
      btn.dataset.sectionId = section.id;
      btn.innerHTML = `
        <span>${section.title}</span>
        <span class="menu-item-sub">${section.subtitle}</span>
      `;

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
    // Enter button unlocks WebAudio and starts dramatic zoom into the office
    this.btnEnter.addEventListener('click', () => {
      this.introOverlay.classList.add('dismissed');
      const playing = this.soundManager.toggle();
      this.updateAudioHUD(playing);
      this.soundManager.playSelectSound();
      this.selectSection('overview');
    });

    this.btnBack.addEventListener('click', () => {
      this.selectSection('overview');
    });

    this.btnAudio.addEventListener('click', () => {
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

    // Live slider updates for Camera Tuner
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

  selectSection(sectionId) {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    this.activeSectionId = sectionId;
    this.soundManager.playSelectSound();
    this.cameraController.transitionToSection(sectionId);

    // Update active state on menu items
    const buttons = this.menuNavEl.querySelectorAll('.menu-item');
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sectionId === sectionId);
    });

    // Show or hide the right-side dossier content panel
    if (section.content) {
      this.panelKickerEl.textContent = section.kicker || '';
      this.panelTitleEl.textContent = section.title;
      this.panelBodyEl.innerHTML = section.content;
      this.panelEl.classList.remove('hidden');
      this.mainMenuEl.classList.add('minimized');
    } else {
      this.panelEl.classList.add('hidden');
      this.mainMenuEl.classList.remove('minimized');
    }

    this.dbgSection.textContent = sectionId;
    setTimeout(() => this.syncDebugSlidersToCurrent(), 50);
  }

  handleObjectHover(section, clientX, clientY) {
    if (!section) {
      this.tooltipEl.classList.add('hidden');
      return;
    }
    this.tooltipTitleEl.textContent = `${section.title} — ${section.subtitle}`;
    this.tooltipSubEl.textContent = section.tooltip || 'Click to inspect';
    this.tooltipEl.style.left = `${clientX}px`;
    this.tooltipEl.style.top = `${clientY}px`;
    this.tooltipEl.classList.remove('hidden');
  }

  updateAudioHUD(playing) {
    this.audioLed.classList.toggle('active', playing);
    this.audioLabel.textContent = playing ? 'GRAMOPHONE: ON' : 'GRAMOPHONE: OFF';
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
