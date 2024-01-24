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

const createOption = (label: string, value: number): IOption => ({
  label,
  value: value,
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
      const vaultCategory = await createVaultCategory({ name: inputValue })
      if (!vaultCategory) return

      const newOption = createOption(vaultCategory?.name, vaultCategory?.id)
      setIsLoading(false)
      setOptions(prev => [...prev, newOption])
      setCategorySelected(newOption)
      setValue(newOption)
    }, 1000)
  }

  useEffect(() => {
    const ops = vaultCategories?.map(
      (vaultCategory: Hooks.UseVaultsTypes.IVaultCategory) =>
        createOption(vaultCategory.name, vaultCategory.id)
    )
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
      onChange={(newValue): void => {
        if (clearErrors) clearErrors()
        setCategorySelected(newValue)
      }}
      defaultValue={
        categorySelected
          ? { value: categorySelected.value, label: categorySelected.label }
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
