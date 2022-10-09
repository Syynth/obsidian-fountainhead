import { createContext, ReactElement, useContext } from 'react';
import { FountainheadPlugin } from '~/FountainheadPlugin';
import { App } from 'obsidian';

interface AppContext {
  app: App;
  plugin: FountainheadPlugin;
}

interface FountainheadProviderProps {
  children: ReactElement;
  plugin: FountainheadPlugin;
  app: App;
}

const FountainheadContext = createContext<AppContext>(null as any);

export function FountainheadProvider({
  children,
  app,
  plugin,
}: FountainheadProviderProps) {
  return (
    <FountainheadContext.Provider value={{ app, plugin }}>
      {children}
    </FountainheadContext.Provider>
  );
}

export function usePlugin() {
  return useContext(FountainheadContext).plugin;
}

export function useVault() {
  return usePlugin().app.vault;
}
