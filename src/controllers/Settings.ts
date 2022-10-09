import { App, PluginSettingTab, Setting } from 'obsidian';
import type { FountainheadPlugin } from '~/FountainheadPlugin';

export class FountainheadSettingsTab extends PluginSettingTab {
  plugin: FountainheadPlugin;

  constructor(app: App, plugin: FountainheadPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Fountainhead Settings' });
    const { settings } = this.plugin;

    new Setting(containerEl)
      .setName('Fountainhead Project Folder')
      .setDesc('A folder path in your vault')
      .addText(text =>
        text
          .setPlaceholder('MyProject/')
          .setValue(settings.projectDirectory)
          .onChange(async value => {
            settings.projectDirectory = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Initialize Project')
      .setDesc("Create settings file in project folder if it doesn't exist")
      .addButton(btn =>
        btn
          .setButtonText('Initialize')
          .onClick(() => this.plugin.createLibrary()),
      );

    new Setting(containerEl)
      .setName('Library Schemas')
      .setDesc('Comma separated list of schema names')
      .addTextArea(text =>
        text
          .setPlaceholder('Characters, Locations, Factions')
          .setValue(settings.collections?.join?.(', ') ?? '')
          .onChange(async value => {
            this.plugin.settings.collections =
              value
                ?.trim()
                .split(',')
                .map(col => col.trim()) ?? [];
            await this.plugin.saveSettings();
          }),
      );
  }
}
