import {
  Container,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Box,
  Tag,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { toCrypto } from 'utils/formatter'

import { Loading } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { CoinIcon, JoinIcon } from 'components/icons'

interface IVaultsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
}

export const VaultsTemplate: React.FC<IVaultsTemplate> = ({
  loading,
  vaults,
}) => {
  const navigate = useNavigate()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="860px" alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Vaults
          </Text>
          <Button
            variant="primary"
            leftIcon={<JoinIcon fill="white" />}
            onClick={(): void => navigate({ pathname: PathRoute.VAULT_CREATE })}
          >
            Create vault
          </Button>
        </Flex>
        <Box p={0} maxW="full">
          {loading || !vaults ? (
            <Loading />
          ) : (
            <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={4}>
              {vaults.map(vault => (
                <Container variant="primary" display="flex" flexDir="column">
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
                      w="min-content"
                    >
                      {vault.vault_category.name}
                    </Tag>
                  </Flex>

                  {vault.accountData &&
                    vault.accountData.balances.map(
                      balance =>
                        balance.asset_code && (
                          <Flex
                            justifyContent="space-between"
                            fill="black"
                            stroke="black"
                            _dark={{ fill: 'white', stroke: 'white' }}
                            alignItems="center"
                            mt="0.25rem"
                          >
                            <Flex alignItems="center" gap={2}>
                              <CoinIcon width="1rem" />
                              <Text fontSize="xs">{balance.asset_code}</Text>
                            </Flex>
                            <Text fontSize="xs">
                              {toCrypto(Number(balance.balance))}
                            </Text>
                          </Flex>
                        )
                    )}
                </Container>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
