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
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'

interface IPublishInformationTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>,
    isAssetAnchored: boolean
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
  tomlData: Hooks.UseAssetsTypes.ITomlFile | undefined
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

  useEffect(() => {
    const currency = tomlData?.CURRENCIES?.find(
      currency =>
        currency.code === asset.code &&
        currency.issuer === asset.issuer.key.publicKey
    )

    if (currency) {
      setValue('desc', currency.desc)
      setValue('attestation_of_reserve', currency.attestation_of_reserve)
      if (currency.is_asset_anchored) {
        setIsAssetAnchored(currency.is_asset_anchored)
        setValue('anchor_asset_type', currency.anchor_asset_type)
        setValue('anchor_asset', currency.anchor_asset)
      }
    }
  }, [asset.code, asset.issuer.key.publicKey, setValue, tomlData])

  return (
    <Flex flexDir="column" w="full">
      <Container variant="primary" justifyContent="center" maxW="full" p="0">
        <AssetHeader asset={asset} />
        <Box p="1rem" w="full">
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue, isAssetAnchored)
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

            <FormControl mt="1.5rem">
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Attestation of reserve</FormLabel>
              </Flex>
              <Input
                placeholder="URL"
                autoComplete="off"
                {...register('attestation_of_reserve')}
              />
            </FormControl>

            <Checkbox
              variant="highlight"
              me="1rem"
              mt="1.5rem"
              isChecked={isAssetAnchored}
              onChange={(event): void => {
                setIsAssetAnchored(event.target.checked)
              }}
            >
              Is anchored?
            </Checkbox>

            {isAssetAnchored && (
              <>
                <FormControl mt="1.5rem">
                  <Flex justifyContent="space-between" w="full" px="0.25rem">
                    <FormLabel>Anchor asset type</FormLabel>
                  </Flex>
                  <Input
                    placeholder="fiat, crypto, nft..."
                    autoComplete="off"
                    {...register('anchor_asset_type')}
                  />
                </FormControl>

                <FormControl mt="1.5rem">
                  <Flex justifyContent="space-between" w="full" px="0.25rem">
                    <FormLabel>Anchor asset</FormLabel>
                  </Flex>
                  <Input
                    placeholder="Asset code"
                    autoComplete="off"
                    {...register('anchor_asset')}
                  />
                </FormControl>
              </>
            )}

            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
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
