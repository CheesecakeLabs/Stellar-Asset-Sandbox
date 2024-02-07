import { Flex, Switch, Text, Tag } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

import { AUTH_CLAWBACK_ENABLED, AUTH_REVOCABLE_FLAG } from 'utils/constants/data-constants'

interface IRadioCard {
  setFlags: Dispatch<SetStateAction<string[]>>
  title: string
  description: string
  value: string
  isDisabled: boolean
  link: string | undefined
  isComing: boolean | undefined
  flags: string[]
}

export const RadioCard: React.FC<IRadioCard> = ({
  title,
  description,
  setFlags,
  value,
  isDisabled,
  link,
  isComing,
  flags
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
        onChange={(event): void => {
          if (event.target.checked) {
            if (event.target.value === AUTH_CLAWBACK_ENABLED) {
              setFlags(flags => {
                if(flags.includes(AUTH_REVOCABLE_FLAG)){
                  return [...flags, event.target.value]
                }
                return [...flags, event.target.value, AUTH_REVOCABLE_FLAG]
              })
            } else {
              setFlags(flags => [...flags, event.target.value])
            }
          } else {
            setFlags(flags => flags.filter(flag => flag !== event.target.value))
          }
        }}
        isChecked={flags.includes(value)}
        name={'control_mechanisms[]'}
        value={value}
        isDisabled={isDisabled}
      />
    </Flex>
  )
}
