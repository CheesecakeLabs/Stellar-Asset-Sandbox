import { extendTheme } from '@chakra-ui/react'

import * as components from './components'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: '',
  },
  styles: {
    global: () => ({
      'html, body': {
        bg: 'gray.500',
        _dark: {
          bg: 'black.600',
        },
      },
    }),
  },
  fonts: {
    body: '"Arial", sans-serif',
    heading: '"Chakra Petch", sans-serif',
    mono: '"Arial", sans-serif',
  },
  fontSizes: {
    xxs: '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    '4xl': '2.25rem', // 36px
    '5xl': '2.75rem', // 44px
    '6xl': '3.5rem', // 56px
    '7xl': '4rem', // 64px
    '8xl': '4.5rem', // 72px
    '9xl': '6rem', // 96px
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.3125,
    base: 1.5,
    tall: 1.666667,
    taller: '2',
    '3': '.75rem', // 12px
    '4': '1rem', // 16px
    '5': '1.25rem', // 20px
    '6': '1.5rem', // 24px
    '7': '1.75rem', // 28px
    '8': '2rem', // 32px
    '9': '2.25rem', // 36px
    '10': '2.5rem', // 40px
    '11': '3rem', // 48px
    '12': '3.375rem', // 54px
  },
  colors: {
    primary: {
      light: '#728CE7',
      normal: '#6E56CF',
    },
    background: {
      light: '#FFFFFF',
      normal: '#F8F8F8',
      dark: '#F0F0F0',
    },
    gray: {
      50: '#FBFCFD',
      100: '#f8f8fb',
      200: '#f1f2f6',
      300: '#AFB4B6',
      350: '#C8C7CB',
      400: '#EEEDEF',
      500: '#f9f8f9',
      600: '#E9E8EA',
      650: '#6F6E77',
      700: '#828282',
      900: '#908E96',
    },
    blue: {
      50: '#E5F8FF',
      200: '#80DEFF',
      500: '#00ABE6',
      800: '#19AECF',
    },
    black: {
      300: '#00171F',
      400: '#161616',
      600: '#292d3e',
      700: '#303448',
      800: '#3a3e4d',
    },
    green: {
      500: '#17B890',
    },
    yellow: {
      500: '#FBE995',
    },
    red: {
      500: '#E85858',
    },
    purple: {
      200: '#F5F2FF',
      500: '#AA99EC',
    },
  },
  borders: {
    '1px': '1px solid',
  },
  shadows: {
    lower: '0px 2px 4px 2px rgba(42, 42, 42, 0.1);',
    mid: '0px 2px 4px 2px rgba(42, 42, 42, 0.2);',
    higher: '0px 2px 4px 2px rgba(42, 42, 42, 0.3);',
  },
  components: { ...components },
})

export default theme
