import { Container, Flex, Img, Tag, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { getCurrencyIcon, vaultCategoryTheme } from 'utils/constants/constants'
import { toCrypto } from 'utils/formatter'
import { GAService } from 'utils/ga'

import { PathRoute } from 'components/enums/path-route'
import { LockIcon } from 'components/icons'

interface IItemVault {
  vault: Hooks.UseVaultsTypes.IVault
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
}

export const ItemVault: React.FC<IItemVault> = ({ vault, assets }) => {
  const navigate = useNavigate()

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
    <Container
      variant="primary"
      display="flex"
      flexDir="column"
      onClick={(): void => {
        GAService.GAEvent('vault_details_click')
        navigate(`${PathRoute.VAULT_DETAIL}/${vault.id}`)
      }}
      cursor="pointer"
      w="full"
      maxW="full"
    >
      <Text
        pb="0.5rem"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        textAlign="center"
        fontSize="md"
        fontWeight="700"
        _dark={{ borderColor: 'black.800', color: 'white' }}
      >
        {vault.name}
      </Text>
      <Flex justifyContent="center">
        <Tag
          variant={vault.vault_category?.theme || vaultCategoryTheme[0]}
          mt="0.5rem"
          mb="0.75rem"
          textAlign="center"
          fontSize="xs"
          fontWeight="700"
          w="fit-content"
        >
          {vault.vault_category?.name}
        </Tag>
      </Flex>

      {vault.accountData &&
        vault.accountData.balances.slice(0, 3).map(
          (balance, index) =>
            balance.asset_code && (
              <Flex
                key={index}
                justifyContent="space-between"
                fill="black"
                stroke="black"
                _dark={{ fill: 'white', stroke: 'white' }}
                alignItems="center"
                h="1.75rem"
              >
                <Flex alignItems="center" gap={2}>
                  {findAsset(balance)?.image ? (
                    <Img src={findAsset(balance)?.image} w="16px" h="16px" />
                  ) : (
                    getCurrencyIcon(balance.asset_code, '1rem')
                  )}
                  <Text fontSize="sm">{balance.asset_code}</Text>
                </Flex>
                <Flex alignItems="center" gap={2}>
                  <Text fontSize="sm">{toCrypto(Number(balance.balance))}</Text>
                  {!balance.is_authorized && <LockIcon width="0.75rem" />}
                </Flex>
              </Flex>
            )
        )}
    </Container>
  )
}
