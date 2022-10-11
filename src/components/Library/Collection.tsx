import { useEffect, useState } from 'react';
import { Button, Skeleton, VStack } from '@chakra-ui/react';
import { prettyName } from '~/fs/utils';
import { useCollection } from '~/hooks/library';

interface LibraryListProps {
  resource: string;
  active: string | null;
  onSelect(path: string): void;
}

export function Collection({ resource, active, onSelect }: LibraryListProps) {
  const { files, pending } = useCollection(resource);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad && !pending) {
      setFirstLoad(false);
      onSelect(files[0] ?? null);
    }
  }, [files, firstLoad, pending, onSelect]);

  return pending ? (
    <VStack spacing={4} align="stretch">
      <Skeleton h={16} />
      <Skeleton h={16} />
      <Skeleton h={16} />
    </VStack>
  ) : (
    <>
      {files.map(item => (
        <Button
          variant={
            item.toLowerCase() === active?.toLowerCase() ? undefined : 'outline'
          }
          onClick={() => onSelect(item)}
          key={item}
        >
          {prettyName(item)}
        </Button>
      ))}
    </>
  );
}
