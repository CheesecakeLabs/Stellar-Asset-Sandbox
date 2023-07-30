import { Container, Flex, Text, SimpleGrid, Box, Tag } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { toCrypto } from 'utils/formatter'

import { Loading } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { CoinIcon, LockIcon, PlusIcon } from 'components/icons'

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
        </Flex>
        <Box p={0} maxW="full">
          {loading || !vaults ? (
            <Loading />
          ) : (
            <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={5}>
              {vaults.map(vault => (
                <Container
                  variant="primary"
                  display="flex"
                  flexDir="column"
                  onClick={(): void =>
                    navigate(PathRoute.VAULT_DETAIL, { state: vault })
                  }
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
                            h="1.5rem"
                          >
                            <Flex alignItems="center" gap={2}>
                              <CoinIcon width="1rem" />
                              <Text fontSize="xs">{balance.asset_code}</Text>
                            </Flex>
                            <Flex alignItems="center" gap={2}>
                              <Text fontSize="xs">
                                {toCrypto(Number(balance.balance))}
                              </Text>
                              {!balance.is_authorized && (
                                <LockIcon width="0.75rem" />
                              )}
                            </Flex>
                          </Flex>
                        )
                    )}
                </Container>
              ))}
              <Container
                variant="primary"
                display="flex"
                flexDir="column"
                onClick={(): void =>
                  navigate({ pathname: PathRoute.VAULT_CREATE })
                }
                fill="gray.650"
                stroke="gray.650"
                _dark={{ fill: 'white', stroke: 'white' }}
                cursor="pointer"
                justifyContent="center"
                alignItems="center"
                bg="none"
              >
                <PlusIcon width="10rem" />
              </Container>
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
