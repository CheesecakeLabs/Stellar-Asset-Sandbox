import { Container, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

import { Loading } from 'components/atoms'
import { ModalEditRole } from 'components/molecules'

interface IProfileTemplate {
  handleSignOut(): Promise<void>
  loading: boolean
  profile: Hooks.UseAuthTypes.IUserDto | undefined
  handleEditRole(params: Hooks.UseAuthTypes.IUserRole): Promise<boolean>
  roles: Hooks.UseAuthTypes.IRole[] | undefined
  loadingRoles: boolean
}

export const PaymentsTokensTemplate: React.FC<IProfileTemplate> = ({
  loading,
  profile,
  handleEditRole,
  loadingRoles,
  roles,
}) => {
  const { isOpen, onClose } = useDisclosure()

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
            Payments Tokens
          </Text>
          <Container variant="primary">
            {loading && !profile ? <Loading /> : <></>}
          </Container>
        </Flex>
      </Flex>
    </>
  )
}
