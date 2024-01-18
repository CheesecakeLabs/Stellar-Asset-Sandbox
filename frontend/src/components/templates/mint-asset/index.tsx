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
        <Box p="1rem" w="full">
          <form onSubmit={handleSubmit(data => handleForm(data))}>
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Amount to mint</FormLabel>
                <Tooltip label={TooltipsData.mint}>
                  <HelpIcon width="20px" />
                </Tooltip>
              </Flex>
              <Input
                as={NumericFormat}
                decimalScale={7}
                thousandSeparator=","
                placeholder="Type the amount you want to mint..."
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
                w={{ base: 'full', md: 'fit-content' }}
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
          assetCode={asset.code}
        />
      )}
    </Flex>
  )
}
