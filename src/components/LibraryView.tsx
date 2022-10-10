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
import { usePlugin, useVault } from '~/hooks/app';
import { createFile } from '~/fs/utils';
import { Notice, parseYaml, stringifyYaml, TAbstractFile } from 'obsidian';
import { LibraryList } from '~/components/LibraryList';
import { useCallback, useEffect, useState } from 'react';
import { findFrontmatter, replaceFrontmatter } from '~/utils';
import { useRecord } from '~/hooks/library';

export function LibraryView() {
  const vault = useVault();
  const plugin = usePlugin();
  const [editing, setEditing] = useState<null | string>(null);

  const { record, save } = useRecord('Character', editing);

  async function handleSubmit({ formData }: IChangeEvent) {
    const path =
      `${plugin.settings.projectDirectory}/Library/Characters/${formData.details.fullName}.md`.replace(
        '//',
        '/',
      );
    if (!editing) {
      await createFile(
        vault,
        path,
        `---
${stringifyYaml({
  fountainhead: {
    resource: 'Character',
    data: formData,
  },
})}---`,
      );
    } else {
      const text = await vault.adapter.read(editing);
      const files = vault.getMarkdownFiles();
      const file = files.find(file => file.path === editing);
      let hasNameChange = false;
      await vault.modify(
        file!,
        replaceFrontmatter(text, fm => {
          const name = fm?.fountainhead?.data?.details?.fullName;
          if (formData.details.fullName !== name) {
            hasNameChange = true;
          }
          return {
            ...fm,
            fountainhead: {
              ...fm?.fountainhead,
              data: formData,
            },
          };
        }),
        {},
      );
      if (hasNameChange && !(await vault.adapter.exists(path))) {
        await plugin.app.fileManager.renameFile(file!, path);
        setEditing(path);
      }
      new Notice('Updated record');
    }
  }

  const loadFile = useCallback(
    async (path: string) => {
      const text = await vault.adapter.read(path);
      setFormData(parseYaml(findFrontmatter(text))?.fountainhead?.data ?? {});
      setEditing(path);
    },
    [vault],
  );

  useEffect(() => {
    async function handler(file: TAbstractFile) {
      if (editing === file.path) {
        await loadFile(file.path);
      }
    }

    vault.on('modify', handler);
    return () => {
      vault.off('modify', handler);
    };
  }, [vault, loadFile, editing]);

  async function startEditing(next: null | string) {
    if (next === null) {
      setFormData(null);
      setEditing(null);
      return;
    }
    const text = await vault.adapter.read(next);
    setFormData(parseYaml(findFrontmatter(text))?.fountainhead?.data ?? {});
    setEditing(next);
  }

  const [formData, setFormData] = useState<any>();

  function handleChange({ formData }: IChangeEvent<any, any>) {
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
                  variant={editing === null ? undefined : 'outline'}
                  onClick={() => startEditing(null)}
                  mt="auto"
                >
                  Add New
                </Button>
                <Divider />
                <LibraryList
                  active={editing}
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
              <pre>{JSON.stringify(record, null, 2)}</pre>
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
