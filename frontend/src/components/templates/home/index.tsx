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
  Skeleton,
  Tooltip,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { havePermission } from 'utils'
import { getCurrencyIcon } from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toCrypto } from 'utils/formatter'

import { PathRoute } from 'components/enums/path-route'
import { Permissions } from 'components/enums/permissions'
import {
  ArrowRightIcon,
  AuthorizeIcon,
  BackIcon,
  BlockIcon,
  JoinIcon,
} from 'components/icons'
import { Empty } from 'components/molecules/empty'

interface IHomeTemplate {
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const HomeTemplate: React.FC<IHomeTemplate> = ({
  loading,
  assets,
  userPermissions,
}) => {
  const navigate = useNavigate()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW={MAX_PAGE_WIDTH} alignSelf="center" flexDir="column" w="full">
        <Flex mb="1.5rem" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="400">
            Token Management
          </Text>
          {havePermission(Permissions.CREATE_ASSET, userPermissions) && (
            <Button
              variant="primary"
              leftIcon={<JoinIcon fill="white" />}
              onClick={(): void =>
                navigate({ pathname: PathRoute.FORGE_ASSET })
              }
            >
              Forge asset
            </Button>
          )}
        </Flex>
        {loading ? (
          <Skeleton w="full" h="8rem" />
        ) : assets && assets.length > 0 ? (
          <Container variant="primary" p={0} maxW="full">
            <Table variant="simple">
              <Thead>
                <Th w="2rem" p={0} />
                <Th>Code</Th>
                <Th>Name</Th>
                <Th isNumeric>Supply</Th>
                <Th>Asset type</Th>
                <Th>Controls</Th>
                <Th w="2rem" p={0} />
              </Thead>
              <Tbody>
                {assets.map(asset => (
                  <Tr
                    cursor="pointer"
                    onClick={(): void =>
                      navigate(`${PathRoute.ASSET_HOME}/${asset.id}`)
                    }
                  >
                    <Td>{getCurrencyIcon(asset.code, '2rem')}</Td>
                    <Td>{asset.code}</Td>
                    <Td>{asset.name}</Td>
                    <Td isNumeric>
                      {asset.assetData
                        ? toCrypto(Number(asset.assetData?.amount))
                        : '-'}
                    </Td>
                    <Td>
                      {typesAsset.find(type => type.id === asset.asset_type)
                        ?.name || ''}
                    </Td>
                    <Td>
                      <Flex fill="black.900" _dark={{ fill: 'white' }} gap={2}>
                        {asset.assetData?.flags.auth_required && (
                          <Tooltip label="Authorize required">
                            <AuthorizeIcon width="18px" height="18px" />
                          </Tooltip>
                        )}
                        {asset.assetData?.flags.auth_clawback_enabled && (
                          <Tooltip label="Clawback enabled">
                            <BackIcon width="18px" height="18px" />
                          </Tooltip>
                        )}
                        {asset.assetData?.flags.auth_revocable && (
                          <Tooltip label="Freeze enabled">
                            <BlockIcon width="18px" height="18px" />
                          </Tooltip>
                        )}
                      </Flex>
                    </Td>
                    <Td w="2rem" p={0}>
                      <ArrowRightIcon width="12px" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Container>
        ) : (
          <Empty title="No forged assets" />
        )}
      </Flex>
    </Flex>
  )
}
