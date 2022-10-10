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

export function getOS() {
  let userAgent = window.navigator.userAgent;
  let platform =
    // @ts-ignore
    window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Apple';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'Apple';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

export function normalize(path: string) {
  return path.replace('//', '/').replace(/^\//gi, '');
}
