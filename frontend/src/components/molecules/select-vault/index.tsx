import { Flex, useColorMode } from '@chakra-ui/react'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { User } from 'react-feather'
import Select from 'react-select'

import { VaultIcon } from 'components/icons'

export interface IOption {
  readonly label: string
  readonly value: string
  readonly isPersonal: boolean
  readonly disabled: boolean
}

interface ISelectVault {
  vaults: Hooks.UseVaultsTypes.IVault[] | undefined
  setWallet: Dispatch<SetStateAction<string | undefined>>
  distributorWallet?: string
  clearErrors?(): void
  noOptionsMessage?: string
}

const createOption = (
  label: string,
  value: string,
  isDisabled: boolean,
  isPersonal: boolean
): IOption => ({
  label,
  value: value,
  disabled: isDisabled,
  isPersonal: isPersonal,
})

export const SelectVault: React.FC<ISelectVault> = ({
  vaults,
  distributorWallet,
  noOptionsMessage = 'No options',
  setWallet,
  clearErrors,
}) => {
  const { colorMode } = useColorMode()
  const [options, setOptions] = useState<IOption[] | []>([])

  useEffect(() => {
    const listVaults = vaults?.map((vault: Hooks.UseVaultsTypes.IVault) =>
      createOption(
        vault.name,
        vault.wallet.key.publicKey,
        vault.isUnauthorized || false,
        vault.owner_id !== null
      )
    )

    let ops = distributorWallet
      ? [createOption('Asset Issuer', distributorWallet, false, false)]
      : []
    if (listVaults) {
      ops = [...ops, ...listVaults]
    }

    setOptions(ops || [])
  }, [distributorWallet, vaults])

  const formatLabel = (data: IOption): ReactNode => (
    <Flex alignItems="center" gap="0.75rem">
      {data.isPersonal ? (
        <User width="16px" height="16px" fill="gray" />
      ) : (
        <VaultIcon width="16px" height="16px" fill="grey" />
      )}
      <span>{data.label}</span>
    </Flex>
  )

  return (
    <Select
      options={options}
      onChange={(newValue): void => {
        if (clearErrors) clearErrors()
        setWallet(newValue?.value)
      }}
      isOptionDisabled={(option): boolean => option.disabled}
      formatOptionLabel={formatLabel}
      noOptionsMessage={({ inputValue }): string =>
        !inputValue ? noOptionsMessage : 'No results found'
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
