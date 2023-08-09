import {
  Container,
  Flex,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Td,
  Button,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ArrowRightIcon, CoinIcon, NewIcon } from 'components/icons'
import { toCrypto } from 'utils/formatter'

interface IContractsTemplate {
  loading: boolean
  contracts: Hooks.UseContractsTypes.IContract[] | undefined
}

export const ContractsTemplate: React.FC<IContractsTemplate> = ({
  loading,
  contracts,
}) => {
  const navigate = useNavigate()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="840px" alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Certificate of Deposits
          </Text>
          <Button
            variant="primary"
            leftIcon={<NewIcon />}
            onClick={(): void =>
              navigate({ pathname: PathRoute.CONTRACT_CREATE })
            }
          >
            New Contract
          </Button>
        </Flex>
        <Container variant="primary" p={0} maxW="full">
          {loading || !contracts ? (
            <Loading />
          ) : (
            <Table w="full">
              <Thead w="full">
                <Tr>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                    w="2rem"
                    p={0}
                  />
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Asset
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Contract
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    APY
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Term
                  </Th>
                  <Th
                    color={'gray.700'}
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                  >
                    Minimum Deposit
                  </Th>
                  <Th
                    borderColor={'gray.400'}
                    _dark={{ borderColor: 'black.800' }}
                    w="2rem"
                    p={0}
                  />
                </Tr>
              </Thead>
              <Tbody>
                {contracts.map(contract => (
                  <Tr
                    borderColor="red"
                    cursor="pointer"
                    onClick={(): void => {
                      navigate(`${PathRoute.CONTRACT_DETAIL}/${contract.id}`)
                    }}
                    fill="black"
                    stroke="black"
                    _dark={{ fill: 'white', stroke: 'white' }}
                  >
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      <CoinIcon width="2rem" />
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {contract.asset.code}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      Contract
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {`${contract.yield_rate}%`}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {`${contract.term}s`}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800' }}
                    >
                      {toCrypto(contract.min_deposit)}
                    </Td>
                    <Td
                      borderColor={'gray.400'}
                      _dark={{ borderColor: 'black.800', fill: 'white' }}
                      w="2rem"
                      p={0}
                    >
                      <ArrowRightIcon width="12px" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Container>
      </Flex>
    </Flex>
  )
}
