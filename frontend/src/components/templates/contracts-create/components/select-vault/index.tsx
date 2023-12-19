import { useColorMode } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: Hooks.UseVaultsTypes.IVault
  readonly disabled: boolean
}

interface ISelectVault {
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  setVault: Dispatch<SetStateAction<Hooks.UseVaultsTypes.IVault | undefined>>
  distributorWallet?: string
}

const createOption = (
  label: string,
  value: Hooks.UseVaultsTypes.IVault,
  isDisabled: boolean
): IOption => ({
  label,
  value: value,
  disabled: isDisabled,
})

export const SelectVault: React.FC<ISelectVault> = ({
  vaults,
  setVault,
  distributorWallet,
}) => {
  const { colorMode } = useColorMode()
  const [options, setOptions] = useState<IOption[] | []>([])

  useEffect(() => {
    const listVaults = vaults?.map((vault: Hooks.UseVaultsTypes.IVault) =>
      createOption(vault.name, vault, vault.isUnauthorized || false)
    )

    const ops = listVaults

    setOptions(ops || [])
  }, [distributorWallet, vaults])

  return (
    <Select
      options={options}
      onChange={(newValue): void => setVault(newValue?.value)}
      isOptionDisabled={(option): boolean => option.disabled}
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

          background: isFocused
            ? colorMode === 'dark'
              ? '#292d3e'
              : undefined
            : isSelected
            ? colorMode === 'dark'
              ? '#292d3e'
              : isDisabled
              ? 'red'
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
