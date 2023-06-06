import { Avatar, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

import { MobileNav } from 'components/atoms'
import { MenuIcon } from 'components/icons'

import AvatarImg from 'app/core/resources/avatar.png'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  return (
    <Flex
      bgGradient="linear(90.4deg, purple.300 0%, primary.dark 100%)"
      h="5rem"
      w="full"
      align="center"
      ps={{ base: 2, md: 12 }}
      pe={6}
      pos="fixed"
      zIndex={99}
    >
      <MobileNav onOpen={onOpen} />
      <Spacer />
      <Avatar src={AvatarImg} size="2rem" />
      <Text ps={3} pe={3} color="purple.100" fontSize="sm">
        John Anderson
      </Text>
      <MenuIcon />
    </Flex>
  )
}
