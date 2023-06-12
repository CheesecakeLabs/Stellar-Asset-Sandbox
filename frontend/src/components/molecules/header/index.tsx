import { Container, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

import { MobileNav } from 'components/atoms'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

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
      >
        <Text fontSize="xs" color="black" py="0.5rem" lineHeight="20px">
          John Anderson
        </Text>
      </Container>
    </Flex>
  )
}
