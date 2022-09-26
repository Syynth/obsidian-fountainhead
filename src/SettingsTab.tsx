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
      .setName('Is it cool?')
      .setDesc('Probably ¯\\_(ツ)_/¯')
      .addToggle(toggle =>
        toggle
          .setTooltip('You know what to do')
          .setValue(this.plugin.settings.isCool)
          .onChange(async value => {
            this.plugin.settings.isCool = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('This one\'s boring')
      .setDesc('See?')
      .addText(text =>
        text.setPlaceholder('Type stuff dummy')
          .setValue(this.plugin.settings.testString)
          .onChange(async value => {
            this.plugin.settings.testString = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
