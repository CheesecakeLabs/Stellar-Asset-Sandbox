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
        bg: 'info.light',
        color: 'info.normal',
      },
    },
    red: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'error.light',
        color: 'error.normal',
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
  },
}
