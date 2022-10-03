import { Opaque, FileId, FountainheadSettings, cast } from '~/types';
import { PartialApi } from '~/model/types';

export type CharacterId = Opaque<string>;
export type LocationId = Opaque<string>;
export type FactionId = Opaque<string>;
export type ItemId = Opaque<string>;

export interface BaseEntry<T extends string, TId extends Opaque<string>> {
  type: T;
  file: FileId;
  id: TId;
  name: string;
  description: string | null;
}

export interface Character extends BaseEntry<'character', CharacterId> {
  nickname?: string;
  faction: FactionId | null;
}

export interface Location extends BaseEntry<'location', LocationId> {}
export interface Faction extends BaseEntry<'faction', FactionId> {}
export interface Item extends BaseEntry<'item', ItemId> {}

export type LibraryEntry = Character | Location | Faction | Item;

export interface Library {
  characters: Record<CharacterId, Character>;
  locations: Record<LocationId, Location>;
  factions: Record<FactionId, Faction>;
  items: Record<ItemId, Item>;
}

export function newCharacter(
  settings: FountainheadSettings,
  name: string,
  nickname: string = name,
  description: string | null = null,
  faction: FactionId | null = null,
): Character {
  return {
    type: 'character',
    file: cast(`${settings.projectDirectory}/Library/Characters/${name}.md`),
    id: cast(name),
    description,
    name,
    nickname,
    faction,
  };
}

export function newLocation(
  settings: FountainheadSettings,
  name: string,
  description: string | null = null,
): Location {
  return {
    type: 'location',
    file: cast(`${settings.projectDirectory}/Library/Locations/${name}.md`),
    id: cast(name),
    description,
    name,
  };
}

export function newFaction(
  settings: FountainheadSettings,
  name: string,
  description: string | null = null,
): Faction {
  return {
    type: 'faction',
    file: cast(`${settings.projectDirectory}/Library/Factions/${name}.md`),
    id: cast(name),
    description,
    name,
  };
}

export function newItem(
  settings: FountainheadSettings,
  name: string,
  description: string | null = null,
): Item {
  return {
    type: 'item',
    file: cast(`${settings.projectDirectory}/Library/Items/${name}.md`),
    id: cast(name),
    description,
    name,
  };
}

export interface LibraryApi {
  addCharacter(character: Character): Promise<void>;
}

export const getLibraryApi: PartialApi<LibraryApi> = set => ({
  addCharacter: async (character: Character) =>
    await set(async state => {
      // TODO: Check for existing character
      state.library.characters[character.id] = character;
      // TODO: Ensure file is consistent
    }),
});
