import { DataWriteOptions, Vault } from 'obsidian';

export async function createFolder(vault: Vault, path: string) {
  if (!(await vault.adapter.exists(path))) {
    await vault.createFolder(path);
  }
}

export async function createFile(
  vault: Vault,
  path: string,
  data: string,
  options?: DataWriteOptions,
) {
  if (!(await vault.adapter.exists(path))) {
    await vault.create(path, data, options);
  }
}

export function prettyName(path: string) {
  return path.split('/').slice(-1)[0]?.replace(/\.md$/i, '') ?? path;
}
