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
      w={{ base: 'full', md: 60 }}
      minW="282px"
      pos="fixed"
      h={{ sm: '100vh', md: 'calc(100vh - 5rem)' }}
      borderRight="1px solid"
      borderColor="gray.600"
      pb="2rem"
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
          <StellarLogo fill="black" width="6rem" />
          <CloseButton color="black" onClick={onClose} w="4rem" />
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
          color="gray.800"
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
