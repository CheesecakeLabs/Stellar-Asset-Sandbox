import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { radioAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys)

const baseStyle = definePartsStyle({
  control: {
    _checked: {
      bg: 'primary.normal',
      borderColor: 'primary.normal',
    },
  },
})

export const Radio = defineMultiStyleConfig({ baseStyle })
