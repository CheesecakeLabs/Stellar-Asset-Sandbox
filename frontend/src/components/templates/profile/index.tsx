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

import { havePermission } from 'utils'
import { MAX_PAGE_WIDTH } from 'utils/constants/sizes'

import { Loading } from 'components/atoms'
import { Permissions } from 'components/enums/permissions'
import { EditIcon } from 'components/icons'
import { ModalEditRole } from 'components/molecules'

interface IProfileTemplate {
  handleSignOut(): Promise<void>
  handleCreateVault(): Promise<void>
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  loading: boolean
  creatingVault: boolean
  profile: Hooks.UseAuthTypes.IUserDto | undefined
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
  userPermissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
}

export const ProfileTemplate: React.FC<IProfileTemplate> = ({
  handleSignOut,
  handleEditRole,
  handleCreateVault,
  loading,
  profile,
  loadingRoles,
  creatingVault,
  roles,
  userPermissions,
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
        <Flex
          maxW={MAX_PAGE_WIDTH}
          alignSelf="center"
          flexDir="column"
          w="full"
        >
          <Text fontSize="2xl" fontWeight="400" mb="1.5rem">
            Profile
          </Text>
          <Container variant="primary" maxW="full">
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
                  <Text w="50%">Name</Text>
                  <Text fontWeight="400">{profile?.name}</Text>
                </Flex>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text w="50%">Email</Text>
                  <Text fontWeight="400">{profile?.email}</Text>
                </Flex>
                <Flex
                  borderBottom="1px solid"
                  borderColor={colorMode == 'light' ? 'gray.400' : 'black.800'}
                  py="1rem"
                  alignItems="center"
                >
                  <Text w="50%">Role</Text>
                  <Flex
                    justifyContent="space-between"
                    w="50%"
                    alignItems="center"
                  >
                    <Text fontWeight="400">{profile?.role}</Text>
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
                  <Text w="50%">My wallet</Text>
                  {(havePermission(
                    Permissions.CREATE_WALLET,
                    userPermissions
                  ) ||
                    profile?.vault_id) && (
                    <Button
                      variant="primary"
                      w="max-content"
                      onClick={handleCreateVault}
                      isLoading={creatingVault}
                    >
                      {profile?.vault_id
                        ? 'Access my wallet'
                        : 'Create my wallet'}
                    </Button>
                  )}
                </Flex>
                <Flex pt="1rem" alignItems="center">
                  <Text w="50%">Sign out of account</Text>
                  <Button
                    variant="secondary"
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
