import { JSONSchema7 } from 'json-schema';

export const Base: JSONSchema7 = {
  type: 'object',
  properties: {
    name: {
      title: 'Record Name',
      type: 'string',
    },
  },
};

export const BaseUISchema = {
  bio: {
    items: {
      'ui:widget': 'textarea',
    },
  },
};
