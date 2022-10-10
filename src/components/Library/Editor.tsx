import Form from '@rjsf/chakra-ui';
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
import { useRecord, useSchema } from '~/hooks/library';
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

  const { schema, uiSchema } = useSchema(resource);

  const autoSave = useCallback(
    debounce(
      async (formData: Record<string, any> | null) => {
        console.log('autosaving', formData, path);
        const targetPath = (await save?.(formData)) ?? null;
        console.log('autosaved to', targetPath);
        setPath(targetPath);
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
    if (record === null && path === null) {
      setFormData({});
    }
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
    record,
    schema,
    uiSchema,
    formData,
    handleChange,
    handleSubmit,
  };
}

export function Editor(props: UseEditorProps) {
  const { record, schema, uiSchema, formData, handleChange, handleSubmit } =
    useEditor(props);

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
      <pre>{props.path}</pre>
      <pre>{JSON.stringify(record, null, 2)}</pre>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      {schema && (
        <Form
          onChange={handleChange}
          formData={formData}
          onSubmit={handleSubmit}
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
        />
      )}
    </VStack>
  );
}
