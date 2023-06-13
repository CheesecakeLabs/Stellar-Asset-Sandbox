import {
  Button,
  Container,
  Flex,
  FormLabel,
  Input,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PathRoute } from 'components/enums/path-route'
import { SwitchTheme } from 'components/molecules'

import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

export const ResetPasswordTemplate: React.FC = () => {
  const navigate = useNavigate()
  const { colorMode } = useColorMode()

  const isDark = colorMode === 'dark'

  return (
    <Flex w="full" pt="1.5rem" px="2rem" flexDir="column" h="100vh">
      <Flex w="full" justifyContent="space-between">
        <StellarLogo fill={isDark ? 'white' : 'black'} width="300px" />
        <SwitchTheme />
      </Flex>
      <Flex flexDir="column" w="376px" alignSelf="center" mt="6rem">
        <Container variant="primary" justifyContent="center" p="2rem">
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Reset password
          </Text>

          <form>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Email address"
              value="paul@stellar.org"
              disabled
            />

            <FormLabel mt="1.5rem">New Password</FormLabel>
            <Input placeholder="New Password" type="password" />

            <FormLabel mt="1.5rem">Confirm new password</FormLabel>
            <Input placeholder="Confirm new password" type="password" />

            <Button
              variant="primary"
              mt="1.5rem"
              onClick={(): void => {
                navigate(PathRoute.HOME)
              }}
            >
              Reset password
            </Button>
          </form>
        </Container>
      </Flex>
    </Flex>
  )
}
