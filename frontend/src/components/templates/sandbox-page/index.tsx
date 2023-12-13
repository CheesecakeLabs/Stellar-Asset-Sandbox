import { Box, Flex, SimpleGrid, Spacer, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as Cheesecake } from 'app/core/resources/cheesecake.svg'
import { ReactComponent as CheesecakeLogo } from 'app/core/resources/ckl-logo-white.svg'
import SANDBOX_CUSTODIAL from 'app/core/resources/sandbox-custodial.png'
import SANDBOX_NON_CUSTODIAL from 'app/core/resources/sandbox-non-custodial.png'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { ItemCase } from './item-case'

export const SandboxTemplate: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Flex pos="fixed" bg="#0058ff" zIndex="99" w="full">
        <Flex
          fill="white"
          maxW="1280px"
          margin="auto"
          w="full"
          gap={4}
          py="1rem"
          alignItems="center"
        >
          <CheesecakeLogo height="32px" width="32px" />
          <Cheesecake height="64px" width="256px" />
        </Flex>
      </Flex>
      <Flex>
        <Flex
          h="98vh"
          w="100%"
          bg="#0058ff"
          transform="skewY(-12deg)"
          transformOrigin="left"
          flexDir="column"
        >
          <Spacer />
          <Flex
            flexDir="column"
            maxW="1280px"
            margin="auto"
            transform="skewY(12deg)"
            w="full"
            mb="5rem"
          >
            <Text
              maxW="697px"
              mb="2rem"
              fontWeight="bold"
              fontSize="4.5rem"
              color="white"
              lineHeight="1.1"
            >
              These companies trusted us and so can you
            </Text>
            <Text
              maxW="697px"
              fontWeight="300"
              fontSize="1.5rem"
              color="white"
              lineHeight="2rem"
            >
              Take a look below at some of the great products that we’ve helped
              our partners build.
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex flexDir="column" maxW="1280px" margin="auto" mb="5rem" mt="2rem">
        <SimpleGrid columns={{ md: 2, sm: 1 }} spacing="4rem">
          <ItemCase
            title={
              'Non-custodial Stellar Asset Sandbox: Create and manage tokens on the Stellar network using your Freighter account.'
            }
            subTitle={'Non custodial'}
            bg={'#1e2024'}
            img={SANDBOX_CUSTODIAL}
            onClick={(): Window | null => window.open("https://stellar.cheesecakelabs.com/","_self")}
          />
          <ItemCase
            title={
              'Custodial Stellar Asset Sandbox: An enterprise-grade, role-based platform for effortless creation and management of tokens with a user-friendly interface.'
            }
            subTitle={'Custodial'}
            bg={'primary.normal'}
            img={SANDBOX_NON_CUSTODIAL}
            onClick={(): void => navigate('/')}
          />
        </SimpleGrid>
      </Flex>

      <Flex
        w="full"
        bg="#1e2024"
        fill="white"
        justifyContent="center"
        py="0.5rem"
        mt="10rem"
      >
        <StellarLogo width="72px" />
      </Flex>
    </Box>
  )
}
