import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/chakra-ui';
import { CharacterSchema, CharacterUISchema } from '~/schemas/character';
import {
  Button,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';

export function LibraryView() {
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
                <Button>Minnie</Button>
                <Button>Solstice</Button>
                <Button>Lala</Button>
              </VStack>
              <VStack align="stretch">
                <Button mt="auto">Add New</Button>
              </VStack>
            </VStack>
            <VStack
              px={4}
              pb={4}
              overflowY="scroll"
              maxH="80vh"
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
              <Form
                schema={CharacterSchema}
                uiSchema={CharacterUISchema}
                validator={validator}
              />
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
