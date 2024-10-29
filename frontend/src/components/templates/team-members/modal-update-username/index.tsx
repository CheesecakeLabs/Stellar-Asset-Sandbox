import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { GAService } from 'utils/ga'

interface IModalUpdateUsername {
  isOpen: boolean
  user: Hooks.UseAuthTypes.IUserDto
  updatingUsername: boolean
  onClose(): void
  handleUpdateUsername(id: number, name: string): Promise<boolean>
}

export const ModalUpdateUsername: React.FC<IModalUpdateUsername> = ({
  isOpen,
  user,
  updatingUsername,
  onClose,
  handleUpdateUsername,
}) => {
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null)
  const [username, setUsername] = useState(user.name)
  const { handleSubmit } = useForm()

  const onSubmit = async (): Promise<void> => {
    setErrorSubmit(null)
    try {
      const isSuccess = await handleUpdateUsername(user.id, username)

      if (isSuccess) {
        GAService.GAEvent('username_updated')
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
        <ModalHeader>Edit username</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {errorSubmit && (
              <Alert mb="0.75rem" status="error">
                <AlertIcon />
                {errorSubmit}
              </Alert>
            )}
            <form
              onSubmit={handleSubmit(() => {
                onSubmit()
              })}
            >
              <Input
                placeholder="Name"
                autoComplete="off"
                defaultValue={username}
                onChange={(event): void => {
                  setUsername(event.target.value)
                }}
                w="full"
              />
              <Button
                w="full"
                mb="1.5rem"
                type="submit"
                variant="primary"
                mt="1.5rem"
                isLoading={updatingUsername}
              >
                Save
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
