import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { checkboxAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle } = createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const highlight = definePartsStyle({
  label: {
    fontSize: 'sm',
  },
  container: {
    bg: 'gray.25',
    borderRadius: '0.5rem',
    px: '0.75rem',
    py: '0.4rem',
    _dark: {
      bg: 'black.600',
    },
  },
  control: {
    bg: 'white',
    _dark: {
      bg: 'black.600',
    },
  },
})

export const Checkbox = {
  baseStyle: {
    control: {
      _checked: {
        bg: 'primary.normal',
        borderColor: 'primary.normal',
      },
    },
  },
  variants: { highlight },
}
