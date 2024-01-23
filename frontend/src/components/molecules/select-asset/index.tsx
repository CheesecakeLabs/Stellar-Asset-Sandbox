import { Flex, Text, useColorMode } from '@chakra-ui/react'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: Hooks.UseAssetsTypes.IAssetDto
}

interface ISelectAsset {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  selected?: IOption | null
  setAsset: Dispatch<SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>>
  setSelected?: Dispatch<SetStateAction<IOption | undefined | null>>
  clearErrors?(): void
}

const createOption = (
  label: string,
  value: Hooks.UseAssetsTypes.IAssetDto
): IOption => ({
  label,
  value: value,
})

export const SelectAsset: React.FC<ISelectAsset> = ({
  assets,
  selected,
  setAsset,
  setSelected,
  clearErrors,
}) => {
  const { colorMode } = useColorMode()
  const [options, setOptions] = useState<IOption[]>([])

  useEffect(() => {
    const ops = assets?.map((asset: Hooks.UseAssetsTypes.IAssetDto) =>
      createOption(asset.code, asset)
    )
    setOptions(ops || [])
  }, [assets])

  const formatLabel = (data: IOption): ReactNode => (
    <Flex alignItems="center" gap="0.75rem">
      <Text fontSize="xs" minW="3rem">
        {data.label}
      </Text>
      <Text fontSize="sm">{data.value.name}</Text>
    </Flex>
  )

  return (
    <Select
      options={options}
      onChange={(newValue): void => {
        if (clearErrors) clearErrors()
        setAsset(newValue?.value), setSelected && setSelected(newValue)
      }}
      value={selected}
      placeholder="Select..."
      formatOptionLabel={formatLabel}
      styles={{
        control: baseStyles => ({
          ...baseStyles,
          borderColor: 'gray.400',
          fontSize: '14px',
          backgroundColor: 'none',
          color: colorMode === 'dark' ? 'white' : 'black',
        }),
        menuList: base => ({
          ...base,
          backgroundColor: colorMode === 'dark' ? '#303448' : undefined,
        }),
        option: (styles, { isFocused, isSelected }) => ({
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
        singleValue: provided => ({
          ...provided,
          color: colorMode === 'dark' ? 'white' : 'black',
        }),
      }}
    />
  )
}
