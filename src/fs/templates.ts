import { stringifyYaml } from 'obsidian';

export function record<T>(resource: string, data: T) {
  return `---
${stringifyYaml({
  fountainhead: {
    resource,
    data,
  },
})}---`;
}

export function schema(resource: string) {
  return `---
tags: [library-index, ${resource}-index]
fountainhead:
  resource: Index
  type: ${resource}-Index
---
## Record schema
\`\`\`json5 data-schema
{
  type: 'object',
  title: "${resource}",
  properties: {
    filename: {
      title: 'Record Name',
      type: 'string',
    },
  },
}
\`\`\`

## UI Schema
\`\`\`json5 ui-schema
{}
\`\`\`
`;
}
