import { immer } from 'zustand/middleware/immer';
import { Library } from '~/model/library';

export type Immer<T> = typeof immer<T & StoreData>;

export type PartialApi<T> = (
  set: Parameters<Parameters<Immer<StoreApi>>[0]>[0],
  get: Parameters<Parameters<Immer<StoreApi>>[0]>[1],
) => T;

export interface LibraryApi {}
export interface ExplorerApi {}

export type StoreApi = LibraryApi & ExplorerApi;

export interface StoreData {
  library: Library;
}
