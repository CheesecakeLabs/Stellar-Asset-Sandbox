import { Flex, Text } from '@chakra-ui/react'

import { InfoIcon } from 'components/icons'

interface IInfoTag {
  text: string
}

export const InfoTag: React.FC<IInfoTag> = ({ text }) => {
  return (
    <Flex
      bg="gray.100"
      py={1}
      px={2}
      w="fit-content"
      borderRadius={6}
      _dark={{ bg: 'black.800' }}
      gap={2}
      alignItems="center"
    >
      <InfoIcon width="16px" height="16px" />
      <Text color="gray.900" fontWeight="bold" fontSize="xs">
        {text}
      </Text>
    </Flex>
  )
}
