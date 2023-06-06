import {
  Box,
  BoxProps,
  Center,
  CloseButton,
  Divider,
  Flex,
  Spacer,
} from '@chakra-ui/react'

import { NavItem } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { SettingsIcon } from 'components/icons'

import { ILinkItemProps } from '../../organisms/sidebar'

interface ISidebarProps extends BoxProps {
  items: ILinkItemProps[]
  onClose: () => void
}

export const SidebarContent: React.FC<ISidebarProps> = ({
  items,
  onClose,
  ...rest
}: ISidebarProps) => {
  return (
    <Box
      bgGradient="linear(176.48deg, #27187E 0%, #1C1542 100%)"
      w={{ base: 'full', md: 60 }}
      minW="265px"
      pos="fixed"
      h={{ sm: '100vh', md: 'calc(100vh - 5rem)' }}
      pb="2rem"
      {...rest}
    >
      <Flex direction="column" h="full" pt={4}>
        <Flex h={14} align="center" display={{ base: 'flex', md: 'none' }}>
          <CloseButton color="white" onClick={onClose} w="4rem" />
        </Flex>
        {items.map(item => (
          <Box>
            <NavItem key={item.name} icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
            <Center>
              <Divider bg="purple.250" w="6rem" h="1px" border="none" mb={2} />
            </Center>
          </Box>
        ))}
        <Spacer />
        <NavItem
          key={'System Admin'}
          icon={<SettingsIcon />}
          path={PathRoute.SETTINGS}
        >
          System Admin
        </NavItem>
      </Flex>
    </Box>
  )
}
