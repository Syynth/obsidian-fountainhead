import { Notice, parseYaml, Vault } from 'obsidian';
import { useCallback, useEffect, useState } from 'react';
import { createFile, normalize } from '~/fs/utils';
import { record as recordTemplate } from '~/fs/templates';
import { usePlugin, useVault } from '~/hooks/app';
import { useFileEvent, useWatchFile } from '~/hooks/file';
import {
  findFrontmatter,
  findTaggedCodeBlock,
  replaceFrontmatter,
} from '~/utils';
import { JSONSchema7 } from 'json-schema';
import * as JSON5 from 'json5';
import { UiSchema } from '@rjsf/chakra-ui';

export function useLibraryDir(resource?: string, name?: string) {
  const { settings } = usePlugin();
  return normalize(
    settings.projectDirectory +
      '/Library' +
      (resource ? '/' + resource : '') +
      (name ? '/' + name : ''),
  );
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

  const saveNew = useCallback(
    async (data: Record<string, any> | null): Promise<string | null> => {
      if (data === null) return null;
      const target = normalize(`${dir}/${data.filename}.md`);
      if (!(await vault.adapter.exists(target))) {
        await createFile(vault, target, recordTemplate(type, data));
        new Notice('Created new library item: ' + data.filename);
        return target;
      } else {
        new Notice('A library with that name already exists');
      }
      return null;
    },
    [plugin, type],
  );

  const save = useCallback(
    async (data: Record<string, any> | null): Promise<string | null> => {
      if (data === null) return null;
      try {
        const target = normalize(`${dir}/${data.filename}.md`);
        const changedPath = target !== path;
        if (path === null || !(await vault.adapter.exists(path))) {
          await createFile(vault, target, recordTemplate(type, data));
          return target;
        } else {
          const text = await vault.adapter.read(path);
          const files = vault.getMarkdownFiles();
          const file = files.find(file => file.path === path);
          console.log(
            'searching for',
            path,
            'to modify, target is',
            target,
            'in',
            files,
            ', found',
            file,
          );
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
            console.log('moved', path, 'to', target);
            return target;
          } else {
            console.log('did not move');
          }
          return target;
        }
      } catch (err) {
        new Notice(
          'Fountainhead: An error occurred updating ' +
            type +
            '.\n' +
            err.message,
        );
        console.error(err);
      }
      return null;
    },
    [plugin, path, type, record, dir],
  );

  if (path === null) {
    return { record: null, save: saveNew };
  }

  return { record: record?.data ?? null, save };
}

export function useSchema(type: string) {
  const path = useLibraryDir(type, '_Schema.md');
  const [schema, setSchema] = useState<JSONSchema7 | null>(null);
  const [uiSchema, setUiSchema] = useState<UiSchema | undefined>();
  useWatchFile(
    path,
    (ev, contents) => {
      setSchema(JSON5.parse(findTaggedCodeBlock(contents, 'data-schema')));
      setUiSchema(JSON5.parse(findTaggedCodeBlock(contents, 'ui-schema')));
    },
    true,
  );

  return { schema, uiSchema };
}
