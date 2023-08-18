import { Flex, Switch, Text } from '@chakra-ui/react'
import { FieldValues } from 'react-hook-form'
import { UseFormRegister } from 'react-hook-form/dist/types/form'

interface IRadioCard {
  register: UseFormRegister<FieldValues>
  title: string
  description: string
  value: string
}

export const RadioCard: React.FC<IRadioCard> = ({
  title,
  description,
  register,
  value,
}) => {
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
      <Text
        fontSize="sm"
        minW="6rem"
        textAlign="center"
        borderEnd="1px solid"
        borderColor={'gray.600'}
      >
        {title}
      </Text>
      <Text fontSize="sm">{description}</Text>
      <Switch
        {...register('control_mechanisms[]')}
        name={'control_mechanisms[]'}
        value={value}
      />
    </Flex>
  )
}
