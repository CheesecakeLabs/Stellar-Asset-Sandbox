import { useColorMode } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'

import { IOption } from '../..'

interface ISelectAnchorType {
  anchorTypes: string[]
  currentType: string | undefined
  setValue: UseFormSetValue<FieldValues>
}

const createOption = (label: string, value: string): IOption => ({
  label,
  value: value,
})

export const SelectAnchorType: React.FC<ISelectAnchorType> = ({
  anchorTypes,
  currentType,
  setValue,
}) => {
  const [options, setOptions] = useState<IOption[]>([])
  const { colorMode } = useColorMode()

  useEffect(() => {
    let ops = anchorTypes.map((type: string) => createOption(type, type))
    if (currentType) {
      ops = [...ops, createOption(currentType, currentType)]
    }
    setOptions(ops || [])
  }, [anchorTypes, currentType])

  return (
    <CreatableSelect
      isClearable
      options={options}
      defaultValue={
        currentType ? { value: currentType, label: currentType } : undefined
      }
      onChange={(newValue): void =>
        setValue('anchor_asset_type', newValue?.value)
      }
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
