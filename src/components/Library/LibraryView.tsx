import {
  Button,
  Divider,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { Collection } from '~/components/Library/Collection';
import { useState } from 'react';
import { Editor } from '~/components/Library/Editor';

export function LibraryView() {
  const [path, setPath] = useState<null | string>(null);

  return (
    <Tabs isFitted variant="solid-rounded">
      <TabList>
        <HStack spacing={2} w="full">
          <Tab rounded="md">Characters</Tab>
          <Tab rounded="md">Locations</Tab>
          <Tab rounded="md">Factions</Tab>
        </HStack>
      </TabList>
      <TabPanels pt={4}>
        <TabPanel>
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
                  variant={path === null ? undefined : 'outline'}
                  onClick={() => setPath(null)}
                  mt="auto"
                >
                  Add New
                </Button>
                <Divider />
                <Collection
                  active={path}
                  onSelect={setPath}
                  resource="Characters"
                />
              </VStack>
            </VStack>
            <VStack
              px={4}
              pb={4}
              flex="1"
              align="stretch"
              sx={{
                '& div': {
                  gridGap: 2,
                },
                '& .field-array > div > div > div > hr': {
                  opacity: 0.1,
                },
                '& .field-object > div > div > h5': {
                  fontSize: 'xl',
                },
              }}
            >
              <Editor resource="Characters" path={path} setPath={setPath} />
            </VStack>
          </HStack>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
