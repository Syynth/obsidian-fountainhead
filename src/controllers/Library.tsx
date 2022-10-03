import { FountainheadPlugin } from '~/FountainheadPlugin';
import { LIBRARY_VIEW_TYPE } from '~/constants';
import { WorkspaceLeaf } from 'obsidian';
import { LibraryView } from '~/components/LibraryView';

import { ReactItemView, ViewController } from './ReactItemView';

export class Library extends ViewController<typeof LIBRARY_VIEW_TYPE> {
  constructor(plugin: FountainheadPlugin) {
    super(plugin, LIBRARY_VIEW_TYPE);
    plugin.registerView(LIBRARY_VIEW_TYPE, this.viewCreator);
  }

  viewCreator = (leaf: WorkspaceLeaf) => {
    console.log('registering view', this.viewType);
    return (this.view = new ReactItemView({
      leaf,
      plugin: this.plugin,
      Component: LibraryView,
      displayText: 'Fountainhead Library',
      viewType: LIBRARY_VIEW_TYPE,
    }));
  };
}
