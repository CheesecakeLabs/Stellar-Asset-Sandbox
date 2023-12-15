import {
  Button,
  Container,
  Flex,
  Img,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'react-feather'
import { useNavigate } from 'react-router-dom'

import { useAssets } from 'hooks/useAssets'
import { useAuth } from 'hooks/useAuth'
import { getCurrencyIcon } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'

import { MobileNav } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { LockIcon, WalletIcon } from 'components/icons'

import Authentication from 'app/auth/services/auth'
import { ReactComponent as StellarLogo } from 'app/core/resources/stellar.svg'

import { SwitchTheme } from '../switch-theme'

interface IHeader {
  onOpen(): void
}

export const Header: React.FC<IHeader> = ({ onOpen }) => {
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [assets, setAssets] = useState<Hooks.UseAssetsTypes.IAssetDto[]>()
  const { profile, getProfile } = useAuth()
  const { getAssets } = useAssets()
  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    getAssets().then(assets => setAssets(assets))
  }, [getAssets])

  const findAsset = (
    balance: Hooks.UseHorizonTypes.IBalance
  ): Hooks.UseAssetsTypes.IAssetDto | undefined => {
    return assets?.find(
      asset =>
        asset.code === balance.asset_code &&
        asset.issuer.key.publicKey === balance.asset_issuer
    )
  }

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
      {profile?.vault_id && (
        <Popover trigger={isLargerThanSm ? 'hover' : 'click'}>
          <PopoverTrigger>
            <Container
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
                isLargerThanSm
                  ? navigate(`${PathRoute.VAULT_DETAIL}/${profile.vault_id}`)
                  : undefined
              }}
            >
              <WalletIcon fill="white" width="16px" height="16px" />
              {isLargerThanMd && (
                <Text
                  fontSize="sm"
                  py="0.25rem"
                  lineHeight="20px"
                  color="white"
                >
                  My wallet
                </Text>
              )}
              <ChevronDown color="white" size="14px" />
            </Container>
          </PopoverTrigger>
          <PopoverContent
            w="fit-content"
            minW="240px"
            _dark={{ bg: 'black.800' }}
          >
            <PopoverArrow />
            <PopoverBody>
              <Text mb="0.75rem">{profile.vault.name}</Text>
              {profile.vault.accountData?.balances.map(
                (balance, index) =>
                  balance.asset_code && (
                    <Flex
                      justifyContent="space-between"
                      key={index}
                      mb="0.5rem"
                    >
                      <Flex
                        alignItems="center"
                        gap={3}
                        fill="black"
                        stroke="black"
                        _dark={{ fill: 'white', stroke: 'white' }}
                      >
                        {findAsset(balance)?.image ? (
                          <Img
                            src={findAsset(balance)?.image}
                            w="24px"
                            h="24px"
                          />
                        ) : (
                          getCurrencyIcon(balance.asset_code, '1.5rem')
                        )}
                        <Text fontSize="sm">{balance.asset_code}</Text>
                      </Flex>
                      <Flex
                        alignItems="center"
                        gap={2}
                        _dark={{ fill: 'white' }}
                        justifyContent="flex-end"
                      >
                        <Text fontSize="xs" fontWeight="700">
                          {toCrypto(Number(balance.balance))}
                        </Text>
                        {!balance.is_authorized && (
                          <LockIcon height="16px" width="16px" />
                        )}
                      </Flex>
                    </Flex>
                  )
              )}
              <Button
                variant="secondary"
                w="full"
                h="2rem"
                mt="0.75rem"
                onClick={(): void => {
                  navigate(`${PathRoute.VAULT_DETAIL}/${profile.vault_id}`)
                }}
              >
                Access my wallet
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
      <SwitchTheme />
    </Flex>
  )
}
