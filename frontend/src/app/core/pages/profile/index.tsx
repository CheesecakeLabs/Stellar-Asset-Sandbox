import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

import { PathRoute } from 'components/enums/path-route'
import { Sidebar } from 'components/organisms/sidebar'
import { ProfileTemplate } from 'components/templates/profile'

export const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { signOut, loading } = useAuth()

  const handleSignOut = async (): Promise<void> => {
    const isSuccess = await signOut()
    if (isSuccess) {
      navigate(PathRoute.LOGIN)
    }
  }

  return (
    <Flex>
      <Sidebar>
        <ProfileTemplate handleSignOut={handleSignOut} loading={loading} />
      </Sidebar>
    </Flex>
  )
}
