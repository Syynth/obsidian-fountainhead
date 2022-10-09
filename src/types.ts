export interface FountainheadSettings {
  projectDirectory: string;
  collections: string[];
}

export type Opaque<T extends string> = T & { __opaque: T };

export type FileId = Opaque<string>;

export function cast<T>(arg: any): T {
  return arg;
}
