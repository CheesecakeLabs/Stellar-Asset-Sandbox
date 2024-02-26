import { Permissions } from 'components/enums/permissions'

export const isDark = (colorMode: 'dark' | 'light'): boolean => {
  return colorMode === 'dark'
}

export const havePermission = (
  permission: Permissions,
  userPermission: Hooks.UseAuthTypes.IUserPermission | undefined
): boolean => {
  if (userPermission?.admin) return true
  if (!userPermission) return false
  return (
    userPermission.permissions.filter(item => item.action === permission)
      .length > 0
  )
}
