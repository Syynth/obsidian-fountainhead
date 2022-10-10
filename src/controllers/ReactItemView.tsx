import { ItemView, WorkspaceLeaf } from 'obsidian';
import { FountainheadPlugin } from '~/FountainheadPlugin';
import { FunctionComponent, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorView } from '~/components/ErrorView';
import { FountainheadProvider } from '~/hooks/app';
import { theme } from '~/theme';
import { PEN_ICON_NAME } from '~/constants';

export class ViewController<T extends string> {
  readonly plugin: FountainheadPlugin;
  view: ReactItemView<T>;
  viewType: string;
  readonly leafType: 'left' | 'right' | 'default';

  constructor(
    plugin: FountainheadPlugin,
    viewType: string,
    leafType: 'left' | 'right' | 'default',
  ) {
    this.plugin = plugin;
    this.viewType = viewType;
    this.leafType = leafType;
  }

  async activateView() {
    const { workspace } = this.plugin.app;
    workspace.detachLeavesOfType(this.viewType);

    let leaf;
    switch (this.leafType) {
      case 'left':
        leaf = workspace.getLeftLeaf(false);
        break;
      case 'right':
        leaf = workspace.getRightLeaf(false);
        break;
      default:
        leaf = workspace.getLeaf(false);
        break;
    }
    await leaf.setViewState({
      type: this.viewType,
      active: true,
    });

    workspace.revealLeaf(workspace.getLeavesOfType(this.viewType)[0]);
    return this;
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

  getIcon(): string {
    return PEN_ICON_NAME;
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
