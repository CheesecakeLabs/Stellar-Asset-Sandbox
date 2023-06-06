import { Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

import { StellarLogo } from 'components/icons'

import { ReactComponent as CheesecakeLogo } from 'app/core/resources/cheesecake-logo.svg'
import { ReactComponent as Cheesecake } from 'app/core/resources/cheesecake.svg'

export const Overview: React.FC = () => {
  return (
    <Flex
      bgGradient="linear(176.48deg, #27187E 0%, #1C1542 100%)"
      h="100vh"
      w="60%"
      alignItems="center"
      flexDir="column"
      pt="4rem"
    >
      <StellarLogo />
      <Text color="white" fontSize="2xl" mt="6rem">
        Welcome to the Stellar Asset Issuance Sandbox
      </Text>
      <Text color="white" fontSize="sm" mt="1rem" textAlign="center" maxW="70%">
        The Stellar Asset Sandbox is a sandbox supported by the Stellar
        Development Foundation and Cheesecake Labs for businesses to experiment
        with asset issuance on the Stellar testnet network.
      </Text>
      <Spacer />
      <Flex gap={4} mb="3rem">
        <CheesecakeLogo />
        <Cheesecake />
      </Flex>
    </Flex>
  )
}
