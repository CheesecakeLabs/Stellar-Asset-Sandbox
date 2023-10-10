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

import { getCurrencyIcon } from 'utils/constants/constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toCrypto } from 'utils/formatter'

import { Loading } from 'components/atoms'
import { PathRoute } from 'components/enums/path-route'
import { ArrowRightIcon, NewIcon } from 'components/icons'

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
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
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
                <Th w="2rem" p={0} />
                <Th>Asset</Th>
                <Th>Contract</Th>
                <Th>APY</Th>
                <Th>Term</Th>
                <Th>Compound</Th>
                <Th>Minimum Deposit</Th>
                <Th w="2rem" p={0} />
              </Thead>
              <Tbody>
                {contracts.map(contract => (
                  <Tr
                    borderColor="red"
                    cursor="pointer"
                    onClick={(): void => {
                      navigate(`${PathRoute.CONTRACT_DETAIL}/${contract.id}`)
                    }}
                  >
                    <Td>{getCurrencyIcon(contract.asset.code, '2rem')}</Td>
                    <Td>{contract.asset.code}</Td>
                    <Td>Contract</Td>
                    <Td>{`${contract.yield_rate}%`}</Td>
                    <Td>{`${contract.term}s`}</Td>
                    <Td>Every 10s</Td>
                    <Td>{toCrypto(contract.min_deposit)}</Td>
                    <Td w="2rem" p={0}>
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
