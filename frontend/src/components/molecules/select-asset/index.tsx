import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'

export interface IOption {
  readonly label: string
  readonly value: Hooks.UseAssetsTypes.IAssetDto
}

interface ISelectAsset {
  assets: Hooks.UseAssetsTypes.IAssetDto[] | undefined
  setAsset: Dispatch<SetStateAction<Hooks.UseAssetsTypes.IAssetDto | undefined>>
}

const createOption = (
  label: string,
  value: Hooks.UseAssetsTypes.IAssetDto
): IOption => ({
  label,
  value: value,
})

export const SelectAsset: React.FC<ISelectAsset> = ({ assets, setAsset }) => {
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
      onChange={(newValue): void => setAsset(newValue?.value)}
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
