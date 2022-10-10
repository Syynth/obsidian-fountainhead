import { TAbstractFile } from 'obsidian';
import { useVault } from '~/hooks/app';
import { useEffect, useRef } from 'react';

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
  handler: (ev: TAbstractFile | null, contents: string) => void,
  firstRun?: boolean,
) {
  const hasFirstRun = useRef(!firstRun);
  const vault = useVault();
  useEffect(() => {
    hasFirstRun.current = !firstRun;
  }, [path]);
  useEffect(() => {
    (async () => {
      if (!hasFirstRun.current && path) {
        hasFirstRun.current = true;
        if (await vault.adapter.exists(path)) {
          handler(null, await vault.adapter.read(path));
        }
      }
    })();
  }, [hasFirstRun, path]);
  useEffect(() => {
    if (path === null) return;
    async function filteredHandler(ev: TAbstractFile) {
      if (ev.path.toLowerCase() === path?.toLowerCase()) {
        handler(ev, await vault.adapter.read(ev.path));
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
