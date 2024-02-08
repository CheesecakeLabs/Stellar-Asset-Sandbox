import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import { Flag, MinusCircle, PlusCircle } from 'react-feather'

import { STELLAR_EXPERT_TX_URL } from 'utils/constants/constants'
import { formatDateFull, toCrypto } from 'utils/formatter'

import {
  BackIcon,
  LinkIcon,
  NavLeftIcon,
  NavRightIcon,
  ReceivedIcon,
  SendedIcon,
} from 'components/icons'
import { Empty } from 'components/molecules/empty'

interface IListPayments {
  effects: Hooks.UseHorizonTypes.IEffects | undefined
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vault: Hooks.UseVaultsTypes.IVault | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  isPrevDisabled: boolean
  getPaymentsDataByLink(link: 'prev' | 'next'): void
}

export const ListPayments: React.FC<IListPayments> = ({
  effects,
  vaults,
  assets,
  isPrevDisabled,
  getPaymentsDataByLink,
}) => {
  const [isLargerThanSm] = useMediaQuery('(min-width: 480px)')

  const walletToName = (publicKey: string): string => {
    if (assets?.find(asset => asset.distributor.key.publicKey === publicKey)) {
      return 'Asset Issuer'
    }
    return (
      vaults?.find(vault => vault.wallet.key.publicKey === publicKey)?.name ||
      'External account'
    )
  }

  const walletOperation = (
    effectItem: Hooks.UseHorizonTypes.IEffectItem,
    type: 'FROM' | 'TO'
  ): string => {
    if (
      type === 'TO' &&
      effectItem.type === 'account_debited' &&
      effectItem.operation?.type === 'clawback'
    ) {
      return 'Asset Issuer'
    }

    if (
      effectItem.type === 'account_debited' ||
      effectItem.type === 'account_credited'
    ) {
      const operation =
        effectItem.operation as Hooks.UseHorizonTypes.IOperationPayment
      return type === 'FROM'
        ? walletToName(operation?.from)
        : walletToName(operation?.to)
    }
    return '-'
  }

  const operationType = (
    effectItem: Hooks.UseHorizonTypes.IEffectItem
  ): string => {
    if (effectItem.operation?.type === 'clawback') {
      return 'Clawback'
    }
    if (effectItem.type === 'account_debited') {
      return 'Payment sent'
    }
    if (effectItem.type === 'account_credited') {
      return 'Payment received'
    }
    if (effectItem.type === 'account_created') {
      return 'Vault created'
    }
    if (effectItem.type === 'trustline_removed') {
      return 'Asset removed'
    }
    if (effectItem.type === 'trustline_created') {
      return 'Asset added'
    }
    return '-'
  }

  const operationIcon = (
    effectItem: Hooks.UseHorizonTypes.IEffectItem
  ): ReactElement => {
    if (effectItem.operation?.type === 'clawback') {
      return <BackIcon width="20px" height="20px" />
    }
    if (effectItem.type === 'account_debited') {
      return <SendedIcon width="20px" height="20px" />
    }
    if (effectItem.type === 'account_credited') {
      return <ReceivedIcon width="20px" height="20px" />
    }
    if (effectItem.type === 'trustline_removed') {
      return <MinusCircle width="20px" height="20px" />
    }
    if (effectItem.type === 'trustline_created') {
      return <PlusCircle width="20px" height="20px" />
    }
    return <Flag width="20px" height="20px" />
  }

  return (
    <Container
      variant="primary"
      justifyContent="center"
      p="0"
      w="full"
      maxW="full"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor={'gray.600'}
        h="3.5rem"
        px="1rem"
        fill="black"
        stroke="black"
        _dark={{ fill: 'white', stroke: 'white', borderColor: 'black.800' }}
      >
        <Text fontSize="sm" fontWeight="600">
          Vault's history
        </Text>
      </Flex>
      <Box px="1rem" overflowX="auto">
        {effects?._embedded.records && effects._embedded.records.length > 0 ? (
          isLargerThanSm ? (
            <Table w="full" variant="list">
              <Thead w="full">
                <Tr>
                  <Th w="2rem" p={0} />
                  <Th>Action</Th>
                  <Th>Date</Th>
                  <Th>Asset</Th>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Amount</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {effects._embedded.records.map((effect, index) => (
                  <Tr key={index}>
                    <Td px="1rem" py={0}>
                      {operationIcon(effect)}
                    </Td>
                    <Td>{operationType(effect)}</Td>
                    <Td>
                      <Text fontSize="sm">
                        {formatDateFull(effect.created_at)}
                      </Text>
                    </Td>
                    <Td>{effect.asset_code || '-'}</Td>
                    <Td>{walletOperation(effect, 'FROM')}</Td>
                    <Td>{walletOperation(effect, 'TO')}</Td>
                    <Td>
                      {effect.amount ? toCrypto(Number(effect.amount)) : '-'}
                    </Td>
                    <Td>
                      <Flex
                        cursor="pointer"
                        _dark={{ fill: 'white' }}
                        onClick={(): Window | null =>
                          window.open(
                            `${STELLAR_EXPERT_TX_URL}/${effect.operation?.transaction_hash}`,
                            '_blank'
                          )
                        }
                      >
                        <LinkIcon />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Flex flexDir="column">
              {effects._embedded.records.map((effect, index) => (
                <Flex
                  key={index}
                  flexDir="column"
                  borderBottom="1px solid"
                  borderColor={'gray.600'}
                  _dark={{ borderColor: 'black.800' }}
                  pb={2}
                  pt={2}
                  gap={1}
                  onClick={(): Window | null =>
                    window.open(
                      `${STELLAR_EXPERT_TX_URL}/${effect.operation?.transaction_hash}`,
                      '_blank'
                    )
                  }
                >
                  <Flex alignItems="center" gap={2}>
                    {operationIcon(effect)}
                    <Text>{formatDateFull(effect.created_at)}</Text>
                  </Flex>
                  <Text fontWeight="bold">{operationType(effect)}</Text>
                  {walletOperation(effect, 'FROM') !== '-' && (
                    <Flex gap="0.35rem" alignItems="center">
                      <Text>
                        <b>FROM</b> {walletOperation(effect, 'FROM')} <b>TO</b>{' '}
                        {walletOperation(effect, 'TO')}
                      </Text>
                    </Flex>
                  )}
                  {effect.asset_code && (
                    <Flex gap="0.35rem">
                      <Text fontWeight="bold">Asset</Text>
                      <Text>{effect.asset_code}</Text>
                    </Flex>
                  )}
                  {effect.amount && (
                    <Flex gap="0.35rem">
                      <Text fontWeight="bold">Amount</Text>
                      <Text>{toCrypto(Number(effect.amount))}</Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Flex>
          )
        ) : (
          <Empty title={'No transactions'} hideIcon />
        )}
      </Box>
      <Flex justifyContent="flex-end">
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          leftIcon={
            <Flex w="1rem" justifyContent="center">
              <NavLeftIcon />
            </Flex>
          }
          isDisabled={isPrevDisabled}
          onClick={(): void => {
            if (effects?._links.prev.href) {
              getPaymentsDataByLink('prev')
            }
          }}
        >
          Previous
        </Button>
        <Button
          variant={'menuButton'}
          border="0"
          w="min-content"
          rightIcon={
            <Flex w="1rem" justifyContent="center">
              <NavRightIcon />
            </Flex>
          }
          isDisabled={effects?._links.next.results === 0}
          onClick={(): void => {
            if (effects?._links.next.href) {
              getPaymentsDataByLink('next')
            }
          }}
        >
          Next
        </Button>
      </Flex>
    </Container>
  )
}
