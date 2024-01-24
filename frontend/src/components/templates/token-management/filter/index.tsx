import {
  Box,
  Container,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  useColorMode,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import Select, { CSSObjectWithLabel, OptionProps } from 'react-select'

import { SearchIcon } from 'components/icons'

import { IOptionFilter } from 'app/core/pages/token-management'

interface IFilter {
  setTextSearch: Dispatch<SetStateAction<string | undefined>>
  setFilterByAssetFlag: Dispatch<SetStateAction<IOptionFilter[]>>
  setFilterByAssetType: Dispatch<SetStateAction<IOptionFilter | undefined>>
}

export const Filter: React.FC<IFilter> = ({
  setTextSearch,
  setFilterByAssetFlag,
  setFilterByAssetType,
}) => {
  const { colorMode } = useColorMode()

  const createOption = (label: string, value: string): IOptionFilter => ({
    label,
    value: value,
  })

  const styleSelect = {
    control: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      borderColor: 'gray.400',
      fontSize: '14px',
      backgroundColor: 'none',
      color: colorMode === 'dark' ? 'white' : 'black',
    }),
    menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: colorMode === 'dark' ? '#303448' : undefined,
    }),
    option: (
      styles: CSSObjectWithLabel,
      { isFocused, isSelected }: OptionProps
    ) => ({
      ...styles,
      color: colorMode === 'dark' ? 'white' : 'black',
      background: isFocused
        ? colorMode === 'dark'
          ? '#292d3e'
          : undefined
        : isSelected
        ? colorMode === 'dark'
          ? '#292d3e'
          : undefined
        : undefined,
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: colorMode === 'dark' ? 'white' : 'black',
    }),
  }

  return (
    <Container variant="primary" p={1} maxW="full" mb={2}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDir={{ base: 'column-reverse', md: 'row' }}
      >
        <Flex gap={3} mt={{ base: '0.5rem', md: '0' }}>
          <Box minW={{ base: undefined, md: '12rem' }}>
            <Select
              isMulti
              name="flag"
              placeholder="Filter control"
              options={[
                createOption('Authorize', 'AUTHORIZE_REQUIRED'),
                createOption('Freeze', 'FREEZE_ENABLED'),
                createOption('Clawback', 'CLAWBACK_ENABLED'),
              ]}
              onChange={(values): void => {
                setFilterByAssetFlag(values as IOptionFilter[])
              }}
              styles={styleSelect}
            />
          </Box>

          <Box minW={{ base: undefined, md: '12rem' }}>
            <Select
              name="type"
              placeholder="Filter type"
              isClearable
              options={[
                createOption('Security', 'SECURITY_TOKEN'),
                createOption('Payment', 'PAYMENT_TOKEN'),
                createOption('Utility', 'UTILITY_TOKEN'),
              ]}
              styles={styleSelect}
              onChange={(value): void => {
                setFilterByAssetType(value as IOptionFilter)
              }}
            />
          </Box>
        </Flex>
        <InputGroup w="fit-content">
          <Input
            type="search"
            placeholder="Search"
            bg="gray.100"
            _dark={{ bg: 'black.800', color: 'white' }}
            w="20rem"
            border="none"
            onChange={(e): void => {
              setTextSearch(e.target.value)
            }}
          />
          <InputRightAddon children={<SearchIcon />} />
        </InputGroup>
      </Flex>
    </Container>
  )
}
