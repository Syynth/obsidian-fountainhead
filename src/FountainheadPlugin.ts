import { Plugin } from 'obsidian';
import { FountainheadSettings } from '~/types';
import { DEFAULT_SETTINGS } from '~/constants';
import { FountainheadSettingsTab } from '~/controllers/Settings';
import { Library } from '~/controllers/Library';
import { ViewController } from '~/controllers/ReactItemView';
import { createFile, createFolder } from '~/fs/utils';

export class FountainheadPlugin extends Plugin {
  settings: FountainheadSettings;
  controllers: ViewController<any>[] = [];

  async onload() {
    await this.loadSettings();
    await this.initialize();
  }

  onunload() {
    super.onunload();
  }

  async initialize() {
    await this.clearControllers();

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      'highlight-glyph',
      'Fountainhead',
      async () => {
        // Called when the user clicks the icon.
        const lib = this.controllers.find(ctrl => ctrl instanceof Library);
        await lib?.activateView();
      },
    );

    // Perform additional things with the ribbon
    ribbonIconEl.addClass('fountainhead-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Parenthetical');

    this.controllers.push(new Library(this));
  }

  async clearControllers() {
    await Promise.allSettled(this.controllers.map(ctrl => ctrl.onunload()));
    this.controllers = [];
  }

  async loadSettings() {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(await this.loadData()),
    };

    this.settings.collections =
      this.settings.collections?.filter(str => str) ?? [];
    this.addSettingTab(new FountainheadSettingsTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async createLibrary() {
    const { projectDirectory } = this.settings;
    const { vault } = this.app;

    await createFolder(vault, projectDirectory + '/Library/Characters');
    await createFolder(vault, projectDirectory + '/Script');

    await createFile(
      vault,
      projectDirectory + '/Library/Characters/.index',
      `
---
tags: [library-index]
fountainhead:
  resource: Index
  type: Character-Index
---`,
    );
  }

  async handlePostProcessing() {}
}
