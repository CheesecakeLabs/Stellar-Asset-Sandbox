import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface IMintAssetTemplate {
  asset: Hooks.UseAssetsTypes.IAsset
}

export const MintAssetTemplate: React.FC<IMintAssetTemplate> = ({ asset }) => {
  const [errorSubmit] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
  } = useForm()

  return (
    <Flex flexDir="column" w="full">
      {errorSubmit && (
        <Alert mb="0.75rem" status="error">
          <AlertIcon />
          {errorSubmit}
        </Alert>
      )}
      <Container variant="primary" justifyContent="center" p="2rem">
        <form>
          <FormControl isInvalid={errors?.name !== undefined}>
            <FormLabel>Name</FormLabel>
            <Input
              type="number"
              placeholder="Amount"
              {...register('amount', {
                required: true,
              })}
            />
          </FormControl>

          <Button type="submit" variant="primary" mt="1.5rem">
            Mint
          </Button>
        </form>
      </Container>
    </Flex>
  )
}
