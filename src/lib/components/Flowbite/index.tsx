import type { FC, HTMLAttributes } from 'react';
import { useEffect, useMemo } from 'react';
import { ThemeContext, useThemeMode } from './ThemeContext';
import { mergeDeep } from '../../helpers/mergeDeep';
import defaultTheme from '../../theme/default';
import windowExists from '../../helpers/window-exists';
import type { FlowbiteTheme } from './FlowbiteTheme';
import type { DeepPartial } from '../../helpers/deep-partial';

export interface ThemeProps {
  dark?: boolean;
  theme?: DeepPartial<FlowbiteTheme>;
  usePreferences?: boolean;
}

interface FlowbiteProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  theme?: ThemeProps;
}

export const Flowbite: FC<FlowbiteProps> = ({ children, theme = {} }) => {
  const { theme: customTheme = {}, dark, usePreferences = true } = theme;
  const [mode, setMode, toggleMode] = useThemeMode(usePreferences);

  const mergedTheme = mergeDeep(defaultTheme, customTheme) as unknown as FlowbiteTheme;

  useEffect(() => {
    if (dark) {
      if (setMode != null) {
        setMode('dark');
      }

      if (windowExists()) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [dark, setMode]);

  const themeContextValue = useMemo(
    () => ({
      theme: mergedTheme,
      mode,
      toggleMode,
    }),
    [mode, toggleMode, mergedTheme],
  );

  return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export type { FlowbiteTheme } from './FlowbiteTheme';
