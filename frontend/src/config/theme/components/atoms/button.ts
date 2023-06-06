export const Button = {
  defaultProps: {
    colorScheme: 'blue',
  },
  variants: {
    primary: {
      backgroundColor: 'primary.normal',
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
  },
}
