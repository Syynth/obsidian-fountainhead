import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, StoreData } from '~/model/types';
import { InitialState } from '~/model/initialState';
import { getLibraryApi } from '~/model/library';

export const useFountainhead = create(
  immer<StoreApi & StoreData>((set, get) => ({
    ...InitialState,
    ...getLibraryApi(set, get),
  })),
);
