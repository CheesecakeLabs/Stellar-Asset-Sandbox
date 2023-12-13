import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react'

import { NavItem } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ProfileIcon, SettingsIcon } from 'components/icons'

import { ReactComponent as CheesecakeLogo } from 'app/core/resources/cheesecake-logo.svg'
import { ReactComponent as Cheesecake } from 'app/core/resources/cheesecake.svg'
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
      h={{ base: '100vh', md: 'calc(100vh - 5rem)' }}
      borderRight="1px solid"
      borderColor={'gray.600'}
      pb="2rem"
      bg={{ sm: 'white', md: 'none' }}
      _dark={{ bg: { base: 'black.600' }, borderColor: 'black.800' }}
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
        {items.map((item, index) => (
          <Box key={index}>
            <NavItem
              icon={item.icon}
              path={item.path}
              highlightMenu={highlightMenu}
              comingSoon={item.comingSoon}
            >
              {item.name}
              {item.comingSoon && (
                <Tag
                  fontSize="10px"
                  py={0}
                  px="0.5rem"
                  w="fit-content"
                  variant="blue_sky"
                  bg="gray.400"
                  color="black.900"
                  mb="0.25rem"
                >
                  Coming soon
                </Tag>
              )}
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
          key={'Administration'}
          icon={<SettingsIcon />}
          path={PathRoute.SETTINGS}
          highlightMenu={highlightMenu}
        >
          Administration
        </NavItem>
        <Flex mt="1rem" alignItems="center">
          <Flex
            fill="black"
            _dark={{ fill: 'white' }}
            ms="2rem"
            gap={3}
            alignItems="center"
          >
            <CheesecakeLogo height="24px" width="24px" />
            <Cheesecake height="24px" width="128px" />
          </Flex>
          <Text
            color="gray.900"
            fontWeight="600"
            fontSize="sm"
            mr="1rem"
            ms="1rem"
          >
            v2.01
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
