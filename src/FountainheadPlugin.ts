import { Notice, Plugin } from 'obsidian';
import { FountainheadSettings } from '~/types';
import { DEFAULT_SETTINGS } from '~/constants';
import { FountainheadSettingsTab } from "~/SettingsTab";

export class FountainheadPlugin extends Plugin {
  settings: FountainheadSettings;

  async onload() {
    await this.loadSettings();
  }

  onunload() {
    super.onunload();
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      'highlight-glyph',
      'Fountainhead',
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new Notice('This will open the fountainhead project manager');
      },
    );

    // Perform additional things with the ribbon
    ribbonIconEl.addClass('fountainhead-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Parenthetical');

    this.addSettingTab(new FountainheadSettingsTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
