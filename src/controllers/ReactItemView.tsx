import { ItemView, WorkspaceLeaf } from 'obsidian';
import { FountainheadPlugin } from '~/FountainheadPlugin';
import { FunctionComponent, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorView } from '~/components/ErrorView';
import { FountainheadProvider } from '~/hooks/app';
import { theme } from '~/theme';

export class ViewController<T extends string> {
  readonly plugin: FountainheadPlugin;
  view: ReactItemView<T>;
  viewType: string;

  constructor(plugin: FountainheadPlugin, viewType: string) {
    this.plugin = plugin;
    this.viewType = viewType;
  }

  async activateView() {
    this.plugin.app.workspace.detachLeavesOfType(this.viewType);

    await this.plugin.app.workspace.getLeaf(false).setViewState({
      type: this.viewType,
      active: true,
    });

    this.plugin.app.workspace.revealLeaf(
      this.plugin.app.workspace.getLeavesOfType(this.viewType)[0],
    );
  }

  async onunload() {
    this.plugin.app.workspace.detachLeavesOfType(this.viewType);
  }
}

export interface ViewConfig<T extends string> {
  plugin: FountainheadPlugin;
  leaf: WorkspaceLeaf;
  viewType: T;
  displayText: string;
  Component: FunctionComponent;
}

export class ReactItemView<T extends string> extends ItemView {
  readonly plugin: FountainheadPlugin;
  readonly viewType: T;
  readonly displayText: string;
  readonly Component: FunctionComponent;
  root: Root;

  constructor({ leaf, ...config }: ViewConfig<T>) {
    super(leaf);
    Object.assign(this, config);
  }

  getViewType() {
    return this.viewType;
  }

  getDisplayText() {
    return this.displayText;
  }

  async onOpen() {
    const { Component, plugin } = this;
    this.root = createRoot(this.containerEl.children[1]);
    this.root.render(
      <StrictMode>
        <ChakraProvider theme={theme}>
          <FountainheadProvider app={this.app} plugin={plugin}>
            <ErrorView>
              <Component />
            </ErrorView>
          </FountainheadProvider>
        </ChakraProvider>
      </StrictMode>,
    );
  }

  async onClose() {
    this.root.unmount();
  }
}
