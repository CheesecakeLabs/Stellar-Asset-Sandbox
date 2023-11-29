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
  Img,
  Skeleton,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { getCurrencyIcon } from 'utils/constants/constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { base64ToImg } from 'utils/converter'
import { toCrypto } from 'utils/formatter'

import { CompoundTime } from '../contracts-create/components/select-compound'
import { PathRoute } from 'components/enums/path-route'
import { ArrowRightIcon, NewIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'

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
            New Certificate of Deposit
          </Button>
        </Flex>
        <Container variant="primary" p={0} maxW="full">
          {loading ? (
            <Skeleton w="full" h="10rem" />
          ) : !contracts || contracts.length === 0 ? (
            <Empty title={'No contracts created yet'} />
          ) : (
            <Table w="full">
              <Thead w="full">
                <Th w="2rem" p={0} />
                <Th>Asset</Th>
                <Th>Vault</Th>
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
                    <Td>
                      {contract.asset.image ? (
                        <Img
                          src={base64ToImg(contract.asset.image)}
                          w="32px"
                          h="32px"
                        />
                      ) : (
                        getCurrencyIcon(contract.asset.code, '2rem')
                      )}
                    </Td>
                    <Td>{contract.asset.code}</Td>
                    <Td>{contract.vault.name}</Td>
                    <Td>{`${contract.yield_rate / 100}%`}</Td>
                    <Td>{`${contract.term / 86400} day(s)`}</Td>
                    <Td>{`${
                      contract.compound === 0
                        ? 'Simple interest'
                        : CompoundTime[contract.compound]
                    }`}</Td>
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
