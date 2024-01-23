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
  useMediaQuery,
  Img,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { havePermission } from 'utils'
import { getCurrencyIcon } from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'
import { toCrypto } from 'utils/formatter'
import { GAService } from 'utils/ga'

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
import { Paginator } from 'components/molecules/paginator'

interface ITokenManagementTemplate {
  loading: boolean
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
  currentPage: number
  totalPages: number
  changePage(page: number): void
}

export const TokenManagementTemplate: React.FC<ITokenManagementTemplate> = ({
  loading,
  assets,
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
            Asset Management
          </Text>
          {havePermission(Permissions.CREATE_ASSET, userPermissions) && (
            <Button
              variant="primary"
              leftIcon={<JoinIcon fill="white" />}
              onClick={(): void => {
                GAService.GAEvent('forge_asset_click')
                navigate({ pathname: PathRoute.FORGE_ASSET })
              }}
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
                <Tr>
                  <Th w="2rem" p={0} />
                  <Th>Code</Th>
                  <Th>Name</Th>
                  {isLargerThanSm && <Th isNumeric>Supply</Th>}
                  {isLargerThanLg && <Th>Asset type</Th>}
                  {isLargerThanMd && <Th>Controls</Th>}
                  {isLargerThanMd && <Th w="2rem" p={0} />}
                </Tr>
              </Thead>
              <Tbody>
                {assets.map((asset, index) => (
                  <Tr
                    key={index}
                    cursor="pointer"
                    onClick={(): void => {
                      GAService.GAEvent('asset_details_click')
                      navigate(`${PathRoute.ASSET_HOME}/${asset.id}`)
                    }}
                  >
                    <Td minW="5rem">
                      {asset.image ? (
                        <Img src={asset.image} w="32px" h="32px" />
                      ) : (
                        getCurrencyIcon(asset.code, '2rem')
                      )}
                    </Td>
                    <Td>{asset.code}</Td>
                    <Td>{asset.name}</Td>
                    {isLargerThanSm && (
                      <Td isNumeric>
                        {asset.assetData
                          ? toCrypto(Number(asset.assetData?.amount))
                          : '-'}
                      </Td>
                    )}
                    {isLargerThanLg && (
                      <Td>
                        {typesAsset.find(type => type.id === asset.asset_type)
                          ?.name || ''}
                      </Td>
                    )}
                    {isLargerThanMd && (
                      <Td>
                        <Flex
                          fill="black.900"
                          _dark={{ fill: 'white' }}
                          gap={2}
                        >
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
                    )}
                    {isLargerThanMd && (
                      <Td w="2rem" p={0}>
                        <ArrowRightIcon width="12px" />
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Container>
        ) : (
          <Empty title="No forged assets" />
        )}
        <Paginator
          changePage={changePage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Flex>
    </Flex>
  )
}
