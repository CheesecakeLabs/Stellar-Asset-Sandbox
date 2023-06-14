import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Spacer,
  Text,
  useColorMode,
} from '@chakra-ui/react'

import { isDark } from 'utils'

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

  return (
    <Box
      w={{ base: 'full', md: 60 }}
      minW="282px"
      pos="fixed"
      h={{ sm: '100vh', md: 'calc(100vh - 5rem)' }}
      borderRight="1px solid"
      borderColor={isDark(colorMode) ? 'black.800' : 'gray.600'}
      pb="2rem"
      bg={{ sm: isDark(colorMode) ? 'black.600' : 'white', md: 'none' }}
      {...rest}
      overflowY="auto"
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
          <StellarLogo
            fill={isDark(colorMode) ? 'white' : 'black'}
            width="6rem"
          />
          <CloseButton
            color={isDark(colorMode) ? 'white' : 'black'}
            onClick={onClose}
            w="4rem"
          />
        </Flex>
        {items.map(item => (
          <Box key={item.name}>
            <NavItem icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
          </Box>
        ))}
        <Spacer />
        <NavItem
          key={'Profile'}
          icon={<ProfileIcon />}
          path={PathRoute.PROFILE}
        >
          Profile
        </NavItem>
        <NavItem
          key={'Settings'}
          icon={<SettingsIcon />}
          path={PathRoute.SETTINGS}
        >
          Settings
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
