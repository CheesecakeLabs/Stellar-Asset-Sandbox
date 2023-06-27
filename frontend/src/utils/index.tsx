import { Permissions } from 'components/enums/permissions'

export const isDark = (colorMode: 'dark' | 'light'): boolean => {
  return colorMode === 'dark'
}

export const havePermission = (
  permission: Permissions,
  permissions: Hooks.UseAuthTypes.IPermission[] | undefined
): boolean => {
  if (!permissions) return false
  return (
    permissions.filter(
      (item: Hooks.UseAuthTypes.IPermission) => item.name === permission
    ).length > 0
  )
}
