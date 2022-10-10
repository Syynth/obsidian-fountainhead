import { JSONSchema7 } from 'json-schema';

export const CharacterSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    filename: {
      title: 'Record Name',
      type: 'string',
    },
    details: {
      title: 'Character Details',
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          title: 'Nickname',
        },
        fullName: {
          type: 'string',
          title: 'Full Name',
        },
        age: {
          type: 'number',
          title: 'Age',
        },
        birthday: {
          type: 'string',
          title: 'Birthday',
        },
        bio: {
          type: 'array',
          title: 'Bio',
          items: {
            type: 'string',
          },
        },
        history: {
          type: 'array',
          title: 'History',
          items: {
            type: 'string',
          },
        },
      },
    },
    suspectNotes: {
      title: 'Suspect Notes',
      type: 'object',
      properties: {
        motivation: {
          type: 'array',
          title: 'Motivation',
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
        },
        loss: {
          type: 'array',
          title: 'Loss',
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
        },
        alibi: {
          type: 'array',
          title: 'Alibi',
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
        },
        conflicts: {
          type: 'array',
          title: 'Conflicts',
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
        },
      },
    },
  },
};

export const CharacterUISchema = {
  bio: {
    items: {
      'ui:widget': 'textarea',
    },
  },
};

/*
Description
- Nickname
- Full name
- Age
- Birthday
- Bio (updated field)
- History (updated field)

Suspect Notes (updated fields)
- Motivation
- Loss
- Alibi (statements provided by character)
- Conflicts (conflicts with alibi)
- Timeline (Relationship to case over time)

Family Tree
- Parents/Guardian
- Grandparents
- Siblings
- Spouse/Partner
- Children
- Grandchildren
- Best Friend
- Friend
- Colleague
- Rival
*/
