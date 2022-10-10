import { Button, Divider, HStack, Tab, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Editor } from '~/components/Library/Editor';
import { useSettings } from '~/hooks/app';
import { DataTabs } from '~/components/DataTabs';
import { Collection } from '~/components/Library/Collection';

export function LibraryView() {
  const { settings } = useSettings();
  const [resourcePaths, setResourcePaths] = useState<
    Record<string, string | null>
  >(Object.fromEntries(settings.collections.map(resource => [resource, null])));
  function setResourcePath(resource: string) {
    return (path: string | null) =>
      setResourcePaths({
        ...resourcePaths,
        [resource]: path,
      });
  }

  return (
    <DataTabs
      items={settings.collections}
      getTab={resource => <Tab>{resource}</Tab>}
      getContent={resource => (
        <HStack align="stretch" h="full" w="full" spacing={0}>
          <VStack
            flex="0"
            align="stretch"
            justify="space-between"
            spacing={4}
            minW={48}
          >
            <VStack spacing={4} align="stretch">
              <Button
                variant={
                  resourcePaths[resource] === null ? undefined : 'outline'
                }
                onClick={() => setResourcePath(resource)(null)}
                mt="auto"
              >
                Add New
              </Button>
              <Divider />
              <Collection
                active={resourcePaths[resource]}
                onSelect={setResourcePath(resource)}
                resource={resource}
              />
            </VStack>
          </VStack>
          <Editor
            path={resourcePaths[resource]}
            setPath={setResourcePath(resource)}
            resource={resource}
          />
        </HStack>
      )}
    />
  );
}
