import { Flex, useColorMode, Tag } from '@chakra-ui/react'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import Select from 'react-select'

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
  setWallet,
  distributorWallet,
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

  const formatGroupLabel = (data: IOption): ReactNode => (
    <Flex justifyContent="space-between">
      <span>{data.label}</span>
      <Tag variant={data.isPersonal ? 'blue_moonstone' : 'green'}>
        {data.isPersonal ? 'Personal' : 'Public'}
      </Tag>
    </Flex>
  )

  return (
    <Select
      options={options}
      onChange={(newValue): void => setWallet(newValue?.value)}
      isOptionDisabled={(option): boolean => option.disabled}
      formatOptionLabel={formatGroupLabel}
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
