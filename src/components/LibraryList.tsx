import { usePlugin, useVault } from '~/hooks/app';
import { useEffect, useState } from 'react';
import { Button, Skeleton, VStack } from '@chakra-ui/react';
import { prettyName } from '~/fs/utils';
import { FountainheadPlugin } from '~/FountainheadPlugin';

interface LibraryListProps {
  resource: 'Characters';
  active: string | null;
  onSelect(path: string): void;
}

async function getResources(plugin: FountainheadPlugin, resource: string) {
  const { files } = await plugin.app.vault.adapter.list(
    `${plugin.settings.projectDirectory}/Library/${resource}`,
  );
  return files.filter(file => file.endsWith('md'));
}

export function LibraryList({ resource, active, onSelect }: LibraryListProps) {
  const vault = useVault();
  const plugin = usePlugin();
  const [items, setItems] = useState<string[]>([]);
  const [pending, setPending] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    (async () => {
      const items = (await getResources(plugin, resource)).map(item =>
        item.replace('//', '/'),
      );
      setItems(items);
      setPending(false);
      if (firstLoad) {
        setFirstLoad(false);
        onSelect(items[0] ?? null);
      }
    })();
  }, [plugin, firstLoad, onSelect]);

  useEffect(() => {
    async function handler() {
      setItems(await getResources(plugin, resource));
    }

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
  }, [vault]);

  return pending ? (
    <VStack spacing={4} align="stretch">
      <Skeleton h={16} />
      <Skeleton h={16} />
      <Skeleton h={16} />
    </VStack>
  ) : (
    <>
      {items.map(item => (
        <Button
          variant={item === active ? undefined : 'outline'}
          onClick={() => onSelect(item)}
          key={item}
        >
          {prettyName(item)}
        </Button>
      ))}
    </>
  );
}
