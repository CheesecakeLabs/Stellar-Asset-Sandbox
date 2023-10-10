import { PathRoute } from 'components/enums/path-route'

import { AssetHome } from '../pages/asset-home'
import { AuthorizeAccount } from '../pages/authorize-account'
import { BurnAsset } from '../pages/burn-asset'
import { ClawbackAsset } from '../pages/clawback-asset'
import { Contracts } from '../pages/contracts'
import { ContractsCreate } from '../pages/contracts-create'
import { ContractsDetail } from '../pages/contracts-detail'
import { Dashboards } from '../pages/dashboards'
import { DistributeAsset } from '../pages/distribute-asset'
import { ForgeAsset } from '../pages/forge-asset'
import { FreezeAccount } from '../pages/freeze-account'
import { Home } from '../pages/home'
import { MintAsset } from '../pages/mint-asset'
import { PaymentsTokens } from '../pages/payments-tokens'
import { Profile } from '../pages/profile'
import { RolePermissions } from '../pages/role-permissions'
import { RolesManage } from '../pages/roles-manage'
import { SandboxPage } from '../pages/sandbox-page'
import { TeamMembers } from '../pages/team-members'
import { TokenManagement } from '../pages/token-management'
import { VaultCreate } from '../pages/vault-create'
import { VaultDetail } from '../pages/vault-detail'
import { Vaults } from '../pages/vaults'
import { AppRoute } from './types'
import { PublishInformation } from '../pages/publish-information'

export const coreRoutes: AppRoute[] = [
  { path: PathRoute.SANDBOX, component: SandboxPage },
  { path: PathRoute.HOME, component: Home, isPrivate: true },
  { path: PathRoute.PROFILE, component: Profile, isPrivate: true },
  { path: PathRoute.SETTINGS, component: TeamMembers, isPrivate: true },
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
    path: `${PathRoute.PUBLISH_INFORMATION}/:id`,
    component: PublishInformation,
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
    path: PathRoute.TOKEN_MANAGEMENT,
    component: TokenManagement,
    isPrivate: true,
  },
  {
    path: PathRoute.DASHBOARDS,
    component: Dashboards,
    isPrivate: true,
  },
  {
    path: PathRoute.PERMISSIONS,
    component: RolePermissions,
    isPrivate: true,
  },
  {
    path: PathRoute.ROLES_MANAGE,
    component: RolesManage,
    isPrivate: true,
  },
]
