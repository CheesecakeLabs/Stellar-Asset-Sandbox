import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { toCrypto } from 'utils/formatter'

import { AssetHeader } from 'components/atoms'
import { HelpIcon } from 'components/icons'
import { ChartMintBurn } from 'components/molecules/chart-mint-burn'
import { TChartPeriod } from 'components/molecules/chart-period'

interface IMintAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  assetData: Hooks.UseHorizonTypes.IAsset | undefined
  mintOperations: Hooks.UseDashboardsTypes.IAsset | undefined
  burnOperations: Hooks.UseDashboardsTypes.IAsset | undefined
  loadingChart: boolean
  chartPeriod: TChartPeriod
  setChartPeriod: Dispatch<SetStateAction<TChartPeriod>>
}

export const MintAssetTemplate: React.FC<IMintAssetTemplate> = ({
  onSubmit,
  setChartPeriod,
  loading,
  asset,
  assetData,
  mintOperations,
  burnOperations,
  loadingChart,
  chartPeriod,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem" w="full">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue)
            })}
          >
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Flex
                justifyContent="space-between"
                w="full"
                px="0.25rem"
                fill="gray.900"
                stroke="gray.900"
                _dark={{
                  fill: 'white',
                  stroke: 'white',
                }}
              >
                <FormLabel>Amount to mint</FormLabel>
                <HelpIcon />
              </Flex>
              <Input
                type="number"
                placeholder="Type the amount you want to mint..."
                autoComplete="off"
                {...register('amount', {
                  required: true,
                })}
              />
              <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>
            <Text
              color="gray.900"
              fontWeight="600"
              fontSize="xs"
              mt="0.5rem"
              ms="0.25rem"
            >
              {`Circulation supply: ${
                assetData
                  ? `${toCrypto(Number(assetData.amount))} ${asset.code}`
                  : 'loading'
              }`}
            </Text>
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Mint asset
              </Button>
            </Flex>
          </form>
        </Box>
      </Container>
      {mintOperations && burnOperations && (
        <ChartMintBurn
          loadingChart={loadingChart}
          mintOperations={mintOperations}
          burnOperations={burnOperations}
          chartPeriod={chartPeriod}
          setChartPeriod={setChartPeriod}
        />
      )}
    </Flex>
  )
}
