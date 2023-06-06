import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'

import { Overview } from './components/overview'
import { SignIn } from './components/sign-in'
import { SignUp } from './components/sign-up'

export const LoginTemplate: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <Flex>
      <Overview />
      {isSignIn ? (
        <SignIn setIsSignIn={setIsSignIn} />
      ) : (
        <SignUp setIsSignIn={setIsSignIn} />
      )}
    </Flex>
  )
}
