import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { inputAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const sizes = {
  md: definePartsStyle({
    field: {
      height: '34px',
      p: '6px 10px',
      fontSize: 'sm',
    },
  }),
}

const baseStyle = definePartsStyle({
  sizes: {
    height: '50px',
  },
  field: {
    border: '1px solid #EEEDEF',
    borderRadius: '0.25rem',
    color: 'black',
    _placeholder: { color: 'gray.800' },
  },
})

export const Input = defineMultiStyleConfig({ baseStyle, sizes })
