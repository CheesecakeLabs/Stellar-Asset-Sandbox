import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import React from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { AssetHeader } from 'components/atoms'

interface IPublishInformationTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
  asset: Hooks.UseAssetsTypes.IAssetDto
}

export const PublishInformationTemplate: React.FC<
  IPublishInformationTemplate
> = ({ onSubmit, loading, asset }) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
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
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Description</FormLabel>
              </Flex>
              <Textarea
                placeholder="Token description"
                autoComplete="off"
                value={getValues('amount')}
                {...register('wallet', {
                  required: true,
                })}
              />
              <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>

            <FormControl mt="1.5rem">
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Attestation of reserve</FormLabel>
              </Flex>
              <Input
                placeholder="URL"
                autoComplete="off"
                {...register('attestation_of_reserve', {
                  required: true,
                })}
              />
            </FormControl>

            <Checkbox fontSize="xs" me="1rem" mt="1.5rem">
              Is anchored?
            </Checkbox>

            <FormControl mt="1.5rem">
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Anchor asset type</FormLabel>
              </Flex>
              <Input
                placeholder="URL"
                autoComplete="off"
                {...register('anchor_asset_type', {
                  required: true,
                })}
              />
            </FormControl>

            <FormControl mt="1.5rem">
              <Flex justifyContent="space-between" w="full" px="0.25rem">
                <FormLabel>Anchor asset</FormLabel>
              </Flex>
              <Input
                placeholder="Asset code"
                autoComplete="off"
                {...register('anchor_asset', {
                  required: true,
                })}
              />
            </FormControl>

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
