import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AssetsList } from './components/assets-list'
import { ChartPayments } from './components/chart-payments'
import { ChartSupply } from './components/chart-supply'

interface IDashboardsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
}

export const DashboardsTemplate: React.FC<IDashboardsTemplate> = ({
  loading,
  vaults,
}) => {
  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="1024px" alignSelf="center" flexDir="column" w="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="400">
            Dashboards
          </Text>
        </Flex>
        <Flex>
          <Box w="full" mr="1rem">
            <ChartPayments label={'asd'} />
          </Box>
          <AssetsList />
        </Flex>
      </Flex>
    </Flex>
  )
}
