import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

interface IModalRoleManage {
  isOpen: boolean
  loading: boolean
  role?: Hooks.UseAuthTypes.IRole
  isUpdate: boolean
  onClose(): void
  handleRole(name: string, id?: number): Promise<boolean>
}

export const ModalRoleManage: React.FC<IModalRoleManage> = ({
  isOpen,
  loading,
  role,
  isUpdate,
  onClose,
  handleRole,
}) => {
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: FieldValues): Promise<void> => {
    setErrorSubmit(null)

    try {
      const isSuccess = await handleRole(data.name, role?.id)

      if (isSuccess) {
        onClose()
      }
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      setErrorSubmit(message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isUpdate ? 'Rename role' : 'Create role'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {errorSubmit && (
              <Alert mb="0.75rem" status="error">
                <AlertIcon />
                {errorSubmit}
              </Alert>
            )}
            {isUpdate && role && (
              <Container variant="secondary">
                <Text fontSize="sm" fontWeight="700">
                  {role.name}
                </Text>
              </Container>
            )}
            <form
              onSubmit={handleSubmit(data => {
                onSubmit(data)
              })}
            >
              <FormControl isInvalid={errors?.name !== undefined}>
                <FormLabel mt="1.5rem">Role</FormLabel>
                <Input
                  placeholder="Role name"
                  {...register('name', { required: true })}
                  defaultValue={role?.name}
                />
                <FormErrorMessage>This field is required</FormErrorMessage>
              </FormControl>
              <Button
                w="full"
                mb="1.5rem"
                type="submit"
                variant="primary"
                mt="2rem"
                isLoading={loading}
              >
                {isUpdate ? 'Update role' : 'Create role'}
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
