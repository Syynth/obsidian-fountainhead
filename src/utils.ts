import { parseYaml, stringifyYaml } from 'obsidian';

export async function sleep(ms: number = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function findFrontmatter(text: string) {
  const lines = text.trim().split('\n');
  let started = false;
  const frontmatter = [];
  for (const line of lines) {
    const delimiter = line.trim() === '---';

    if (!started && delimiter) {
      started = true;
      continue;
    }
    if (started && !delimiter) {
      frontmatter.push(line);
      continue;
    }
    if (started && delimiter) {
      return frontmatter.join('\n');
    }
  }
  return '';
}

export function splitFrontmatter(text: string) {
  const lines = text.trim().split('\n');
  let stage: 'before' | 'during' | 'after' = 'before';
  const before = [];
  const frontmatter = [];
  const after = [];
  for (const line of lines) {
    const delimiter = line.trim() === '---';

    switch (stage) {
      case 'before':
        if (!delimiter) {
          before.push(line);
        } else {
          stage = 'during';
        }
        break;
      case 'during':
        if (!delimiter) {
          frontmatter.push(line);
        } else {
          stage = 'after';
        }
        break;
      case 'after':
        after.push(line);
        break;
    }
  }
  return {
    before: before.join('\n'),
    frontmatter: frontmatter.join('\n'),
    after: after.join('\n'),
  };
}

export function replaceFrontmatter(text: string, get: (current: any) => any) {
  const { before, frontmatter, after } = splitFrontmatter(text);
  return [
    before,
    '---',
    stringifyYaml(get(parseYaml(frontmatter))).trim(),
    '---',
    after,
  ]
    .join('\n')
    .trim();
}
