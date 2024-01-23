import { Flex } from '@chakra-ui/react'

interface IItemFilter {
  title: string
}

export const ItemFilter: React.FC<IItemFilter> = ({ title }) => {
  return (
    <Flex
      bg="purple.500"
      borderRadius="full"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={1}
      fontSize="xs"
      color="white"
      fontWeight="bold"
      height="fit-content"
      mx="0.15rem"
      cursor="pointer"
    >
      {title}
    </Flex>
  )
}
