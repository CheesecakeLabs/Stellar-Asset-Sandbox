import { Button, Container, Text } from '@chakra-ui/react'
import React from 'react'

import { KeyIcon } from 'components/icons'

interface IAccountCard {
  account: string
  onClick(): void
}

export const AccountCard: React.FC<IAccountCard> = ({ account, onClick }) => {
  const formatAccount = (account: string): string => {
    return `${account.substring(0, 4)}...${account.substring(
      account.length - 4,
      account.length
    )}`
  }

  return (
    <Container
      variant="primary"
      w="fit-content"
      mb="1rem"
      p="0"
      display="flex"
      flexDir="row"
      alignItems="center"
    >
      <Text fontSize="sm" mx="1rem">
        {account ? formatAccount(account) : '-'}
      </Text>
      <Button variant="primary" onClick={onClick} m="0">
        <KeyIcon />
      </Button>
    </Container>
  )
}
