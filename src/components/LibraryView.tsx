import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/chakra-ui';
import { CharacterSchema, CharacterUISchema } from '~/schemas/character';
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
import { IChangeEvent } from '@rjsf/core';
import { useVault } from '~/hooks/app';
import { parseYaml } from 'obsidian';
import { LibraryList } from '~/components/LibraryList';
import { useEffect, useState } from 'react';
import { findFrontmatter } from '~/utils';
import { useRecord } from '~/hooks/library';

export function LibraryView() {
  const vault = useVault();
  const [path, setPath] = useState<null | string>(null);
  const [formData, setFormData] = useState<any>();

  const { record, save } = useRecord({
    type: 'Characters',
    path,
    onPathChanged: startEditing,
  });

  useEffect(() => {
    setFormData(record);
  }, [record]);

  async function handleSubmit({ formData }: IChangeEvent) {
    await save?.(formData ?? {});
  }

  async function startEditing(next: null | string) {
    if (next === null) {
      setFormData(null);
      setPath(null);
      return;
    }
    const text = await vault.adapter.read(next);
    setFormData(parseYaml(findFrontmatter(text))?.fountainhead?.data ?? {});
    setPath(next);
  }

  function handleChange({ formData }: IChangeEvent) {
    setFormData(formData);
  }

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
                  onClick={() => startEditing(null)}
                  mt="auto"
                >
                  Add New
                </Button>
                <Divider />
                <LibraryList
                  active={path}
                  onSelect={startEditing}
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
              <Form
                onChange={handleChange}
                formData={formData}
                schema={CharacterSchema}
                uiSchema={CharacterUISchema}
                validator={validator}
                onSubmit={handleSubmit}
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
