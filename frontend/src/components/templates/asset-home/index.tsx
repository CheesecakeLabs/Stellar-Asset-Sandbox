import {
  Container,
  Flex,
  FocusLock,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import { havePermission } from 'utils'
import { STELLAR_EXPERT_ASSET } from 'utils/constants/constants'
import { typesAsset } from 'utils/constants/data-constants'
import { TooltipsData } from 'utils/constants/tooltips-data'
import { formatAccount, toCrypto } from 'utils/formatter'

import { AssetImage } from './components/asset-image'
import { FormEditAsset } from './components/form-edit-asset'
import { Permissions } from 'components/enums/permissions'
import { EditIcon, LinkIcon, WalletIcon } from 'components/icons'
import { TChartPeriod } from 'components/molecules/chart-period'

import { ChartPayments } from '../../molecules/chart-payments'
import { InfoCard } from '../../molecules/info-card'

interface IAssetHomeTemplate {
  loading: boolean
  loadingChart: boolean
  updatingAsset: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  paymentsAsset: Hooks.UseDashboardsTypes.IAsset | undefined
  chartPeriod: TChartPeriod
  permissions: Hooks.UseAuthTypes.IUserPermission | undefined
  selectedFile: File | null
  setSelectedFile: Dispatch<SetStateAction<File | null>>
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
  handleUploadImage(): Promise<boolean>
  handleUpdateAsset(name: string, code: string): Promise<boolean>
}

export const AssetHomeTemplate: React.FC<IAssetHomeTemplate> = ({
  asset,
  loadingChart,
  paymentsAsset,
  updatingAsset,
  chartPeriod,
  permissions,
  selectedFile,
  setChartPeriod,
  setSelectedFile,
  handleUploadImage,
  handleUpdateAsset,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = React.useRef(null)

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="1rem">
        <Flex flexDir="column">
          <Flex mb="1rem">
            <AssetImage
              asset={asset}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleUploadImage={handleUploadImage}
              havePermission={havePermission(
                Permissions.MINT_ASSET,
                permissions
              )}
            />
            <Flex
              borderBottom="1px solid"
              borderColor={'gray.600'}
              w="full"
              pb="0.5rem"
              alignItems="center"
              pe="0.5rem"
              _dark={{ borderColor: 'black.800' }}
            >
              <Flex flexDir="column" w="full">
                <Flex alignItems="center">
                  <Text fontSize="xl" fontWeight="600">
                    {`${asset.name} (${asset.code})`}
                  </Text>
                  {permissions?.admin && (
                    <Popover
                      isOpen={isOpen}
                      initialFocusRef={firstFieldRef}
                      closeOnBlur={false}
                      onOpen={onOpen}
                      onClose={onClose}
                    >
                      <PopoverTrigger>
                        <IconButton
                          size="sm"
                          icon={<EditIcon />}
                          aria-label="Edit"
                        />
                      </PopoverTrigger>
                      <PopoverContent p={5} _dark={{ bg: 'black.700' }}>
                        <FocusLock persistentFocus={false}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <FormEditAsset
                            asset={asset}
                            updatingAsset={updatingAsset}
                            handleUpdate={handleUpdateAsset}
                            onClose={onClose}
                          />
                        </FocusLock>
                      </PopoverContent>
                    </Popover>
                  )}
                </Flex>
                <Text fontSize="sm" mr="0.5rem">
                  {typesAsset.find(type => type.id === asset.asset_type)
                    ?.name || ''}
                </Text>
              </Flex>
              <Flex
                cursor="pointer"
                ms="0.5rem"
                _dark={{ fill: 'white' }}
                onClick={(): Window | null =>
                  window.open(
                    `${STELLAR_EXPERT_ASSET}/${asset.code}-${asset.issuer.key.publicKey}`,
                    '_blank'
                  )
                }
              >
                <LinkIcon />
              </Flex>
            </Flex>
          </Flex>

          <Flex ms="4rem" flexDir="column">
            <Flex>
              <Flex flexDir="column">
                <Text fontSize="xs" fontWeight="700" mb="0.25rem">
                  Issuer
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.issuer.key.publicKey)}
                </Text>
              </Flex>

              <Flex flexDir="column" ms="1.5rem">
                <Text fontSize="xs" fontWeight="700" mb="0.25rem">
                  Distributor
                </Text>
                <Text fontSize="sm">
                  {formatAccount(asset.distributor.key.publicKey)}
                </Text>
              </Flex>
            </Flex>

            <Flex flexDir="column" mt="1rem">
              <Text fontSize="xs" fontWeight="700" mb="0.5rem">
                Flags
              </Text>
              <Flex gap={2}>
                {asset.assetData?.flags.auth_required && (
                  <Tag variant={'actived'}>Authorize required</Tag>
                )}
                {asset.assetData?.flags.auth_clawback_enabled && (
                  <Tag variant={'actived'}>Clawback enabled</Tag>
                )}
                {asset.assetData?.flags.auth_revocable && (
                  <Tag variant={'actived'}>Freeze enabled</Tag>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Container>

      <Flex flexDir={{ base: 'column', md: 'row' }} w="full" gap={3} mt="1rem">
        <InfoCard
          title={`Total Supply`}
          icon={<WalletIcon fill="gray" />}
          value={toCrypto(Number(asset.assetData?.amount || 0))}
          helper={TooltipsData.totalSupply}
        />
        <InfoCard
          title={`Main Vault`}
          icon={<WalletIcon fill="gray" />}
          value={toCrypto(Number(asset.distributorBalance?.balance || 0))}
          helper={TooltipsData.mainVault}
        />
      </Flex>

      {paymentsAsset && (
        <ChartPayments
          loadingChart={loadingChart}
          paymentsAsset={paymentsAsset}
          chartPeriod={chartPeriod}
          setChartPeriod={setChartPeriod}
        />
      )}
    </Flex>
  )
}
