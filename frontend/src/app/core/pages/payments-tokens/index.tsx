import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { useAuth } from 'hooks/useAuth'

import { PaymentsTokensTemplate } from '../../../../components/templates/payments-tokens'
import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'

export const PaymentsTokens: React.FC = () => {
  const {
    editProfile,
    getProfile,
    getRoles,
    loading,
    roles,
    profile,
    loadingRoles,
  } = useAuth()

  const handleEditRole = async (
    params: Hooks.UseAuthTypes.IUserRole
  ): Promise<boolean> => {
    const isEdited = await editProfile(params)

    if (isEdited) {
      getProfile()
      return true
    }
    return false
  }

  useEffect(() => {
    getProfile()
    getRoles()
  }, [getProfile, getRoles])

  return (
    <Flex>
      <Sidebar highlightMenu={PathRoute.HOME}>
        <PaymentsTokensTemplate
          loading={loading}
          profile={profile}
          handleEditRole={handleEditRole}
          roles={roles}
          loadingRoles={loadingRoles}
        />
      </Sidebar>
    </Flex>
  )
}
