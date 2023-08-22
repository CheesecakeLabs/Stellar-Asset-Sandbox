import { useContext } from 'react'

import { DashboardsContext } from './context'

export function useDashboards(): Hooks.UseDashboardsTypes.IDashboardsContext {
  const context = useContext(DashboardsContext)

  if (!context) {
    throw new Error('useAssets must be used within an DashboardsProvider')
  }

  return context
}
