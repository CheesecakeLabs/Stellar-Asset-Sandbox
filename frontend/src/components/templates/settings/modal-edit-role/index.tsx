import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

import { Loading } from 'components/atoms'

interface IModalReject {
  isOpen: boolean
  onClose(): void
  loading: boolean
  loadingRoles: boolean
  user: Hooks.UseAuthTypes.IUserDto
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): void
  roles: Hooks.UseAuthTypes.IRole[] | undefined
}

export const ModalEditRole: React.FC<IModalReject> = ({
  isOpen,
  onClose,
  loading,
  loadingRoles,
  user,
  handleEditRole,
  roles,
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
      await handleEditRole({
        id_user: user.id,
        id_role: data.role_id,
      })
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
        <ModalHeader>Edit role</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loadingRoles ? (
            <Loading />
          ) : (
            <Box>
              {errorSubmit && (
                <Alert mb="0.75rem" status="error">
                  <AlertIcon />
                  {errorSubmit}
                </Alert>
              )}
              <Text>{user.name}</Text>
              <form
                onSubmit={handleSubmit(data => {
                  onSubmit(data)
                })}
              >
                {roles && (
                  <FormControl isInvalid={errors?.role_id !== undefined}>
                    <FormLabel mt="1.5rem">Role</FormLabel>
                    <Select
                      placeholder="Select role"
                      {...register('role_id', { required: true })}
                      defaultValue={user.role_id}
                    >
                      {roles.map(role => (
                        <option value={role.id}>{role.name}</option>
                      ))}
                    </Select>
                    <FormErrorMessage>Inform the role</FormErrorMessage>
                  </FormControl>
                )}

                <Button
                  w="full"
                  mb="1.5rem"
                  type="submit"
                  variant="primary"
                  mt="1.5rem"
                  isLoading={loading}
                >
                  Edit role
                </Button>
              </form>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
