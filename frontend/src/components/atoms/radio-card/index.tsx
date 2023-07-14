import { Flex, Switch, Text } from '@chakra-ui/react'

interface IRadioCard {
  title: string
  description: string
  isChecked: boolean
}

export const RadioCard: React.FC<IRadioCard> = ({ title, description }) => {
  return (
    <Flex
      gap="1rem"
      justifyContent="space-between"
      pb="1rem"
      my="0.5rem"
      borderBottom="1px solid"
      borderColor={'gray.600'}
      _dark={{ borderColor: 'black.800' }}
      alignItems="center"
    >
      <Text fontSize="sm" minW="5rem" textAlign="center">
        {title}
      </Text>
      <Text fontSize="xs" color="gray.650">
        {description}
      </Text>
      <Switch />

    </Flex>
  )
}
