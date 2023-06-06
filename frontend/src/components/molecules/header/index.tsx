import { Avatar, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

import { MobileNav } from 'components/atoms'
import { MenuIcon } from 'components/icons'

import AvatarImg from 'app/core/resources/avatar.png'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  return (
    <Flex
      bgGradient="gray.500"
      h="4.5rem"
      w="full"
      align="center"
      ps={{ base: 2, md: 12 }}
      pe={6}
      pos="fixed"
      zIndex={99}
      borderBottom="1px solid gray.600"
    >
      <MobileNav onOpen={onOpen} />
      <StellarLogo fill="black" />
      <Spacer />
      <Avatar src={AvatarImg} size="2rem" />
      <Text ps={3} pe={3} color="purple.100" fontSize="sm">
        John Anderson
      </Text>
      <MenuIcon />
    </Flex>
  )
}
