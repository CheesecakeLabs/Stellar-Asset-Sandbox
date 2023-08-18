export enum PathRoute {
  HOME = '/',
  LOGIN = '/login/:expired?',
  SIGNUP = '/signup',
  RESET_PASSWORD = '/reset-password',
  PAYMENTS_TOKENS = '/payments-tokens',
  SECURITIES_TOKENS = '/securities-tokens',
  SOROBAN_SMART_CONTRACTS = '/soroban-smart-contracts',
  ASSETS_DASHBOARD = '/assets-dashboard',
  BLOCKCHAIN_EXPLORER = '/blockchain-explorer',
  SETTINGS = '/settings',
  PROFILE = '/profile',
  FORGE_ASSET = '/forge-asset',
  ASSET_HOME = '/asset-management/home',
  MINT_ASSET = '/asset-management/mint',
  BURN_ASSET = '/asset-management/burn',
  DISTRIBUTE_ASSET = '/asset-management/distribute',
  AUTHORIZE_ACCOUNT = '/asset-management/authorize',
  CLAWBACK_ASSET = '/asset-management/clawback',
  FREEZE_ACCOUNT = '/asset-management/freeze',
  VAULTS = '/vaults',
  VAULT_CREATE = '/vault-create',
  VAULT_DETAIL = '/vault-detail',
  CONTRACT_DETAIL = '/contract-detail',
  CONTRACT_CREATE = '/contract-create',
  ASSET_MANAGEMENT = '/asset-management',
}
