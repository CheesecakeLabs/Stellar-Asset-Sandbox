import { Flex, Text, SimpleGrid, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ItemVault } from './components/item-vault'
import { LoaderSkeleton } from './components/loader-skeleton'
import { PathRoute } from 'components/enums/path-route'
import { NewIcon } from 'components/icons'
import { Empty } from 'components/molecules/empty'

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
            leftIcon={<NewIcon />}
            onClick={(): void => navigate({ pathname: PathRoute.VAULT_CREATE })}
          >
            Create Vault
          </Button>
        </Flex>
        <Box p={0} maxW="full">
          {loading ? (
            <LoaderSkeleton />
          ) : vaults ? (
            <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={5}>
              {vaults.map((vault, index) => (
                <ItemVault key={index} vault={vault} />
              ))}
            </SimpleGrid>
          ) : (
            <Empty title={"You don't have any vaults yet"} />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
