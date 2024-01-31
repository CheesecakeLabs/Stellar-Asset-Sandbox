import { MenuItem } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

interface IItemActionAssetMobile {
  isSelected: boolean
  title: string
  icon: ReactElement
  path: string
}

export const ItemActionAssetMobile: React.FC<IItemActionAssetMobile> = ({
  isSelected,
  title,
  icon,
  path,
}) => {
  const navigate = useNavigate()

  return (
    <MenuItem
      icon={icon}
      stroke={isSelected ? 'white' : 'gray'}
      fill={isSelected ? 'white' : 'gray'}
      onClick={(): void => {
        navigate(path)
      }}
      color={isSelected ? 'white' : undefined}
      bg={isSelected ? 'primary.normal' : undefined}
      fontSize="sm"
    >
      {title}
    </MenuItem>
  )
}
