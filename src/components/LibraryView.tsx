import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/chakra-ui';
import { CharacterSchema, CharacterUISchema } from '~/schemas/character';

export function LibraryView() {
  return (
    <Form
      schema={CharacterSchema}
      uiSchema={CharacterUISchema}
      validator={validator}
    />
  );
}
