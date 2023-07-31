import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ProfileTemplate } from 'components/templates/profile'

export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const {
    signOut,
    editProfile,
    getProfile,
    getRoles,
    loading,
    roles,
    profile,
    loadingRoles,
  } = useAuth()

  const handleSignOut = async (): Promise<void> => {
    const isSuccess = await signOut()
    if (isSuccess) {
      navigate('/login')
    }
  }

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
      <Sidebar highlightMenu={PathRoute.PROFILE}>
        <ProfileTemplate
          handleSignOut={handleSignOut}
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
