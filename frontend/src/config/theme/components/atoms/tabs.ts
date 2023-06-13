export const Tabs = {
  defaultProps: {
    size: 'md',
    variant: 'horizontal',
  },
  sizes: {
    md: {
      tab: {
        fontSize: 'md',
        py: '3',
        mr: '2rem',
      },
    },
    sm: {
      tab: {
        fontSize: 'sm',
        py: '2',
      },
    },
  },
  variants: {
    horizontal: {
      tab: {
        fontWeight: '400',
        _selected: {
          borderBottom: '2px solid',
          color: 'black.300',
        },
      },
      tablist: {
        color: 'gray.300',
        borderBottom: '1.5px solid',
        borderColor: 'gray.100',
      },
      tabpanel: {
        p: '0',
      },
    },
    vertical: {
      tab: {
        fontWeight: '400',
        fontSize: 'sm',
        width: { md: '16rem', sm: '4rem' },
        justifyContent: 'flex-start',
        py: '0.5rem',
        px: '0',
        mb: '1rem',
        _selected: {
          borderBottom: '2px solid',
          color: 'blue.500',
        },
      },
      root: {
        display: 'flex',
      },
      tablist: {
        flexDirection: { md: 'column', sm: 'row' },
        color: 'gray.300',
      },
    },
  },
}
