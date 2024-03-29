import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { TooltipsData } from 'utils/constants/tooltips-data'
import { toCrypto, toNumber } from 'utils/formatter'

import { AssetHeader } from 'components/atoms'
import { SupplyTag } from 'components/atoms/supply-tag'
import { HelpIcon } from 'components/icons'
import { ChartMintBurn } from 'components/molecules/chart-mint-burn'
import { TChartPeriod } from 'components/molecules/chart-period'

interface IBurnAssetTemplate {
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

export const BurnAssetTemplate: React.FC<IBurnAssetTemplate> = ({
  onSubmit,
  setChartPeriod,
  loading,
  asset,
  assetData,
  chartPeriod,
  mintOperations,
  burnOperations,
  loadingChart,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm()

  const handleForm = (data: FieldValues): void => {
    if (!data.amount) {
      setError('amount', { message: 'This field is required' })
      return
    }
    onSubmit(data, setValue)
  }

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem">
          <form onSubmit={handleSubmit(data => handleForm(data))}>
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Flex w="full" px="0.25rem" alignItems="center">
                <FormLabel>Amount to burn</FormLabel>
                <Box pb={2}>
                  <Tooltip label={TooltipsData.burn}>
                    <HelpIcon width="14px" />
                  </Tooltip>
                </Box>
              </Flex>
              <Input
                as={NumericFormat}
                decimalScale={7}
                thousandSeparator=","
                placeholder="Amount to burn..."
                autoComplete="off"
                value={getValues('amount')}
                onChange={(event): void => {
                  clearErrors('amount')
                  setValue('amount', toNumber(event.target.value))
                }}
              />
              <FormErrorMessage>
                {errors?.amount?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <Flex gap={2}>
              <SupplyTag
                value={`Circulation supply: ${
                  assetData
                    ? `${toCrypto(Number(assetData.amount))} ${asset.code}`
                    : 'loading'
                }`}
              />
              <SupplyTag
                value={`Main vault: ${toCrypto(
                  Number(asset.distributorBalance?.balance || 0)
                )}`}
              />
            </Flex>
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
                w={{ base: 'full', md: 'fit-content' }}
              >
                Burn asset
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
          assetCode={asset.code}
        />
      )}
    </Flex>
  )
}
