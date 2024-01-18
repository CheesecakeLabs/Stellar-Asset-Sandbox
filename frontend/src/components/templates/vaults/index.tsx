import { Flex, Text, SimpleGrid, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { GAService } from 'utils/ga'

import { ItemVault } from './components/item-vault'
import { LoaderSkeleton } from './components/loader-skeleton'
import { PathRoute } from 'components/enums/path-route'
import { NewIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'
import { Paginator } from 'components/molecules/paginator'

interface IVaultsTemplate {
  loading: boolean
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  currentPage: number
  totalPages: number
  changePage(page: number): void
}

export const VaultsTemplate: React.FC<IVaultsTemplate> = ({
  loading,
  vaults,
  assets,
  currentPage,
  totalPages,
  changePage,
}) => {
  const navigate = useNavigate()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="1280px" alignSelf="center" flexDir="column" w="full">
        <Flex mb="1rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Treasury
          </Text>
          <Button
            variant="primary"
            leftIcon={<NewIcon />}
            onClick={(): void => {
              GAService.GAEvent('create_vault_click')
              navigate({ pathname: PathRoute.VAULT_CREATE })
            }}
          >
            Create Vault
          </Button>
        </Flex>
        <Box p={0} maxW="full">
          {loading ? (
            <LoaderSkeleton />
          ) : vaults && vaults.length > 0 ? (
            <SimpleGrid columns={{ xl: 4, md: 3, sm: 2 }} spacing={5}>
              {vaults.map((vault, index) => (
                <ItemVault key={index} vault={vault} assets={assets} />
              ))}
            </SimpleGrid>
          ) : (
            <Empty title={"You don't have any vaults yet"} />
          )}
        </Box>

        <Paginator
          changePage={changePage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Flex>
    </Flex>
  )
}
