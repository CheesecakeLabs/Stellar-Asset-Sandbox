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
    secondary: {
      background: 'none',
      color: 'primary.normal',
      border: '1px solid',
      borderColor: 'primary.normal',
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
    menuButton: {
      w: 'full',
      borderBottom: '1px solid',
      borderColor: 'gray.600',
      height: '3rem',
      fontWeight: '500',
      fontSize: 'sm',
      justifyContent: 'start',
      gap: '0.5rem',
      borderRadius: 'none',
      fill: 'gray.650',
      stroke: 'gray.650',
      color: 'gray.650',
      _dark: {
        fill: 'white',
        stroke: 'white',
        borderColor: 'black.800',
        color: 'white',
      },
    },
    menuButtonSelected: {
      w: 'full',
      bg: 'primary.normal',
      height: '3rem',
      fontWeight: '500',
      fontSize: 'sm',
      justifyContent: 'start',
      gap: '0.5rem',
      borderRadius: 'none',
      fill: 'white',
      stroke: 'white',
      color: 'white',
    },
  },
}
