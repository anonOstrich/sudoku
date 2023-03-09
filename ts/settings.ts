import { SudokuInterface } from './game_interface';

export interface Settings {
  displayErrors: boolean;
  useDarkTheme: boolean;
  displayTimer: boolean;
}

function typedKeys<T extends object>(obj: T): Array<keyof typeof obj>{
  return Object.keys(obj) as Array<keyof typeof obj>
}

const rootEl = document.querySelector(":root")
if (!rootEl) throw new Error("NO!")

export function setDarkTheme(useDarkTheme: boolean) {
  if (useDarkTheme && !rootEl?.classList.contains('dark-theme')) {
    rootEl?.classList.add('dark-theme')
  } else {
    rootEl?.classList.remove('dark-theme')
  }
}

export type SettingsHandler = ReturnType<typeof createSettingsHandler>;

export function createSettingsHandler(gameUI: SudokuInterface) {
  let settings = loadSettings();

  return {
    handleDisplayErrors(e: Event) {
      const settingEnabled = (e.target as HTMLInputElement).checked;
      if (settingEnabled != settings.displayErrors) {
        settings = { ...settings, displayErrors: settingEnabled };
        saveSettings(settings);
        gameUI.setSettings(settings);
      }
    },
    handleUseDarkTheme(e: Event) {
      const settingEnabled = (e.target as HTMLInputElement).checked;
      if (settingEnabled != settings.useDarkTheme) {
        settings = {...settings, useDarkTheme: settingEnabled}
        saveSettings(settings)
        setDarkTheme(settings.useDarkTheme)
      }
    },
    handleDisplayTimer(e: Event) {
      const settingEnabled = (e.target as HTMLInputElement).checked;
      if (settingEnabled != settings.displayTimer) {
        settings = {...settings, displayTimer: settingEnabled}
        saveSettings(settings)
        gameUI.setSettings(settings)
      }
    }
  };
}

export function getDefaultSettings(): Settings {
  return {
    displayErrors: true,
    useDarkTheme: true,
    displayTimer: true
  };
}

export function loadSettings() {
  const saved = localStorage.getItem('settings');
  if (saved == null) {
    console.log("loading default settings...")
    return getDefaultSettings();
  }

  const parsedSaved = JSON.parse(saved) as Settings
  // If settings have been added after the user has used the page
  for (const key of typedKeys(getDefaultSettings())) {
    // By types, this should not be possible... But the parsed might be lacking newer additions. Perhaps there should be a separate parsing method to hide this complexity?
    if (!(key in parsedSaved)) {
      parsedSaved[key] = getDefaultSettings()[key]
    }
  }
  return parsedSaved;
}

function saveSettings(settings: Settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

export default loadSettings;
