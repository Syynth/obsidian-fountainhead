import { JSONSchema7 } from 'json-schema';
import { versionProperty, logProperty } from '~/schemas/utils';

export const CharacterSchema: JSONSchema7 = {
  // title: 'Character Entry',
  type: 'object',
  properties: {
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
        bio: versionProperty('Bio'),
        history: versionProperty('History'),
      },
    },
    suspectNotes: {
      title: 'Suspect Notes',
      type: 'object',
      properties: {
        motivation: logProperty('Motivation'),
        loss: logProperty('Loss'),
        alibi: logProperty('Alibi'),
        conflicts: logProperty('Conflicts'),
      },
    },

    // timeline: logProperty('Timeline'),
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
