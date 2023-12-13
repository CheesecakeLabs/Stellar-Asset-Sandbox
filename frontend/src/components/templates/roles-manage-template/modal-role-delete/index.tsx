import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
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
import { useForm } from 'react-hook-form'

import { Loading } from 'components/atoms'

interface IModalRoleDelete {
  isOpen: boolean
  loading: boolean
  loadingRoles: boolean
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  role: Hooks.UseAuthTypes.IRole
  onClose(): void
  handleDeleteRole(id: number, idNewUsersRole: number): Promise<boolean>
}

export const ModalRoleDelete: React.FC<IModalRoleDelete> = ({
  isOpen,
  loading,
  loadingRoles,
  roles,
  role,
  onClose,
  handleDeleteRole,
}) => {
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null)
  const [roleSelected, setRoleSelected] = useState<number>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (): Promise<void> => {
    if (!roleSelected) return
    setErrorSubmit(null)

    try {
      const isSuccess = await handleDeleteRole(role.id, roleSelected)

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
        <ModalHeader>Delete role</ModalHeader>
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
              <Container variant="secondary">
                <Text fontSize="sm" fontWeight="700">
                  {role.name}
                </Text>
              </Container>
              <form
                onSubmit={handleSubmit(() => {
                  onSubmit()
                })}
              >
                {roles && (
                  <FormControl isInvalid={errors?.role_id !== undefined}>
                    <FormLabel mt="1.5rem">
                      Select new role to replace users with current role
                    </FormLabel>
                    <Select
                      placeholder="Select role"
                      {...register('role_id', { required: true })}
                      onChange={(event): void => {
                        setRoleSelected(Number(event.target.value))
                      }}
                    >
                      {roles
                        .filter(filterRole => filterRole.id !== role.id)
                        .map((role, index) => (
                          <option value={role.id} key={index}>
                            {role.name}
                          </option>
                        ))}
                    </Select>
                    <FormErrorMessage>
                      Select new role to replace users with current role
                    </FormErrorMessage>
                  </FormControl>
                )}

                <Button
                  w="full"
                  mb="1.5rem"
                  type="submit"
                  variant="primary"
                  bg="red.500"
                  mt="2rem"
                  isDisabled={!roleSelected}
                  isLoading={loading}
                >
                  Delete role
                </Button>
              </form>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
