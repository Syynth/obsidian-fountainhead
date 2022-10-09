import { usePlugin, useVault } from '~/hooks/app';
import { useEffect, useState } from 'react';
import { Button, Skeleton, VStack } from '@chakra-ui/react';
import { prettyName } from '~/fs/utils';
import { FountainheadPlugin } from '~/FountainheadPlugin';

interface LibraryListProps {
  resource: 'Characters';

  onSelect(path: string): void;
}

async function getResources(plugin: FountainheadPlugin, resource: string) {
  const { files } = await plugin.app.vault.adapter.list(
    `${plugin.settings.projectDirectory}/Library/${resource}`,
  );
  return files.filter(file => file.endsWith('md'));
}

export function LibraryList({ resource, onSelect }: LibraryListProps) {
  const vault = useVault();
  const plugin = usePlugin();
  const [items, setItems] = useState<string[]>([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    (async () => {
      setItems(await getResources(plugin, resource));
      setPending(false);
    })();
  }, [plugin]);

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
        <Button onClick={() => onSelect(item.replace('//', '/'))} key={item}>
          {prettyName(item)}
        </Button>
      ))}
    </>
  );
}
