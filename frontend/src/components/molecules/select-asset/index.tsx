import { useColorMode } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
}) => {
  const { colorMode } = useColorMode()
  const [options, setOptions] = useState<IOption[]>([])

  useEffect(() => {
    const ops = assets?.map((asset: Hooks.UseAssetsTypes.IAssetDto) =>
      createOption(asset.code, asset)
    )
    setOptions(ops || [])
  }, [assets])

  return (
    <Select
      options={options}
      onChange={(newValue): void => {
        setAsset(newValue?.value), setSelected && setSelected(newValue)
      }}
      value={selected}
      placeholder="Select asset"
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
