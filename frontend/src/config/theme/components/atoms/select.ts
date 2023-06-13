import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { selectAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

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
    color: 'gray.900',
  },
})

export const Select = defineMultiStyleConfig({ baseStyle, sizes })
