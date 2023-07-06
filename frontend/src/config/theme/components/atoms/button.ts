export const Button = {
  variants: {
    primary: {
      background: 'primary.normal',
      color: 'white',
      height: '2.125rem',
      fontWeight: '500',
      fontSize: 'sm',
      borderRadius: '0.25rem',
      _loading: {
        _hover: {
          bg: 'primary.normal',
        },
      },
    },
    icon: {
      bg: 'none',
      color: 'black',
      h: '18px',
      _dark: {
        color: 'white',
      },
    },
  },
}
