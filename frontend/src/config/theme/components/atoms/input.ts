import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { inputAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const sizes = {
  md: definePartsStyle({
    field: {
      height: '38px',
      p: '6px 10px',
      fontSize: 'sm',
    },
  }),
}

const baseStyle = definePartsStyle({
  sizes: {
    height: '60px',
  },
  field: {
    borderRadius: '0.25rem',
    color: 'black',
    _placeholder: { color: 'gray.900' },
    _dark: { color: 'white' },
  },
})

export const Input = defineMultiStyleConfig({ baseStyle, sizes })
