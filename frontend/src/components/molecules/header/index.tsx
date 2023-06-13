import { Container, Flex, Spacer, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'

import { MobileNav } from 'components/atoms'

import Authentication from 'app/auth/services/auth'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { SwitchTheme } from '../switch-theme'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Flex
      h="4.5rem"
      w="full"
      align="center"
      ps={{ base: 2, md: 12 }}
      pe={6}
      pos="fixed"
      zIndex={99}
      borderBottom="1px solid"
      borderColor={isDark ? 'black.800' : 'gray.600'}
    >
      <MobileNav onOpen={onOpen} />
      <StellarLogo fill={isDark ? 'white' : 'black'} />
      <Spacer />
      <Container variant="primary" w="max-content" mr="1rem" px="0.75rem" py="0.25rem">
        <Text fontSize="xs" py="0.25rem" lineHeight="20px">
          {Authentication.getUser()?.name || '-'}
        </Text>
      </Container>
      <SwitchTheme />
    </Flex>
  )
}
