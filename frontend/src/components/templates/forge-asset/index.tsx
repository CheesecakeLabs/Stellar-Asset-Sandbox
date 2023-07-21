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
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldValues, UseFormSetValue, useForm } from 'react-hook-form'

import { assetFlags, typesAsset } from 'utils/constants/data-constants'

import { RadioCard } from 'components/atoms'

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
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
        <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
          Forge asset
        </Text>
        {errorSubmit && (
          <Alert mb="0.75rem" status="error">
            <AlertIcon />
            {errorSubmit}
          </Alert>
        )}
        <Container variant="primary" justifyContent="center" p="2rem">
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
                    type="number"
                    placeholder="Initial supply"
                    {...register('initial_supply', {
                      required: false,
                      minLength: 3,
                      maxLength: 922337203685,
                    })}
                />
              </FormControl>
            </Flex>

            <Flex
              flexDir={{ md: 'row', sm: 'column' }}
              gap="1.5rem"
              mt="1.5rem"
              >
              <FormControl>
                <FormLabel>Limit</FormLabel>
                <Input
                    type="number"
                    placeholder="Limit"
                    {...register('limit', {
                      required: false,
                      minLength: 3,
                      maxLength: 3,
                    })}
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
                      />
                  // return {...register(assetFlag.name)}

                    // <RadioCard
                    //   name={assetFlag.name}
                    //   isChecked={assetFlag.isChecked}
                    //   title={assetFlag.title}
                    //   description={assetFlag.description}
                    //   />
                // )
                ))}
              </Flex>
            </FormControl>

            <Button
              type="submit"
              variant="primary"
              mt="1.5rem"
              isLoading={loading}
              >
              Forge asset
            </Button>
          </form>
        </Container>
      </Flex>
    </Flex>
  )
}
