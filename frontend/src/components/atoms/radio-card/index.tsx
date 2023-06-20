import { Box, useRadio } from '@chakra-ui/react'

interface IRadioCard {
  title: string
}

export const RadioCard: React.FC<IRadioCard> = ({ title }) => {
  const { getInputProps, getRadioProps } = useRadio()

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="0.25rem"
        fontSize="sm"
        _checked={{
          bg: 'primary.normal',
          color: 'white',
        }}
        px={5}
        py={1}
      >
        {title}
      </Box>
    </Box>
  )
}
