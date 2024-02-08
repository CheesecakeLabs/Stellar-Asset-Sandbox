import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { ItemToml } from './components/item-toml'
import { SelectAnchorType } from './components/select-anchor-type'
import { AssetHeader } from 'components/atoms'

interface IPublishInformationTemplate {
  onSubmit(
    data: FieldValues,
    isAssetAnchored: boolean,
    isUnlimited: boolean,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  tomlData: Hooks.UseAssetsTypes.ITomlFile | undefined
}

export interface IOption {
  readonly label: string
  readonly value: string
}

export const PublishInformationTemplate: React.FC<
  IPublishInformationTemplate
> = ({ onSubmit, loading, asset, tomlData }) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm()

  const [isAssetAnchored, setIsAssetAnchored] = useState(false)
  const [isUnlimited, setIsUnlimited] = useState(false)

  const anchorTypes = [
    'FIAT',
    'Crypto',
    'NFT',
    'Stock',
    'Bond',
    'Commodity',
    'Real estate',
  ]

  const getCurrency = useCallback(():
    | Hooks.UseAssetsTypes.ICurrencies
    | undefined => {
    return tomlData?.CURRENCIES?.find(
      currency =>
        currency.code === asset.code &&
        currency.issuer === asset.issuer.key.publicKey
    )
  }, [asset.code, asset.issuer.key.publicKey, tomlData?.CURRENCIES])

  useEffect(() => {
    const currency = getCurrency()

    if (currency) {
      setValue('desc', currency.desc)
      setValue('attestation_of_reserve', currency.attestation_of_reserve)
      setValue('max_number', currency.max_number)
      setIsUnlimited(currency.is_unlimited)
      if (currency.is_asset_anchored) {
        setIsAssetAnchored(currency.is_asset_anchored)
        setValue('anchor_asset_type', currency.anchor_asset_type)
        setValue('anchor_asset', currency.anchor_asset)
      }
    }
  }, [getCurrency, setValue])

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem" w="full">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, isAssetAnchored, isUnlimited, setValue)
            })}
          >
            <FormControl isInvalid={errors?.amount !== undefined}>
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Description</FormLabel>
              </Flex>
              <Textarea
                placeholder="Token description"
                autoComplete="off"
                {...register('desc')}
              />
            </FormControl>

            <ItemToml
              title={'Attestation of reserve'}
              description={
                'URL to attestation or other proof, evidence, or verification of reserves, such as third-party audits.'
              }
            >
              <Input
                placeholder="URL"
                autoComplete="off"
                {...register('attestation_of_reserve')}
              />
            </ItemToml>

            <ItemToml
              title={'Is anchored'}
              description={
                'True if token can be redeemed for underlying asset, otherwise false.'
              }
            >
              <Checkbox
                variant="highlight"
                me="1rem"
                isChecked={isAssetAnchored}
                onChange={(event): void => {
                  setIsAssetAnchored(event.target.checked)
                }}
              >
                Is anchored?
              </Checkbox>
            </ItemToml>

            {isAssetAnchored && (
              <>
                <ItemToml
                  title={'Anchor asset type'}
                  description={
                    'Type of asset anchored. Can be fiat, crypto, nft, stock, bond, commodity, real estate, or other.'
                  }
                >
                  <SelectAnchorType
                    anchorTypes={anchorTypes}
                    setValue={setValue}
                    currentType={getCurrency()?.anchor_asset_type}
                  />
                </ItemToml>

                <ItemToml
                  title={'Anchor asset'}
                  description={
                    'If anchored token, code / symbol for asset that token is anchored to. E.g. USD, BTC, SBUX, Address of real-estate investment property.'
                  }
                >
                  <Input
                    placeholder="Asset code"
                    autoComplete="off"
                    {...register('anchor_asset')}
                  />
                </ItemToml>
              </>
            )}

            <ItemToml
              title={'Is unlimited'}
              description={
                "The number of tokens is dilutable at the issuer's discretion."
              }
            >
              <Checkbox
                variant="highlight"
                me="1rem"
                isChecked={isUnlimited}
                onChange={(event): void => {
                  setIsUnlimited(event.target.checked)
                }}
              >
                Is unlimited?
              </Checkbox>
            </ItemToml>

            <ItemToml
              title={'Max number'}
              description={
                'Max number of tokens, defining the upper limit for the total circulating supply.'
              }
            >
              <Input
                placeholder="Max number"
                type="number"
                autoComplete="off"
                {...register('max_number')}
              />
            </ItemToml>

            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
                w={{ base: 'full', md: 'fit-content' }}
              >
                Publish information
              </Button>
            </Flex>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}
