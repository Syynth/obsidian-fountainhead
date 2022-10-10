import { Notice, parseYaml, Vault } from 'obsidian';
import { useCallback, useEffect, useState } from 'react';
import { createFile } from '~/fs/utils';
import { record as recordTemplate } from '~/fs/templates';
import { usePlugin, useVault } from '~/hooks/app';
import { useFileEvent, useWatchFile } from '~/hooks/file';
import { findFrontmatter, replaceFrontmatter } from '~/utils';

export function useLibraryDir(resource?: string) {
  const { settings } = usePlugin();
  return (
    settings.projectDirectory +
    '/Library' +
    (resource ? '/' + resource : '')
  ).replace('//', '/');
}

async function getResources(vault: Vault, dir: string) {
  const { files } = await vault.adapter.list(dir);
  return files
    .filter(file => file.endsWith('md'))
    .filter(file => !file.endsWith('Schema.md'))
    .map(file => file.replace('//', '/'));
}

export function useCollection(type: string) {
  const plugin = usePlugin();
  const dir = useLibraryDir(type);
  const vault = plugin.app.vault;

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

export function useRecord({
  type,
  path,
  onPathChanged,
}: {
  type: string;
  path: string | null;
  onPathChanged: (path: string) => void;
}) {
  const vault = useVault();
  const plugin = usePlugin();
  const dir = useLibraryDir(type);
  const [record, setRecord] = useState<Record<string, any> | null>(null);

  const loadFile = useCallback(async () => {
    const text = await vault.adapter.read(path!);
    const nextRecord = parseYaml(findFrontmatter(text))?.fountainhead ?? null;
    setRecord(nextRecord);
  }, [path]);

  useEffect(() => {
    if (path) {
      void loadFile();
    }
  }, [path]);

  useWatchFile(path, loadFile);

  const save = useCallback(
    async (data: Record<string, any> | null) => {
      if (data === null) return;
      try {
        const target = `${dir}/${data.filename}.md`.replace('//', '/');
        const changedPath = target !== path;
        if (path === null || !(await vault.adapter.exists(path))) {
          await createFile(vault, target, recordTemplate(type, data));
        } else {
          const text = await vault.adapter.read(path);
          const files = vault.getMarkdownFiles();
          const file = files.find(file => file.path === path);
          await vault.modify(
            file!,
            replaceFrontmatter(text, fm => {
              return {
                ...fm,
                fountainhead: {
                  ...fm?.fountainhead,
                  data,
                },
              };
            }),
          );
          const exists = await vault.adapter.exists(target);
          if (changedPath && !exists) {
            await plugin.app.fileManager.renameFile(file!, target);
            onPathChanged(target);
          }
        }

        return true;
      } catch (err) {
        new Notice(
          'Fountainhead: An error occurred updating ' +
            type +
            '.\n' +
            err.message,
        );
        console.error(err);
      }
    },
    [plugin, path, type, record],
  );

  if (path === null) {
    return { record: null, save: null };
  }

  return { record: record?.data ?? null, save };
}

export function useSchema(type: string) {
  const dir = useLibraryDir(type);
}
