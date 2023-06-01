export const Text = {
  defaultProps: {
    colorScheme: 'blue',
    height: '6.5rem',
  },
  variants: {
    primary: {
      backgroundColor: 'blue.500',
      color: 'white',
      height: '3.5rem',
      fontWeight: '400',
      fontSize: 'md',
      fontHeight: '2xl',
      borderRadius: '0.5rem',
      _hover: {
        _disabled: {
          backgroundColor: 'blue.200',
        },
      },
    },
    decline: {
      backgroundColor: 'error.light',
      color: 'error.dark',
      height: '3.5rem',
      fontWeight: '400',
      fontSize: 'md',
      fontHeight: '2xl',
      borderRadius: '0.5rem',
    },
    roundedIcon: {
      backgroundColor: 'none',
      cursor: 'pointer',
      border: '1px solid #00171F',
      borderRadius: 'full',
      fontSize: 'xs',
      lineHeight: 'lg',
      fontWeight: '400',
      _hover: {
        backgroundColor: 'none',
      },
    },
  },
}
