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

    new Setting(containerEl)
      .setName('Fountainhead Project Folder')
      .setDesc('A folder path in your vault')
      .addText(text =>
        text
          .setPlaceholder('MyProject/')
          .setValue(this.plugin.settings.projectDirectory)
          .onChange(async value => {
            this.plugin.settings.projectDirectory = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Initialize Project')
      .setDesc("Create settings file in project folder if it doesn't exist")
      .addButton(btn => btn.setButtonText('Initialize'));
  }
}
