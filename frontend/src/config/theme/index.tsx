import { extendTheme } from '@chakra-ui/react';



import * as components from './components';


const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    cssVarPrefix: '',
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
      normal: '#0027A5',
      dark: '#07002D',
    },
    secondary: {
      light: '#FF935F',
      normal: '#D26333',
      dark: '#9B3505',
    },
    background: {
      light: '#FFFFFF',
      normal: '#F8F8F8',
      dark: '#F0F0F0',
    },
    darkish: {
      light: '#3D3D3D',
      normal: '#00171F',
      dark: '#151515',
    },
    grayish: {
      light: '#F8FAFC',
      normal: '#A0A0A0',
      dark: '#7D7D7D',
    },
    whitish: {
      light: '#FFFFFF',
      normal: '#F8F8F8',
      dark: '#F0F0F0',
    },
    success: {
      light: '#8DEB7E',
      normal: '#75C568',
      dark: '#5C9A52',
    },
    info: {
      light: '#E5F8FF',
      normal: '#005F80',
      dark: '#428BAA',
    },
    warning: {
      light: '#FFF4DC',
      normal: '#A77701',
      dark: '#C8AC1D',
    },
    error: {
      light: '#FDF2F6',
      normal: '#781235',
      dark: '#E34078',
    },
    gray: {
      50: '#FBFCFD',
      100: '#f8f8fb',
      200: '#f1f2f6',
      300: '#AFB4B6',
      400: '#E5E5E5',
      700: '#828282',
    },
    blue: {
      50: '#E5F8FF',
      100: '#B3EBFF',
      200: '#80DEFF',
      300: '#4CD1FF',
      500: '#00ABE6',
      600: '#005F80',
      700: '#00394D',
      800: '#002A38',
      900: '#002A38',
    },
    black: {
      300: '#00171F',
      400: '#161616',
    },
    rose: {
      500: '#E34078',
    },
    green: {
      200: '#78f6a2',
      500: '#17B890',
    },
    purple: {
      100: '#758BFD',
      150: '#4628cd',
      200: '#30237d',
      250: '#3E1BDB',
      300: '#181142',
    },
    yellow: {
      500: '#FBE995',
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