import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultSize,
} from '@chakra-ui/react';

const config = {
  config: {
    initialColorMode: 'dark',
  },
};

export const theme = extendTheme(
  config,
  withDefaultSize({
    size: 'sm',
    components: ['Input', 'Button', 'Heading'],
  }),
  withDefaultColorScheme({
    colorScheme: 'purple',
    components: ['Button', 'Tabs', 'Input', 'Checkbox'],
  }),
);

delete theme.styles.global;
