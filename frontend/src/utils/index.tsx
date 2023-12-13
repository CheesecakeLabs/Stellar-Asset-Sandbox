import { Permissions } from 'components/enums/permissions'

export const isDark = (colorMode: 'dark' | 'light'): boolean => {
  return colorMode === 'dark'
}

export const havePermission = (
  permission: Permissions,
  permissions: Hooks.UseAuthTypes.IUserPermission[] | undefined
): boolean => {
  if (!permissions) return false
  return (
    permissions.filter(
      (item: Hooks.UseAuthTypes.IUserPermission) => item.action === permission
    ).length > 0
  )
}
