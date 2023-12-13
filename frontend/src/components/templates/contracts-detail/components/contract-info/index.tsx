import { Flex, Img, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { Calendar, AlertTriangle, DollarSign, Clock } from 'react-feather'

import { getCurrencyIcon } from 'utils/constants/constants'
import { base64ToImg } from 'utils/converter'
import { formatDateFull } from 'utils/formatter'

import { VaultIcon, ApyIcon } from 'components/icons'
import { CompoundTime } from 'components/templates/contracts-create/components/select-compound'

import { ItemContractData } from '../item-contract-data'

interface IContractInfo {
  contract: Hooks.UseContractsTypes.IContract
}

export const ContractInfo: React.FC<IContractInfo> = ({ contract }) => {
  const { colorMode } = useColorMode()

  return (
    <Flex flexDir="column">
      <Flex
        flexDir="column"
        alignItems="center"
        w={{ sm: '360px', lg: 'full' }}
        bg="gray.50"
        borderRadius="0.75rem"
        p="1rem"
        boxShadow="lower"
        _dark={{ bg: 'black.800' }}
      >
        <Text fontSize="xl">Certificate of deposit</Text>
        <Flex
          display="flex"
          bg="gray.200"
          w="fit-content"
          gap="0.5rem"
          px="1rem"
          py="0.25rem"
          mt="0.25rem"
          mb="0.5rem"
          borderRadius="0.5rem"
          alignItems="center"
          _dark={{ bg: 'black.700' }}
          stroke="black"
        >
          {contract.asset.image ? (
            <Img src={base64ToImg(contract.asset.image)} w="16px" h="16px" />
          ) : (
            getCurrencyIcon(contract.asset.code, '1rem')
          )}
          <Text fontSize="sm" fontWeight="600">
            {contract.asset.name}
          </Text>
        </Flex>

        <Flex
          flexDir="column"
          w="full"
          gap="0.75rem"
          mt="0.5rem"
          borderRadius="0.25rem"
          p="1rem"
        >
          <ItemContractData
            title={'Created at'}
            icon={<Calendar width="16px" height="16px" />}
            value={formatDateFull(contract.created_at)}
          />

          <ItemContractData
            title={'Vault'}
            icon={
              <VaultIcon
                width="16px"
                height="16px"
                fill={colorMode === 'dark' ? 'white' : 'grey'}
              />
            }
            value={contract.vault.name}
          />

          <ItemContractData
            title={'Yield %'}
            icon={
              <ApyIcon
                width="16px"
                height="16px"
                fill={colorMode === 'dark' ? 'white' : 'grey'}
              />
            }
            value={`${contract.yield_rate / 100}%, ${
              contract.compound === 0
                ? 'simple interest, does not compound'
                : `every ${CompoundTime[contract.compound]}`
            }`}
          />

          <ItemContractData
            title={'Penalty rate'}
            icon={<AlertTriangle width="16px" height="16px" />}
            value={`${contract.penalty_rate / 100}%`}
          />

          <ItemContractData
            title={'Min deposit'}
            icon={<DollarSign width="16px" height="16px" />}
            value={`${contract.min_deposit} ${contract.asset.code}`}
          />

          <ItemContractData
            title={'Term'}
            icon={<Clock width="16px" height="16px" />}
            value={`${contract.term / 86400} day(s)`}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
