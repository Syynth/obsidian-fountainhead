import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultSize,
} from '@chakra-ui/react';

import { getOS } from '~/fs/utils';

const config = {
  config: {
    initialColorMode: 'dark',
  },
  styles: {
    global: {
      svg: {
        display: 'initial',
      },
    },
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

if (getOS() === 'Apple') {
  delete theme.styles.global;
  theme.styles.global = {
    svg: {
      display: 'initial',
    },
  };
}
