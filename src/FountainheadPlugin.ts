import { addIcon, Plugin } from 'obsidian';
import { FountainheadSettings } from '~/types';
import { DEFAULT_SETTINGS, PEN_ICON, PEN_ICON_NAME } from '~/constants';
import { FountainheadSettingsTab } from '~/controllers/Settings';
import { Library } from '~/controllers/Library';
import { ViewController } from '~/controllers/ReactItemView';
import { createFile, createFolder } from '~/fs/utils';
import { schema } from '~/fs/templates';

export class FountainheadPlugin extends Plugin {
  settings: FountainheadSettings;
  controllers: ViewController<any>[] = [];

  private settingsListeners: Set<(arg: FountainheadSettings) => void> =
    new Set();

  async onload() {
    await this.loadSettings();
    await this.initialize();
  }

  onunload() {
    super.onunload();
  }

  async initialize() {
    addIcon(PEN_ICON_NAME, PEN_ICON);
    await this.clearControllers();
    this.settingsListeners.clear();

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      PEN_ICON_NAME,
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
    // this.controllers.push(await new Explorer(this).activateView());
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

    for (const listener of this.settingsListeners) {
      listener?.(this.settings);
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    for (const listener of this.settingsListeners) {
      listener?.(this.settings);
    }
  }

  addSettingsListener(listener: (arg: FountainheadSettings) => void) {
    this.settingsListeners.add(listener);
  }

  removeSettingsListener(listener: (arg: FountainheadSettings) => void) {
    this.settingsListeners.delete(listener);
  }

  async createLibrary() {
    const { projectDirectory } = this.settings;
    const { vault } = this.app;

    await createFolder(vault, projectDirectory + '/Script');
    await createFolder(vault, projectDirectory + '/Library');

    for (const collection of this.settings.collections) {
      const dir = projectDirectory + '/Library/' + collection;
      await createFolder(vault, dir);
      await createFile(vault, dir + '/_Schema.md', schema(collection));
    }
  }

  async handlePostProcessing() {}
}
