import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'

import { IOption } from '..'

interface ISelectCategory {
  vaultCategories: Hooks.UseVaultsTypes.IVaultCategory[] | undefined
  createVaultCategory(
    vaultCategory: Hooks.UseVaultsTypes.IVaultCategoryRequest
  ): Promise<Hooks.UseVaultsTypes.IVaultCategory | undefined>
  setCategorySelected: Dispatch<SetStateAction<IOption | null | undefined>>
}

const createOption = (label: string, value: number): IOption => ({
  label,
  value: value,
})

export const SelectCategory: React.FC<ISelectCategory> = ({
  vaultCategories,
  createVaultCategory,
  setCategorySelected,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<IOption[]>([])

  const handleVaultCategory = (inputValue: string): void => {
    setIsLoading(true)
    setTimeout(async () => {
      const vaultCategory = await createVaultCategory({ name: inputValue })
      if (!vaultCategory) return

      const newOption = createOption(vaultCategory?.name, vaultCategory?.id)
      setIsLoading(false)
      setOptions(prev => [...prev, newOption])
      setCategorySelected(newOption)
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
      onChange={(newValue): void => setCategorySelected(newValue)}
      styles={{
        control: baseStyles => ({
          ...baseStyles,
          borderColor: 'gray.400',
          fontSize: '14px',
        }),
      }}
    />
  )
}