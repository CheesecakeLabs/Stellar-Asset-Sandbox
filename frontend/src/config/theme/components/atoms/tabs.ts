export const Tabs = {
  defaultProps: {
    size: 'md',
    variant: 'horizontal',
  },
  sizes: {
    md: {
      tab: {
        fontSize: 'sm',
        py: '1',
        mr: '0.5rem',
      },
    },
    sm: {
      tab: {
        fontSize: 'sm',
        py: '1',
        mr: '0.5rem',
      },
    },
  },
  variants: {
    simpleRounded: {
      tab: {
        fontWeight: '400',
        borderRadius: 'full',
        _selected: {
          color: 'white',
          bg: 'primary.normal',
          borderRadius: 'full',
        },
      },
      tablist: {
        color: 'gray.300',
      },
      tabpanel: {
        p: '0',
      },
    },
  },
}
