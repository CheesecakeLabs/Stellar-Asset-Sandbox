import { Flex, Switch, Text, Tag } from '@chakra-ui/react'
import { FieldValues } from 'react-hook-form'
import { UseFormRegister } from 'react-hook-form/dist/types/form'

interface IRadioCard {
  register: UseFormRegister<FieldValues>
  title: string
  description: string
  value: string
  isDisabled: boolean
  link: string | undefined
  isComing: boolean | undefined
}

export const RadioCard: React.FC<IRadioCard> = ({
  title,
  description,
  register,
  value,
  isDisabled,
  link,
  isComing,
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
      <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }}>
        <Flex flexDir="column" justifyContent="center">
          {isComing && (
            <Tag
              fontSize="xs"
              py={0}
              px="0.5rem"
              w="fit-content"
              variant="blue_sky"
              bg="gray.400"
              color="black.900"
              mb="0.25rem"
            >
              Coming soon
            </Tag>
          )}
          <Text
            fontSize="sm"
            minW="6rem"
            textAlign="center"
            borderEnd="1px solid"
            borderColor={'gray.600'}
          >
            {title}
          </Text>
        </Flex>
        <Text fontSize="sm">
          {description}{' '}
          {link && (
            <a href={link} target="_blank">
              official SEP: 08 document.
            </a>
          )}
        </Text>
      </Flex>
      <Switch
        {...register('control_mechanisms[]')}
        name={'control_mechanisms[]'}
        value={value}
        isDisabled={isDisabled}
      />
    </Flex>
  )
}
