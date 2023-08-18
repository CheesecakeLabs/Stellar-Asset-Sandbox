import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Spacer,
  Text,
} from '@chakra-ui/react'

import { NavItem } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ProfileIcon, SettingsIcon } from 'components/icons'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { ILinkItemProps } from '../../organisms/sidebar'

interface ISidebarProps extends BoxProps {
  highlightMenu: PathRoute
  items: ILinkItemProps[]
  onClose: () => void
}

export const SidebarContent: React.FC<ISidebarProps> = ({
  highlightMenu,
  items,
  onClose,
  ...rest
}: ISidebarProps) => {
  return (
    <Box
      w={{ base: 'full', md: 60 }}
      minW="282px"
      pos="fixed"
      h={{ sm: '100vh', md: 'calc(100vh - 5rem)' }}
      borderRight="1px solid"
      borderColor={'gray.600'}
      pb="2rem"
      bg={{ sm: 'white', md: 'none' }}
      _dark={{ bg: { sm: 'black.600', md: 'none' }, borderColor: 'black.800' }}
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
          fill="black"
          _dark={{ fill: 'white' }}
        >
          <StellarLogo width="6rem" />
          <CloseButton
            color={'black'}
            _dark={{ color: 'white' }}
            onClick={onClose}
            w="4rem"
          />
        </Flex>
        {items.map(item => (
          <Box key={item.name}>
            <NavItem
              icon={item.icon}
              path={item.path}
              highlightMenu={highlightMenu}
            >
              {item.name}
            </NavItem>
          </Box>
        ))}
        <Spacer />
        <NavItem
          key={'Profile'}
          icon={<ProfileIcon />}
          path={PathRoute.PROFILE}
          highlightMenu={highlightMenu}
        >
          Profile
        </NavItem>
        <NavItem
          key={'Settings'}
          icon={<SettingsIcon />}
          path={PathRoute.SETTINGS}
          highlightMenu={highlightMenu}
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
