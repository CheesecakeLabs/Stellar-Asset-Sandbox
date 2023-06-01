export const Tag = {
  baseStyle: {
    label: {
      fontSize: 'sm',
      fontWeight: '400',
      p: '8px',
    },
    container: {
      borderRadius: 'full',
    },
  },
  variants: {
    user: {
      container: {
        bg: 'info.light',
        color: 'black.300',
      },
    },
    yellow: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'warning.light',
        color: 'warning.normal',
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
    number: {
      label: {
        fontSize: 'sm',
        fontWeight: '400',
      },
    },
    tab: {
      label: {
        fontSize: 'sm',
        fontWeight: '400',
      },
      container: {
        color: 'white',
        fontSize: 'sm',
        ml: '0.5rem',
      },
    },
    option: {
      container: {
        bg: 'info.light',
        padding: '4px 12px',
      },
    },
    duration: {
      container: {
        bg: 'warning.light',
        padding: '8px 12px',
        gap: 2,
        fontSize: 'xs',
      },
    },
    green: {
      label: {
        padding: '6px 12px',
      },
      container: {
        bg: 'green.200',
        color: 'green.500',
      },
    },
  },
}
