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
            minW={64}
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
    // <Tabs isFitted variant="solid-rounded">
    //   <TabList>
    //     <HStack spacing={2} w="full">
    //       <Tab rounded="md">Characters</Tab>
    //       <Tab rounded="md">Locations</Tab>
    //       <Tab rounded="md">Factions</Tab>
    //     </HStack>
    //   </TabList>
    //   <TabPanels pt={4}>
    //     <TabPanel>
    //       <HStack align="stretch" h="full" w="full" spacing={0}>
    //         <VStack
    //           flex="0"
    //           align="stretch"
    //           justify="space-between"
    //           spacing={4}
    //           minW={64}
    //         >
    //           <VStack spacing={4} align="stretch">
    //             <Button
    //               variant={path === null ? undefined : 'outline'}
    //               onClick={() => setPath(null)}
    //               mt="auto"
    //             >
    //               Add New
    //             </Button>
    //             <Divider />
    //             <Collection
    //               active={path}
    //               onSelect={setPath}
    //               resource="Characters"
    //             />
    //           </VStack>
    //         </VStack>
    //         <VStack
    //           px={4}
    //           pb={4}
    //           flex="1"
    //           align="stretch"
    //           sx={{
    //             '& div': {
    //               gridGap: 2,
    //             },
    //             '& .field-array > div > div > div > hr': {
    //               opacity: 0.1,
    //             },
    //             '& .field-object > div > div > h5': {
    //               fontSize: 'xl',
    //             },
    //           }}
    //         >
    //           <Editor resource="Characters" path={path} setPath={setPath} />
    //         </VStack>
    //       </HStack>
    //     </TabPanel>
    //     <TabPanel>
    //       <p>two!</p>
    //     </TabPanel>
    //     <TabPanel>
    //       <p>three!</p>
    //     </TabPanel>
    //   </TabPanels>
    // </Tabs>
  );
}
