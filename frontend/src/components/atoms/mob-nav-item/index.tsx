import { FlexProps, IconButton, useColorMode } from '@chakra-ui/react'

import { MenuLineIcon } from 'components/icons'

interface IMobileProps extends FlexProps {
  onOpen: () => void
}
export const MobileNav: React.FC<IMobileProps> = ({ onOpen }: IMobileProps) => {
  const { colorMode } = useColorMode()

  const isDark = colorMode === 'dark'

  return (
    <IconButton
      variant="ghost"
      _hover={{ bg: 'none' }}
      onClick={onOpen}
      aria-label="open menu"
      me={4}
      display={{ base: 'flex', md: 'none' }}
      icon={<MenuLineIcon width="1rem" fill={isDark ? 'white' : 'black'} />}
    />
  )
}
