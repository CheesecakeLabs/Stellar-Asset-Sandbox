import { PathRoute } from 'components/enums/path-route'

import { AssetHome } from '../pages/asset-home'
import { AssetManagement } from '../pages/asset-management'
import { AuthorizeAccount } from '../pages/authorize-account'
import { BurnAsset } from '../pages/burn-asset'
import { ClawbackAsset } from '../pages/clawback-asset'
import { Contracts } from '../pages/contracts'
import { ContractsCreate } from '../pages/contracts-create'
import { ContractsDetail } from '../pages/contracts-detail'
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
    path: `${PathRoute.MINT_ASSET}/:id`,
    component: MintAsset,
    isPrivate: true,
  },
  {
    path: `${PathRoute.BURN_ASSET}/:id`,
    component: BurnAsset,
    isPrivate: true,
  },
  {
    path: `${PathRoute.DISTRIBUTE_ASSET}/:id`,
    component: DistributeAsset,
    isPrivate: true,
  },
  {
    path: `${PathRoute.AUTHORIZE_ACCOUNT}/:id`,
    component: AuthorizeAccount,
    isPrivate: true,
  },
  {
    path: `${PathRoute.CLAWBACK_ASSET}/:id`,
    component: ClawbackAsset,
    isPrivate: true,
  },
  {
    path: `${PathRoute.FREEZE_ACCOUNT}/:id`,
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
  {
    path: PathRoute.SOROBAN_SMART_CONTRACTS,
    component: Contracts,
    isPrivate: true,
  },
  {
    path: `${PathRoute.CONTRACT_DETAIL}/:id`,
    component: ContractsDetail,
    isPrivate: true,
  },
  {
    path: PathRoute.CONTRACT_CREATE,
    component: ContractsCreate,
    isPrivate: true,
  },
  {
    path: `${PathRoute.ASSET_HOME}/:id`,
    component: AssetHome,
    isPrivate: true,
  },
  {
    path: `${PathRoute.ASSET_MANAGEMENT}`,
    component: AssetManagement,
    isPrivate: true,
  },
]
