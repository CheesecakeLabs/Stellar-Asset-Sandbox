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
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { havePermission } from 'utils'
import { getCurrencyIcon } from 'utils/constants/constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toCrypto } from 'utils/formatter'

import { CompoundTime } from '../contracts-create/components/select-compound'
import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import { ArrowRightIcon, NewIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'
import { Paginator } from 'components/molecules/paginator'

interface IContractsTemplate {
  loading: boolean
  contracts: Hooks.UseContractsTypes.IContract[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
  currentPage: number
  totalPages: number
  changePage(page: number): void
}

export const ContractsTemplate: React.FC<IContractsTemplate> = ({
  loading,
  contracts,
  userPermissions,
  currentPage,
  totalPages,
  changePage,
}) => {
  const navigate = useNavigate()
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Certificate of Deposits
          </Text>
          {havePermission(Permissions.CREATE_CERTIFICATES, userPermissions) && (
            <Button
              variant="primary"
              leftIcon={<NewIcon />}
              onClick={(): void =>
                navigate({ pathname: PathRoute.CONTRACT_CREATE })
              }
            >
              {isLargerThanSm ? 'New Certificate of Deposit' : 'New'}
            </Button>
          )}
        </Flex>
        <Container variant="primary" p={0} maxW="full">
          {loading ? (
            <Skeleton w="full" h="10rem" />
          ) : !contracts || contracts.length === 0 ? (
            <Empty title={'No contracts created yet'} />
          ) : (
            <Table w="full">
              <Thead w="full">
                <Tr>
                  <Th w="2rem" p={0} />
                  <Th>Asset</Th>
                  <Th>Vault</Th>
                  {isLargerThanSm && <Th>Yield %</Th>}
                  {isLargerThanMd && <Th>Term</Th>}
                  {isLargerThanLg && <Th>Compound</Th>}
                  {isLargerThanLg && <Th>Minimum Deposit</Th>}
                  <Th w="2rem" p={0} />
                </Tr>
              </Thead>
              <Tbody>
                {contracts.map((contract, index) => (
                  <Tr
                    key={index}
                    borderColor="red"
                    cursor="pointer"
                    onClick={(): void => {
                      navigate(`${PathRoute.CONTRACT_DETAIL}/${contract.id}`)
                    }}
                  >
                    <Td minW="5rem">
                      {contract.asset.image ? (
                        <Img src={contract.asset.image} w="32px" h="32px" />
                      ) : (
                        getCurrencyIcon(contract.asset.code, '2rem')
                      )}
                    </Td>
                    <Td>{contract.asset.code}</Td>
                    <Td>{contract.vault.name}</Td>
                    {isLargerThanSm && (
                      <Td>{`${contract.yield_rate / 100}%`}</Td>
                    )}
                    {isLargerThanMd && (
                      <Td>{`${contract.term / 86400} day(s)`}</Td>
                    )}
                    {isLargerThanLg && (
                      <Td>{`${
                        contract.compound === 0
                          ? 'Simple interest'
                          : CompoundTime[contract.compound]
                      }`}</Td>
                    )}
                    {isLargerThanLg && (
                      <Td>{toCrypto(contract.min_deposit)}</Td>
                    )}
                    <Td w="2rem" p={0}>
                      <ArrowRightIcon width="12px" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Container>
        <Paginator
          changePage={changePage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Flex>
    </Flex>
  )
}
