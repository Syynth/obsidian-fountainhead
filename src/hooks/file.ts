import { TAbstractFile } from 'obsidian';
import { useVault } from '~/hooks/app';
import { useEffect } from 'react';

export function useFileEvent(
  handler: (ev: TAbstractFile) => void,
  filter: (ev: TAbstractFile) => boolean = () => true,
) {
  const vault = useVault();
  useEffect(() => {
    function filteredHandler(ev: TAbstractFile) {
      if (filter(ev)) {
        handler(ev);
      }
    }
    vault.on('modify', filteredHandler);
    vault.on('create', filteredHandler);
    vault.on('delete', filteredHandler);
    vault.on('rename', filteredHandler);
    return () => {
      vault.off('modify', filteredHandler);
      vault.off('create', filteredHandler);
      vault.off('delete', filteredHandler);
      vault.off('rename', filteredHandler);
    };
  }, [vault, handler, filter]);
}

export function useWatchFile(
  path: string | null,
  handler: (ev: TAbstractFile) => void,
) {
  const vault = useVault();
  useEffect(() => {
    if (path === null) return;
    function filteredHandler(ev: TAbstractFile) {
      if (ev.path === path) {
        handler(ev);
      }
    }
    vault.on('modify', filteredHandler);
    vault.on('create', filteredHandler);
    vault.on('delete', filteredHandler);
    vault.on('rename', filteredHandler);
    return () => {
      vault.off('modify', filteredHandler);
      vault.off('create', filteredHandler);
      vault.off('delete', filteredHandler);
      vault.off('rename', filteredHandler);
    };
  }, [vault, handler]);
}
