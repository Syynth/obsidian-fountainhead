import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

export function versionProperty(
  title: string,
  type: JSONSchema7TypeName = 'string',
): JSONSchema7 {
  return {
    type: 'array',
    title,
    items: {
      type,
    },
  };
}

export function logProperty(title: string): JSONSchema7 {
  return {
    type: 'array',
    title,
    items: {
      type: 'object',
      properties: {
        overwritePrevious: {
          type: 'boolean',
          title: 'Replace previous entries?',
        },
        summary: {
          type: 'string',
          title: 'Summary',
        },
      },
    },
  };
}
