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
  },
}
