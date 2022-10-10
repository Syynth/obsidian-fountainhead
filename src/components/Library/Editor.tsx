import Form from '@rjsf/chakra-ui';
import { CharacterSchema, CharacterUISchema } from '~/schemas/character';
import validator from '@rjsf/validator-ajv6';
import { VStack } from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IChangeEvent } from '@rjsf/core';
import { useRecord } from '~/hooks/library';
import { debounce, Notice, parseYaml } from 'obsidian';
import { findFrontmatter } from '~/utils';
import { useVault } from '~/hooks/app';

interface UseEditorProps {
  path: string | null;
  setPath: Dispatch<SetStateAction<string | null>>;
  resource: string;
}

function useEditor({ path, setPath, resource }: UseEditorProps) {
  const vault = useVault();
  const [formData, setFormData] = useState<any>();

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

  const { record, save } = useRecord({
    type: resource,
    path,
    onPathChanged: startEditing,
  });

  const autoSave = useCallback(
    debounce(
      (formData: Record<string, any> | null) => {
        save?.(formData);
      },
      500,
      true,
    ),
    [save],
  );

  function handleChange({ formData }: IChangeEvent) {
    setFormData(formData);
    if (record) {
      autoSave(formData);
    }
  }

  async function handleSubmit({ formData }: IChangeEvent) {
    await save?.(formData ?? {});
    new Notice('Updated: ' + path);
  }

  useEffect(() => {
    setFormData(record);
  }, [record]);

  useEffect(() => {
    void startEditing(path);
  }, [path, resource]);

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}

export function Editor(props: UseEditorProps) {
  const { formData, handleChange, handleSubmit } = useEditor(props);

  return (
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
        onSubmit={handleSubmit}
        schema={CharacterSchema}
        uiSchema={CharacterUISchema}
        validator={validator}
      />
    </VStack>
  );
}
