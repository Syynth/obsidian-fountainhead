import { usePlugin, useVault } from '~/hooks/app';
import { useCallback, useEffect, useState } from 'react';
import { Notice, parseYaml, stringifyYaml, Vault } from 'obsidian';
import { findFrontmatter, replaceFrontmatter } from '~/utils';
import { createFile } from '~/fs/utils';
import { useFileEvent, useWatchFile } from '~/hooks/file';

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

export function useRecord(type: string, path: string | null) {
  const vault = useVault();
  const plugin = usePlugin();
  const dir = useLibraryDir(type);
  const [record, setRecord] = useState<Record<string, any> | null>(null);

  const loadFile = useCallback(async () => {
    const text = await vault.adapter.read(path!);
    setRecord(parseYaml(findFrontmatter(text))?.fountainhead ?? null);
  }, [path]);

  useEffect(() => {
    if (path) {
      void loadFile();
    }
  }, [path]);

  useWatchFile(path, loadFile);

  const save = useCallback(
    async (data: Record<string, any>) => {
      try {
        const target = `${dir}/${data.filename}.md`.replace('//', '/');
        const changedPath = target !== path;
        if (path === null || !(await vault.adapter.exists(path))) {
          await createFile(
            vault,
            target,
            `---
${stringifyYaml({
  fountainhead: {
    resource: type,
    data,
  },
})}---`,
          );
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
          if (changedPath && !(await vault.adapter.exists(target))) {
            await plugin.app.fileManager.renameFile(file!, path);
          }
        }
        new Notice('Updated: ' + target);
        return true;
      } catch (err) {
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
