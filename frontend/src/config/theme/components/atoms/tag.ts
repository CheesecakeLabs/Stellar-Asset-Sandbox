export const Tag = {
  baseStyle: {
    container: {
      borderRadius: 'full',
      fontSize: 'xs',
      padding: '6px 24px',
      fontWeight: '700',
    },
  },
  variants: {
    yellow: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'yellow.500',
        color: 'black.400',
      },
    },
    blue_sky: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'blue.100',
        color: 'white',
      },
    },
    blue_moonstone: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'blue.300',
        color: 'white',
      },
    },
    purple_powder: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'purple.300',
        color: 'white',
      },
    },
    red: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'red.500',
        color: 'white',
      },
    },
    light: {
      label: {
        padding: '6px',
      },
      container: {
        border: '1.5px solid',
        borderColor: 'blue.50',
      },
    },
    green: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'green.500',
        color: 'white',
      },
    },
    actived: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'primary.normal',
        color: 'white',
      },
    },
    label: {
      label: {
        padding: '6px 12px',
      },
      container: {
        w: 'fit-content',
        bg: 'gray.100',
        _dark: { bg: 'black.800', color: 'white' },
        color: 'gray.900',
      },
    },
    value: {
      label: {
        padding: '8px 16px',
      },
      container: {
        w: 'fit-content',
        bg: 'gray.100',
        color: 'text.secondary',
        fontSize: { base: 'md', md: '2xl' },
        borderRadius: '0.5rem',
        _dark: { bg: 'black.800', color: 'white' },
      },
    },
  },
}
