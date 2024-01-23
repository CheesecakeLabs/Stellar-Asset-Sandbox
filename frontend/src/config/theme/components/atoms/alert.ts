export const Alert = {
  baseStyle: {
    container: {
      fontSize: 'sm',
      padding: '1rem',
      color: 'black',
    },
    icon: {
      _dark: {
        color: 'black.700',
      },
    },
  },
  variants: {
    purple: {
      container: {
        bg: 'purple.200',
      },
      icon: {
        color: 'purple.500',
      },
    },
    error: {
      container: {
        bg: 'red.500',
        color: 'white',
      },
      icon: {
        color: 'white',
      },
    },
  },
}
