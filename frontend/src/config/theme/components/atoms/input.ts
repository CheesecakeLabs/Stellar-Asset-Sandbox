import { inputAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle } = createMultiStyleConfigHelpers(parts.keys)

const variantCustom = definePartsStyle(() => {
  return {
    field: {
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: '0.5rem',
      height: '3.5rem',
      color: 'black.300',
      fontSize: 'md',
      _focusVisible: {
        borderColor: 'blue.500',
      },
    },
  }
})

export const Input = {
  defaultProps: {
    size: 'md',
    variant: 'custom',
  },
  variants: {
    custom: variantCustom,
  },
}
