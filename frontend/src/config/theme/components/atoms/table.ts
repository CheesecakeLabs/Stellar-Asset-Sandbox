export const Table = {
  variants: {
    simple: {
      th: {
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800' },
        color: 'gray.700',
      },
      td: {
        color: 'black.900',
        fontSize: { md: 'md', sm: 'sm' },
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800', color: 'white' },
      },
      tr: {
        fill: 'black',
        stroke: 'black',
        _dark: {
          fill: 'white',
          stroke: 'white',
          _hover: {
            bg: 'black.800',
          },
        },
        _hover: {
          bg: 'gray.100',
          _dark: {
            _hover: {
              bg: 'black.800',
            },
          },
        },
      },
    },
    list: {
      th: {
        borderBottom: '1px solid',
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800' },
        color: 'gray.700',
      },
      td: {
        color: 'black.900',
        fontSize: { md: 'md', sm: 'sm' },
        borderBottom: '1px solid',
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800', color: 'white' },
      },
      tr: {
        fill: 'black',
        stroke: 'black',
        _dark: {
          fill: 'white',
          stroke: 'white',
        },
      },
    },
    small: {
      th: {
        borderBottom: '1px solid',
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800' },
        color: 'gray.700',
        px: '0',
      },
      td: {
        color: 'black.900',
        fontSize: 'sm',
        borderBottom: '1px solid',
        borderColor: 'gray.400',
        _dark: { borderColor: 'black.800', color: 'white' },
        px: '0',
        py: '0.75rem'
      },
      tr: {
        fill: 'black',
        stroke: 'black',
        _dark: {
          fill: 'white',
          stroke: 'white',
        },
      },
    },
  },
}
