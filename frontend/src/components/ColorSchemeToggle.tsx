import { ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface ColorSchemeToggleProps {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

export function ColorSchemeToggle({ colorScheme, toggleColorScheme }: ColorSchemeToggleProps) {
  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="light"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'dark' ? (
        <IconSun size="1.2rem" />
      ) : (
        <IconMoon size="1.2rem" />
      )}
    </ActionIcon>
  );
}