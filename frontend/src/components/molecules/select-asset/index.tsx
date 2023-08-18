import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: Hooks.UseAssetsTypes.IAssetDto
}

interface ISelectAsset {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  selected?: IOption | null
  setAsset: Dispatch<SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>>
  setSelected?: Dispatch<SetStateAction<IOption | undefined | null>>
}

const createOption = (
  label: string,
  value: Hooks.UseAssetsTypes.IAssetDto
): IOption => ({
  label,
  value: value,
})

export const SelectAsset: React.FC<ISelectAsset> = ({
  assets,
  selected,
  setAsset,
  setSelected,
}) => {
  const [options, setOptions] = useState<IOption[]>([])

  useEffect(() => {
    const ops = assets?.map((asset: Hooks.UseAssetsTypes.IAssetDto) =>
      createOption(asset.code, asset)
    )
    setOptions(ops || [])
  }, [assets])

  return (
    <Select
      options={options}
      onChange={(newValue): void => {
        setAsset(newValue?.value), setSelected && setSelected(newValue)
      }}
      value={selected}
      placeholder="Select asset"
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
