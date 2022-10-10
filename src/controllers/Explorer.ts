import { ReactItemView, ViewController } from '~/controllers/ReactItemView';
import { EXPLORER_VIEW_TYPE } from '~/constants';
import { FountainheadPlugin } from '~/FountainheadPlugin';
import { WorkspaceLeaf } from 'obsidian';
import { ExplorerView } from '~/components/Explorer/ExplorerView';

export class Explorer extends ViewController<typeof EXPLORER_VIEW_TYPE> {
  constructor(plugin: FountainheadPlugin) {
    super(plugin, EXPLORER_VIEW_TYPE, 'left');
    plugin.registerView(EXPLORER_VIEW_TYPE, this.viewCreator);
  }

  viewCreator = (leaf: WorkspaceLeaf) => {
    return (this.view = new ReactItemView({
      leaf,
      plugin: this.plugin,
      Component: ExplorerView,
      displayText: 'Fountainhead Explorer',
      viewType: EXPLORER_VIEW_TYPE,
    }));
  };
}
