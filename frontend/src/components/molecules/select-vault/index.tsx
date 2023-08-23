import { useColorMode } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: string
}

interface ISelectVault {
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  setWallet: Dispatch<SetStateAction<string | undefined>>
  distributorWallet?: string
}

const createOption = (label: string, value: string): IOption => ({
  label,
  value: value,
})

export const SelectVault: React.FC<ISelectVault> = ({
  vaults,
  setWallet,
  distributorWallet,
}) => {
  const { colorMode } = useColorMode()
  const [options, setOptions] = useState<IOption[] | []>([])

  useEffect(() => {
    const listVaults = vaults?.map((vault: Hooks.UseVaultsTypes.IVault) =>
      createOption(vault.name, vault.wallet.key.publicKey)
    )

    let ops = distributorWallet
      ? [createOption('Asset Issuer', distributorWallet)]
      : []
    if (listVaults) {
      ops = [...ops, ...listVaults]
    }

    setOptions(ops || [])
  }, [distributorWallet, vaults])

  return (
    <Select
      options={options}
      onChange={(newValue): void => setWallet(newValue?.value)}
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
