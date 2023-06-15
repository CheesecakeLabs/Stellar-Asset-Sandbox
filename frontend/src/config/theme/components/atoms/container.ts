export const Container = {
  variants: {
    primary: {
      backgroundColor: 'white',
      border: '1px solid',
      borderColor: 'gray.600',
      borderRadius: '0.5rem',
      p: '1.5rem',
      flexDir: 'column',
      m: '0',
      _dark: {
        bg: 'black.700',
        border: '0',
      },
    },
    secondary: {
      backgroundColor: 'gray.100',
      borderRadius: '0.5rem',
      px: '1rem',
      py: '0.5rem',
      flexDir: 'column',
      m: '0',
      gap: '1rem',
      _dark: {
        bg: 'black.700',
        border: '0',
      },
    },
  },
}
