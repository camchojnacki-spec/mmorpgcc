/**
 * Character creation scene — class, race, background, appearance, attributes.
 * Pure UI scene — sends final character data to server for persistence.
 */

import Phaser from 'phaser';
import {
  ATTRIBUTE_KEYS,
  DEFAULT_ALLOCATION_RULES,
  CLASS_IDS,
  RACE_IDS,
  BACKGROUND_IDS,
} from '@mmorpg/shared';
import type { AttributeKey, ClassId, RaceId, BackgroundId } from '@mmorpg/shared';

// Class starting attribute bonuses (from D2)
const CLASS_BONUSES: Record<string, Partial<Record<AttributeKey, number>>> = {
  sentinel: { soma: 3, reflex: 1, vigor: 2, resolve: 1, acuity: 1 },
  catalyst: { reflex: 1, cortex: 3, resolve: 1, acuity: 1, phlux: 2 },
  conduit: { vigor: 1, cortex: 1, resolve: 3, acuity: 1, presence: 2 },
};

const CLASS_LABELS: Record<string, string> = {
  sentinel: 'SENTINEL — Somatic Primer',
  catalyst: 'CATALYST — Cortical Primer',
  conduit: 'CONDUIT — Sympathetic Primer',
};

const RACE_LABELS: Record<string, string> = {
  baseline: 'Baseline',
  threaded: 'Threaded',
};

const BG_LABELS: Record<string, string> = {
  sublevel_resident: 'Sublevel Resident',
  lapsed_clerk: 'Lapsed Clerk',
  street_medic: 'Street Medic',
  salvage_runner: 'Salvage Runner',
  disgraced_academic: 'Disgraced Academic',
};

interface CreationState {
  name: string;
  classId: ClassId;
  raceId: RaceId;
  backgroundId: BackgroundId;
  freePoints: Record<AttributeKey, number>;
  remainingPoints: number;
}

export class CharacterCreateScene extends Phaser.Scene {
  private state!: CreationState;
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'CharacterCreateScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    this.state = {
      name: '',
      classId: 'sentinel',
      raceId: 'threaded',
      backgroundId: 'sublevel_resident',
      freePoints: Object.fromEntries(ATTRIBUTE_KEYS.map((k) => [k, 0])) as Record<AttributeKey, number>,
      remainingPoints: DEFAULT_ALLOCATION_RULES.freePoints,
    };

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1a);

    // Title
    this.add.text(width / 2, 30, 'CHARACTER CREATION', {
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.renderUI();
  }

  private renderUI(): void {
    // Clear previous UI
    this.uiElements.forEach((el) => el.destroy());
    this.uiElements = [];

    const { width } = this.scale;
    const rules = DEFAULT_ALLOCATION_RULES;
    let y = 80;

    // ── Name input prompt ───────────────────────────────────────────
    const nameText = this.add.text(60, y, `Name: ${this.state.name || '[Press N to set name]'}`, {
      fontSize: '18px',
      color: '#aaaaff',
    });
    this.uiElements.push(nameText);
    y += 40;

    // ── Class selector ──────────────────────────────────────────────
    this.add.text(60, y, 'Primer Sequence:', { fontSize: '16px', color: '#888888' });
    y += 24;
    for (const cls of CLASS_IDS) {
      const isSelected = this.state.classId === cls;
      const btn = this.add.text(80, y, `${isSelected ? '> ' : '  '}${CLASS_LABELS[cls]}`, {
        fontSize: '16px',
        color: isSelected ? '#ffcc00' : '#aaaaaa',
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.state.classId = cls;
        this.renderUI();
      });
      this.uiElements.push(btn);
      y += 22;
    }
    y += 10;

    // ── Race selector ───────────────────────────────────────────────
    this.add.text(60, y, 'Variant:', { fontSize: '16px', color: '#888888' });
    y += 24;
    for (const race of RACE_IDS) {
      const isSelected = this.state.raceId === race;
      const btn = this.add.text(80, y, `${isSelected ? '> ' : '  '}${RACE_LABELS[race]}`, {
        fontSize: '16px',
        color: isSelected ? '#ffcc00' : '#aaaaaa',
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.state.raceId = race;
        this.renderUI();
      });
      this.uiElements.push(btn);
      y += 22;
    }
    y += 10;

    // ── Background selector ─────────────────────────────────────────
    this.add.text(60, y, 'Background:', { fontSize: '16px', color: '#888888' });
    y += 24;
    for (const bg of BACKGROUND_IDS) {
      const isSelected = this.state.backgroundId === bg;
      const btn = this.add.text(80, y, `${isSelected ? '> ' : '  '}${BG_LABELS[bg]}`, {
        fontSize: '16px',
        color: isSelected ? '#ffcc00' : '#aaaaaa',
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.state.backgroundId = bg;
        this.renderUI();
      });
      this.uiElements.push(btn);
      y += 22;
    }

    // ── Attribute allocation (right side) ───────────────────────────
    const attrX = width / 2 + 40;
    let attrY = 80;

    this.add.text(attrX, attrY, `Attribute Allocation (${this.state.remainingPoints} points remaining)`, {
      fontSize: '18px',
      color: '#aaaaff',
    });
    attrY += 30;

    const classBonuses = CLASS_BONUSES[this.state.classId] ?? {};

    for (const attr of ATTRIBUTE_KEYS) {
      const base = rules.basePerAttribute;
      const classBonus = classBonuses[attr] ?? 0;
      const free = this.state.freePoints[attr];
      const total = base + classBonus + free;

      const label = this.add.text(attrX, attrY,
        `${attr.toUpperCase().padEnd(10)} ${String(total).padStart(2)} (${base}+${classBonus}+${free})`,
        { fontSize: '15px', color: '#cccccc', fontFamily: 'monospace' },
      );
      this.uiElements.push(label);

      // Minus button
      if (free > 0) {
        const minus = this.add.text(attrX + 320, attrY, '[-]', {
          fontSize: '15px', color: '#ff6666',
        }).setInteractive({ useHandCursor: true });
        minus.on('pointerdown', () => {
          this.state.freePoints[attr]--;
          this.state.remainingPoints++;
          this.renderUI();
        });
        this.uiElements.push(minus);
      }

      // Plus button
      if (this.state.remainingPoints > 0 && total < rules.maxPerAttributeAtCreation) {
        const plus = this.add.text(attrX + 360, attrY, '[+]', {
          fontSize: '15px', color: '#66ff66',
        }).setInteractive({ useHandCursor: true });
        plus.on('pointerdown', () => {
          this.state.freePoints[attr]++;
          this.state.remainingPoints--;
          this.renderUI();
        });
        this.uiElements.push(plus);
      }

      attrY += 24;
    }

    // ── Derived stats preview ───────────────────────────────────────
    attrY += 15;
    const attrs = this.computeFinalAttributes();
    const hp = 100 + attrs.vigor * 15 + attrs.soma * 5;
    const stamina = 80 + attrs.vigor * 8 + attrs.soma * 4;
    const strand = 50 + attrs.cortex * 12 + attrs.resolve * 3;
    const critChance = 5 + attrs.reflex * 0.5 + attrs.phlux * 0.3;

    const preview = [
      `HP: ${hp}  |  Stamina: ${stamina}  |  Strand: ${strand}`,
      `Crit: ${critChance.toFixed(1)}%  |  Dodge: ${(attrs.reflex * 0.6 + attrs.acuity * 0.2).toFixed(1)}%`,
      `Inventory: ${20 + Math.floor(attrs.soma / 3)} slots`,
    ].join('\n');

    const previewText = this.add.text(attrX, attrY, preview, {
      fontSize: '14px',
      color: '#88ff88',
      fontFamily: 'monospace',
    });
    this.uiElements.push(previewText);

    // ── Create button ───────────────────────────────────────────────
    const createBtn = this.add.text(width / 2, 680, '[ CREATE CHARACTER ]', {
      fontSize: '22px',
      color: this.state.remainingPoints === 0 && this.state.name ? '#00ff00' : '#555555',
      backgroundColor: '#222222',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    createBtn.on('pointerdown', () => {
      if (this.state.remainingPoints === 0 && this.state.name) {
        this.createCharacter();
      }
    });
    this.uiElements.push(createBtn);

    // ── Name input via N key ────────────────────────────────────────
    this.input.keyboard!.removeAllListeners('keydown-N');
    this.input.keyboard!.on('keydown-N', () => {
      // Simple prompt — will be replaced with proper input field
      const name = window.prompt('Enter character name:');
      if (name && name.trim().length >= 2 && name.trim().length <= 20) {
        this.state.name = name.trim();
        this.renderUI();
      }
    });
  }

  private computeFinalAttributes(): Record<AttributeKey, number> {
    const rules = DEFAULT_ALLOCATION_RULES;
    const classBonuses = CLASS_BONUSES[this.state.classId] ?? {};

    return Object.fromEntries(
      ATTRIBUTE_KEYS.map((k) => [
        k,
        rules.basePerAttribute + (classBonuses[k] ?? 0) + this.state.freePoints[k],
      ]),
    ) as Record<AttributeKey, number>;
  }

  private createCharacter(): void {
    const attrs = this.computeFinalAttributes();
    console.log('Creating character:', {
      name: this.state.name,
      classId: this.state.classId,
      raceId: this.state.raceId,
      backgroundId: this.state.backgroundId,
      attributes: attrs,
    });

    // TODO: Send to server via NetworkManager, persist, then transition to TownScene
    this.scene.start('TownScene');
  }
}
