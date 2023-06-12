import { Container, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

import { MobileNav } from 'components/atoms'

import Authentication from 'app/auth/services/auth'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { SwitchTheme } from '../switch-theme'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  return (
    <Flex
      bg="gray.500"
      h="4.5rem"
      w="full"
      align="center"
      ps={{ base: 2, md: 12 }}
      pe={6}
      pos="fixed"
      zIndex={99}
      borderBottom="1px solid"
      borderColor="gray.600"
    >
      <MobileNav onOpen={onOpen} />
      <StellarLogo fill="black" />
      <Spacer />
      <Container
        bg="white"
        border="1px solid"
        borderColor="gray.400"
        borderRadius="0.25rem"
        w="max-content"
        mr="0.5rem"
      >
        <Text fontSize="xs" color="black" py="0.25rem" lineHeight="20px">
          {Authentication.getUser()?.name || '-'}
        </Text>
      </Container>
      <SwitchTheme />
    </Flex>
  )
}
