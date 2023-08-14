export const Tag = {
  baseStyle: {
    label: {
      fontSize: 'xs',
      fontWeight: '400',
    },
    container: {
      borderRadius: 'full',
      fontSize: 'xs',
      padding: '6px 24px',
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
    blue: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'blue.800',
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
  },
}
