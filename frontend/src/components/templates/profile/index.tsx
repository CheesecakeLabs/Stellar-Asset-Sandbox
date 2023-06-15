import {
  Button,
  Container,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'

import { Loading } from 'components/atoms'
import { EditIcon } from 'components/icons'
import { ModalEditRole } from 'components/molecules'

interface IProfileTemplate {
  handleSignOut(): Promise<void>
  loading: boolean
  profile: Hooks.UseAuthTypes.IUserDto | undefined
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const ProfileTemplate: React.FC<IProfileTemplate> = ({
  handleSignOut,
  loading,
  profile,
  handleEditRole,
  loadingRoles,
  roles,
}) => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {profile && (
        <ModalEditRole
          isOpen={isOpen}
          onClose={onClose}
          loading={loading}
          loadingRoles={loadingRoles}
          user={profile}
          handleEditRole={handleEditRole}
          roles={roles}
        />
      )}
      <Flex flexDir="column" w="full">
        <Flex maxW="584px" alignSelf="center" flexDir="column" w="full">
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Profile
          </Text>
          <Container variant="primary">
            {loading && !profile ? (
              <Loading />
            ) : (
              <>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text fontSize="sm" w="50%">
                    Name
                  </Text>
                  <Text fontSize="sm" fontWeight="400">
                    {profile?.name}
                  </Text>
                </Flex>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text fontSize="sm" w="50%">
                    Email
                  </Text>
                  <Text fontSize="sm" fontWeight="400">
                    {profile?.email}
                  </Text>
                </Flex>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text fontSize="sm" w="50%">
                    Role
                  </Text>
                  <Flex
                    justifyContent="space-between"
                    w="50%"
                    alignItems="center"
                  >
                    <Text fontSize="sm" fontWeight="400">
                      {profile?.role}
                    </Text>
                    <IconButton
                      variant="icon"
                      icon={<EditIcon />}
                      aria-label={'Edit'}
                      onClick={onOpen}
                    />
                  </Flex>
                </Flex>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text fontSize="sm" w="50%">
                    Sign out of account
                  </Text>
                  <Button
                    variant="primary"
                    w="max-content"
                    onClick={handleSignOut}
                  >
                    Log out
                  </Button>
                </Flex>
              </>
            )}
          </Container>
        </Flex>
      </Flex>
    </>
  )
}
