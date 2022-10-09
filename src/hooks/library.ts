import { usePlugin, useVault } from '~/hooks/app';
import { useCallback, useEffect, useState } from 'react';
import { Vault } from 'obsidian';

export function useLibraryDir() {
  const { settings } = usePlugin();
  return (settings.projectDirectory + '/Library').replace('//', '/');
}

async function getResources(vault: Vault, dir: string) {
  const { files } = await vault.adapter.list(dir);
  return files
    .filter(file => file.endsWith('md'))
    .map(file => file.replace('//', '/'));
}

function useFileEvent(handler: (ev: any) => void) {
  const vault = useVault();
  useEffect(() => {
    vault.on('modify', handler);
    vault.on('create', handler);
    vault.on('delete', handler);
    vault.on('rename', handler);
    return () => {
      vault.off('modify', handler);
      vault.off('create', handler);
      vault.off('delete', handler);
      vault.off('rename', handler);
    };
  }, [vault, handler]);
}

export function useCollection(type: string) {
  const plugin = usePlugin();
  const baseDir = useLibraryDir();
  const vault = plugin.app.vault;
  const dir = baseDir + '/' + type;

  const [pending, setPending] = useState(true);
  const [files, setFiles] = useState<string[]>([]);

  const getFiles = useCallback(async () => {
    setFiles(await getResources(vault, dir));
    setPending(false);
  }, [vault, dir]);

  useEffect(() => {
    (async () => {
      setFiles(await getResources(vault, dir));
      setPending(false);
    })();
  }, [vault, dir]);

  useFileEvent(getFiles);

  return {
    pending,
    files,
  };
}
