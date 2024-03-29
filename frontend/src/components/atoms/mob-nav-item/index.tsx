import { FlexProps, IconButton } from '@chakra-ui/react'

import { MenuLineIcon } from 'components/icons'

interface IMobileProps extends FlexProps {
  onOpen: () => void
}
export const MobileNav: React.FC<IMobileProps> = ({ onOpen }: IMobileProps) => {
  return (
    <IconButton
      variant="ghost"
      _hover={{ bg: 'none' }}
      onClick={onOpen}
      aria-label="open menu"
      me={4}
      display={{ base: 'flex', lg: 'none' }}
      fill="black"
      _dark={{ fill: 'white' }}
      icon={<MenuLineIcon width="1rem" />}
    />
  )
}
