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
  const [options, setOptions] = useState<IOption[] | []>([])

  useEffect(() => {
    const listVaults = vaults?.map((vault: Hooks.UseVaultsTypes.IVault) =>
      createOption(vault.name, vault.wallet.key.publicKey)
    )

    let ops = distributorWallet
      ? [createOption('Distributor', distributorWallet)]
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
        }),
      }}
    />
  )
}
