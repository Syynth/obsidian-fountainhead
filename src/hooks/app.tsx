import { ReactElement } from 'react';
import { FountainheadPlugin } from '~/FountainheadPlugin';

interface FountainheadProviderProps {
  children: ReactElement;
  plugin: FountainheadPlugin;
}

export function FountainheadProvider({ children }: FountainheadProviderProps) {
  return children;
}
