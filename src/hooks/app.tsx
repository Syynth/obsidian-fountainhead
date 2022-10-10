import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FountainheadPlugin } from '~/FountainheadPlugin';
import { App } from 'obsidian';
import { FountainheadSettings } from '~/types';

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

export function useSettings() {
  const plugin = usePlugin();
  const [settings, setSettings] = useState(plugin.settings);

  useEffect(() => {
    plugin.addSettingsListener(setSettings);
    return () => plugin.removeSettingsListener(setSettings);
  }, [plugin]);

  return {
    settings,
    saveSettings: async (settings: FountainheadSettings) => {
      plugin.settings = settings;
      await plugin.saveSettings();
    },
  };
}
