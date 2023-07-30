import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: string
}

interface ISelectVault {
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  setWallet: Dispatch<SetStateAction<string | undefined>>
}

const createOption = (label: string, value: string): IOption => ({
  label,
  value: value,
})

export const SelectVault: React.FC<ISelectVault> = ({ vaults, setWallet }) => {
  const [options, setOptions] = useState<IOption[]>([])

  useEffect(() => {
    const ops = vaults?.map((vault: Hooks.UseVaultsTypes.IVault) =>
      createOption(vault.name, vault.wallet.key.publicKey)
    )
    setOptions(ops || [])
  }, [vaults])

  return (
    <Select
      options={options}
      onChange={(newValue): void => setWallet(newValue?.value)}
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
