import { Container, Flex, Tag, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { toCrypto } from 'utils/formatter'

import { PathRoute } from 'components/enums/path-route'
import { CoinIcon, LockIcon } from 'components/icons'

interface IItemVault {
  vault: Hooks.UseVaultsTypes.IVault
}

export const ItemVault: React.FC<IItemVault> = ({ vault }) => {
  const navigate = useNavigate()

  return (
    <Container
      variant="primary"
      display="flex"
      flexDir="column"
      onClick={(): void => navigate(`${PathRoute.VAULT_DETAIL}/${vault.id}`)}
      cursor="pointer"
    >
      <Text
        pb="0.5rem"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        textAlign="center"
        fontSize="md"
        fontWeight="700"
        color="gray.900"
        _dark={{ borderColor: 'black.800' }}
      >
        {vault.name}
      </Text>
      <Flex justifyContent="center">
        <Tag
          variant="blue"
          mt="0.5rem"
          mb="0.75rem"
          textAlign="center"
          fontSize="xs"
          fontWeight="700"
          w="fit-content"
        >
          {vault.vault_category.name}
        </Tag>
      </Flex>

      {vault.accountData &&
        vault.accountData.balances.map(
          (balance, index) =>
            balance.asset_code && (
              <Flex
                key={index}
                justifyContent="space-between"
                fill="black"
                stroke="black"
                _dark={{ fill: 'white', stroke: 'white' }}
                alignItems="center"
                h="1.5rem"
              >
                <Flex alignItems="center" gap={2}>
                  <CoinIcon width="1rem" />
                  <Text fontSize="xs">{balance.asset_code}</Text>
                </Flex>
                <Flex alignItems="center" gap={2}>
                  <Text fontSize="xs">{toCrypto(Number(balance.balance))}</Text>
                  {!balance.is_authorized && <LockIcon width="0.75rem" />}
                </Flex>
              </Flex>
            )
        )}
    </Container>
  )
}
