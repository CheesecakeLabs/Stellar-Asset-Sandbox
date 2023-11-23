import { Container, Flex, Spacer, Text, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { MobileNav } from 'components/atoms'

import Authentication from 'app/auth/services/auth'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { SwitchTheme } from '../switch-theme'
import { useAuth } from 'hooks/useAuth'
import { VaultIcon, WalletIcon } from 'components/icons'
import { PathRoute } from 'components/enums/path-route'
import { useNavigate } from 'react-router-dom'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')
  const { profile, getProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  return (
    <Flex
      h="4.5rem"
      w="full"
      align="center"
      ps={{ base: 2, md: 12 }}
      pe={6}
      pos="fixed"
      zIndex={99}
      bg="gray.500"
      borderBottom="1px solid"
      borderColor="gray.600"
      _dark={{ borderColor: 'black.800', bg: 'black.600' }}
    >
      <MobileNav onOpen={onOpen} />
      <Flex fill="black" _dark={{ fill: 'white' }} alignItems="center">
        <StellarLogo />
      </Flex>
      <Spacer />
      {isLargerThanSm && (
        <Container
          variant="primary"
          w="max-content"
          mr="1rem"
          px="0.75rem"
          py="0.25rem"
        >
          <Text fontSize="xs" py="0.25rem" lineHeight="20px">
            {Authentication.getUser()?.name || '-'}
          </Text>
        </Container>
      )}
      {profile?.vault_id && <Container
        variant="primary"
        bg="primary.normal"
        w="max-content"
        mr="1rem"
        px="0.75rem"
        py="0.25rem"
        display="flex"
        flexDir="row"
        alignItems="center"
        gap="0.5rem"
        cursor="pointer"
        onClick={(): void => {
          navigate(`${PathRoute.VAULT_DETAIL}/${profile.vault_id}`)
        }}
      >
        <VaultIcon fill="white" />
        <Text fontSize="sm" py="0.25rem" lineHeight="20px" color="white">
          My vault
        </Text>
      </Container>}
      <SwitchTheme />
    </Flex>
  )
}
