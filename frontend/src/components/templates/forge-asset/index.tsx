import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import { assetFlags, typesAsset } from 'utils/constants/data-constants'
import { TooltipsData } from 'utils/constants/tooltips-data'
import { toNumber } from 'utils/formatter'

import { RadioCard } from 'components/atoms'
import { HelpIcon } from 'components/icons'

interface IForgeAssetTemplate {
  onSubmit(
    data: FieldValues,
    setValue: UseFormSetValue<FieldValues>
  ): Promise<void>
  loading: boolean
}

export const ForgeAssetTemplate: React.FC<IForgeAssetTemplate> = ({
  onSubmit,
  loading,
}) => {
  const [errorSubmit] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="920px" alignSelf="center" flexDir="column" w="full">
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
          Forge Asset
        </Text>
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
        <Container
          variant="primary"
          justifyContent="center"
          p="2rem"
          w="full"
          maxW="full"
        >
          <form
            onSubmit={handleSubmit(data => {
              onSubmit(data, setValue)
            })}
          >
            <FormControl isInvalid={errors?.name !== undefined}>
              <FormLabel>Asset name</FormLabel>
              <Input
                type="text"
                placeholder="Asset name"
                autoComplete="off"
                {...register('name', {
                  required: true,
                  minLength: 3,
                })}
              />
              <FormErrorMessage>
                Name must be more than 2 characters
              </FormErrorMessage>
            </FormControl>

            <Flex
              flexDir={{ md: 'row', sm: 'column' }}
              gap="1.5rem"
              mt="1.5rem"
            >
              <FormControl isInvalid={errors?.code !== undefined}>
                <FormLabel>Code</FormLabel>
                <Input
                  type="text"
                  placeholder="Code"
                  autoComplete="off"
                  {...register('code', {
                    required: true,
                    minLength: 3,
                    maxLength: 12,
                  })}
                />
                <FormErrorMessage>Code must be 3 characters</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Initial supply</FormLabel>
                <Input
                  as={NumericFormat}
                  decimalScale={7}
                  thousandSeparator=","
                  placeholder="Initial supply"
                  autoComplete="off"
                  value={getValues('initial_supply')}
                  onChange={(event): void => {
                    setValue('initial_supply', toNumber(event.target.value))
                  }}
                />
              </FormControl>
            </Flex>

            <Flex
              flexDir={{ md: 'row', sm: 'column' }}
              gap="1.5rem"
              mt="1.5rem"
            >
              <FormControl>
                <FormLabel>
                  <Flex gap={1} alignItems="center">
                    {`Limit (optional)`}
                    <Tooltip label={TooltipsData.limit}>
                      <HelpIcon width="20px" />
                    </Tooltip>
                  </Flex>
                </FormLabel>
                <Input
                  as={NumericFormat}
                  decimalScale={7}
                  thousandSeparator=","
                  placeholder="Limit"
                  autoComplete="off"
                  value={getValues('initilimital_supply')}
                  onChange={(event): void => {
                    setValue('limit', toNumber(event.target.value))
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Asset type</FormLabel>
                <Select
                  {...register('asset_type', { required: true })}
                  defaultValue={typesAsset[0].id}
                >
                  {typesAsset.map(typeAsset => (
                    <option value={typeAsset.id}>{typeAsset.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel mt="1.5rem">Control mechanisms</FormLabel>
              <Flex flexDir="column">
                {assetFlags.map(assetFlag => (
                  <RadioCard
                    register={register}
                    title={assetFlag.title}
                    description={assetFlag.description}
                    value={assetFlag.flag}
                    isDisabled={assetFlag.isDisabled}
                    link={assetFlag.link}
                    isComing={assetFlag.isComing}
                  />
                ))}
              </Flex>
            </FormControl>

            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={loading}
              >
                Forge asset
              </Button>
            </Flex>
          </form>
        </Container>
      </Flex>
    </Flex>
  )
}
