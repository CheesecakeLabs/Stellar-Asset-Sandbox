import { useColorMode } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'

import { IOption } from '..'

interface ISelectCategory {
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  setCategorySelected: Dispatch<SetStateAction<IOption | null | undefined>>
  categorySelected?: IOption | null | undefined
  clearErrors?(): void
}

const createOption = (
  label: string,
  value: number,
  disabled?: boolean
): IOption => ({
  label,
  value: value,
  disabled: disabled ?? false,
})

export const SelectCategory: React.FC<ISelectCategory> = ({
  vaultCategories,
  createVaultCategory,
  setCategorySelected,
  categorySelected,
  clearErrors,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<IOption[]>([])
  const [value, setValue] = useState<IOption>()

  const { colorMode } = useColorMode()

  const handleVaultCategory = (inputValue: string): void => {
    setIsLoading(true)
    setTimeout(async () => {
      try {
        const vaultCategory = await createVaultCategory({ name: inputValue })
        if (!vaultCategory) return

        const newOption = createOption(vaultCategory?.name, vaultCategory?.id)
        setOptions(prev => [...prev, newOption])
        setCategorySelected(newOption)
        setValue(newOption)
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  useEffect(() => {
    let ops = vaultCategories?.map(
      (vaultCategory: Hooks.UseVaultsTypes.IVaultCategory) =>
        createOption(vaultCategory.name, vaultCategory.id)
    )
    ops = [...(ops || []), createOption('Type to create...', 0, true)]
    setOptions(ops || [])
  }, [vaultCategories])

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onCreateOption={handleVaultCategory}
      options={options}
      value={value}
      isOptionDisabled={(option): boolean => option.disabled}
      onChange={(newValue): void => {
        if (clearErrors) clearErrors()
        setCategorySelected(newValue)
      }}
      defaultValue={
        categorySelected
          ? {
              value: categorySelected.value,
              label: categorySelected.label,
              disabled: false,
            }
          : undefined
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
        option: (styles, { isFocused, isSelected, isDisabled }) => ({
          ...styles,
          color: colorMode === 'dark' ? 'white' : 'black',
          opacity: isDisabled ? '0.5' : undefined,
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
