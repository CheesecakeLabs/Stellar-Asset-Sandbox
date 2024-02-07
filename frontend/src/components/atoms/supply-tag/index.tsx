import { Flex, Text } from '@chakra-ui/react'

import { WalletIcon } from 'components/icons'

interface ISupplyTag {
  value: string
}

export const SupplyTag: React.FC<ISupplyTag> = ({ value }) => {
  return (
    <Flex
      mt="0.5rem"
      bg="gray.100"
      py={1}
      px={2}
      w="fit-content"
      borderRadius={6}
      _dark={{ bg: 'black.800' }}
      gap={2}
      alignItems="center"
    >
      <WalletIcon fill="gray" width="16px" height="16px" />
      <Text color="gray.900" fontWeight="bold" fontSize="xs">
        {value}
      </Text>
    </Flex>
  )
}
