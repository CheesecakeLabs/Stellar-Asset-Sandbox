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
  Tooltip,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { TooltipsData } from 'utils/constants/tooltips-data'
import { toCrypto, toNumber } from 'utils/formatter'

import { AssetHeader } from 'components/atoms'
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
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue)
            })}
          >
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Amount to burn</FormLabel>
                <Tooltip label={TooltipsData.burn}>
                  <HelpIcon width="20px" />
                </Tooltip>
              </Flex>
              <Input
                as={NumericFormat}
                decimalScale={7}
                thousandSeparator=","
                placeholder="Type the amount you want to burn..."
                autoComplete="off"
                value={getValues('amount')}
                onChange={(event): void => {
                  setValue('amount', toNumber(event.target.value))
                }}
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
