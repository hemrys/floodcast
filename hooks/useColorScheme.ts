import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';
import { useState, useEffect } from 'react';

type ColorSchemeType = 'light' | 'dark' | null;

let currentThemePreference: ColorSchemeType = null;

// Create a list of subscribers to notify when the theme changes
const subscribers = new Set<(theme: string) => void>();

// Custom hook that extends the default useColorScheme
export function useColorScheme() {
  const deviceColorScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<string>(currentThemePreference || deviceColorScheme || 'light');

  useEffect(() => {
    const updateTheme = (newTheme: string) => setTheme(newTheme);
    subscribers.add(updateTheme);

    // Clean up when component unmounts
    return () => {
      subscribers.delete(updateTheme);
    };
  }, []);

  return theme;
}

export function setColorScheme(scheme: ColorSchemeType) {
  Appearance.setColorScheme(scheme);

  currentThemePreference = scheme;
  const finalTheme = scheme || useDeviceColorScheme() || 'light';

  subscribers.forEach(subscriber => subscriber(finalTheme));

  return finalTheme;
}
