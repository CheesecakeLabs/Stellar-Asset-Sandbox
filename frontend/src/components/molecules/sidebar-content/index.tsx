import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Spacer,
  Text,
  useColorMode,
} from '@chakra-ui/react'

import { NavItem } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ProfileIcon, SettingsIcon } from 'components/icons'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

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
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Box
      w={{ base: 'full', md: 60 }}
      minW="282px"
      pos="fixed"
      h={{ sm: '100vh', md: 'calc(100vh - 5rem)' }}
      borderRight="1px solid"
      borderColor={isDark ? 'black.800' : 'gray.600'}
      pb="2rem"
      bg={{ sm: isDark ? 'black.600' : 'white', md: 'none' }}
      {...rest}
    >
      <Flex direction="column" h="full" pt={4}>
        <Flex
          h={14}
          justifyContent="space-between"
          alignItems="center"
          display={{ base: 'flex', md: 'none' }}
          w="full"
          pl="2rem"
          mb="1rem"
        >
          <StellarLogo fill={isDark ? 'white' : 'black'} width="6rem" />
          <CloseButton
            color={isDark ? 'white' : 'black'}
            onClick={onClose}
            w="4rem"
          />
        </Flex>
        {items.map(item => (
          <Box>
            <NavItem key={item.name} icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
          </Box>
        ))}
        <Spacer />
        <NavItem
          key={'System Admin'}
          icon={<ProfileIcon />}
          path={PathRoute.PROFILE}
        >
          Profile
        </NavItem>
        <NavItem
          key={'System Admin'}
          icon={<SettingsIcon />}
          path={PathRoute.SETTINGS}
        >
          System Admin
        </NavItem>
        <Text
          color="gray.900"
          fontWeight="600"
          ml="2rem"
          fontSize="sm"
          mt="0.5rem"
        >
          v2.01
        </Text>
      </Flex>
    </Box>
  )
}
