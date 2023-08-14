import { PathRoute } from 'components/enums/path-route'

import { AuthorizeAccount } from '../pages/authorize-account'
import { BurnAsset } from '../pages/burn-asset'
import { ClawbackAsset } from '../pages/clawback-asset'
import { DistributeAsset } from '../pages/distribute-asset'
import { ForgeAsset } from '../pages/forge-asset'
import { FreezeAccount } from '../pages/freeze-account'
import { Home } from '../pages/home'
import { MintAsset } from '../pages/mint-asset'
import { PaymentsTokens } from '../pages/payments-tokens'
import { Profile } from '../pages/profile'
import { Settings } from '../pages/settings'
import { VaultCreate } from '../pages/vault-create'
import { VaultDetail } from '../pages/vault-detail'
import { Vaults } from '../pages/vaults'
import { AppRoute } from './types'

export const coreRoutes: AppRoute[] = [
  { path: PathRoute.HOME, component: Home, isPrivate: true },
  { path: PathRoute.PROFILE, component: Profile, isPrivate: true },
  { path: PathRoute.SETTINGS, component: Settings, isPrivate: true },
  { path: PathRoute.FORGE_ASSET, component: ForgeAsset, isPrivate: true },
  {
    path: PathRoute.MINT_ASSET,
    component: MintAsset,
    isPrivate: true,
  },
  {
    path: PathRoute.BURN_ASSET,
    component: BurnAsset,
    isPrivate: true,
  },
  {
    path: PathRoute.DISTRIBUTE_ASSET,
    component: DistributeAsset,
    isPrivate: true,
  },
  {
    path: PathRoute.AUTHORIZE_ACCOUNT,
    component: AuthorizeAccount,
    isPrivate: true,
  },
  {
    path: PathRoute.CLAWBACK_ASSET,
    component: ClawbackAsset,
    isPrivate: true,
  },
  {
    path: PathRoute.FREEZE_ACCOUNT,
    component: FreezeAccount,
    isPrivate: true,
  },
  {
    path: PathRoute.PAYMENTS_TOKENS,
    component: PaymentsTokens,
    isPrivate: true,
  },
  {
    path: PathRoute.VAULTS,
    component: Vaults,
    isPrivate: true,
  },
  {
    path: PathRoute.VAULT_CREATE,
    component: VaultCreate,
    isPrivate: true,
  },
  {
    path: `${PathRoute.VAULT_DETAIL}/:id`,
    component: VaultDetail,
    isPrivate: true,
  },
]
