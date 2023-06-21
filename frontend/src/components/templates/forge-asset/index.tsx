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
import { useForm } from 'react-hook-form'

import { assetFlags, typesAsset } from 'utils/constants/data-constants'

import { RadioCard } from 'components/atoms'

export const ForgeAssetTemplate: React.FC = () => {
  const [errorSubmit] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
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
          <form>
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
                    maxLength: 3,
                  })}
                />
                <FormErrorMessage>Code must be 3 characters</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Initial supply</FormLabel>
                <Input type="number" placeholder="Initial supply" />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel mt="1.5rem">Asset type</FormLabel>
              <Select
                {...register('asset_type', { required: true })}
                defaultValue={typesAsset[0].id}
              >
                {typesAsset.map(typeAsset => (
                  <option value={typeAsset.id}>{typeAsset.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isInvalid={errors?.password !== undefined}>
              <FormLabel mt="1.5rem">Control mechanisms</FormLabel>
              <Flex flexDir="column">
                {assetFlags.map(assetFlag => {
                  return (
                    <RadioCard
                      title={assetFlag.title}
                      description={assetFlag.description}
                    />
                  )
                })}
              </Flex>
            </FormControl>

            <Button type="submit" variant="primary" mt="1.5rem">
              Forge asset
            </Button>
          </form>
        </Container>
      </Flex>
    </Flex>
  )
}
