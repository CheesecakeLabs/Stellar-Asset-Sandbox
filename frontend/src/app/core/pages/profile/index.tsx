import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'
import { useVaults } from 'hooks/useVaults'
import { formatVaultName } from 'utils/formatter'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ProfileTemplate } from 'components/templates/profile'

export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { userPermissions, getUserPermissions } = useAuth()
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

  const { creatingVault, createVault } = useVaults()

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  const handleSignOut = async (): Promise<void> => {
    const isSuccess = await signOut()
    if (isSuccess) {
      navigate('/login')
    }
  }

  const handleCreateVault = async (): Promise<void> => {
    if (profile?.vault_id) {
      navigate(`${PathRoute.VAULT_DETAIL}/${profile.vault_id}`)
      return
    }
    const vault = {
      name: formatVaultName(profile?.name || ''),
      assets_id: [],
      owner_id: Number(profile?.id),
    }

    const vaultCreated = await createVault(vault)
    if (vaultCreated) {
      navigate(`${PathRoute.VAULT_DETAIL}/${vaultCreated.id}`)
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
          loading={loading}
          profile={profile}
          roles={roles}
          loadingRoles={loadingRoles}
          creatingVault={creatingVault}
          userPermissions={userPermissions}
          handleSignOut={handleSignOut}
          handleEditRole={handleEditRole}
          handleCreateVault={handleCreateVault}
        />
      </Sidebar>
    </Flex>
  )
}
