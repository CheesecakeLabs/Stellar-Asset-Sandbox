import { cssVar } from '@chakra-ui/theme-tools'

const $startColor = cssVar('skeleton-start-color')
const $endColor = cssVar('skeleton-end-color')

export const Skeleton = {
  baseStyle: {
    _light: {
      [$startColor.variable]: 'colors.gray.200',
      [$endColor.variable]: 'colors.gray.600',
    },
  },
}
