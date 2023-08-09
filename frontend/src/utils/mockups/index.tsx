const contract1 = {
  id: 1,
  asset: {
    id: 1,
    code: 'FIFO',
    name: 'FIFO',
    assetType: 'type',
    issuer: {
      id: 1,
      type: 'distributor',
      key: { id: 1, publicKey: 'GSC...', weight: 1, walletId: 1 },
      funded: true,
    },
    distributor: {
      id: 1,
      type: 'distributor',
      key: { id: 1, publicKey: 'GSC...', weight: 1, walletId: 1 },
      funded: true,
    },
    supply: 10000,
    assetData: undefined,
  } as Hooks.UseAssetsTypes.IAsset,
  term: 60,
  yield_rate: 20,
  deposited: 100,
  balance: 102,
  due_in: 10000,
  current_yield: 103,
  min_deposit: 100,
  created_at: Date.now().toString(),
  penalty_rate: 50,
} as Hooks.UseContractsTypes.IContract

const contract2 = {
  id: 1,
  asset: {
    id: 1,
    code: 'USDC',
    name: 'USDC',
    assetType: 'type',
    issuer: {
      id: 1,
      type: 'distributor',
      key: { id: 1, publicKey: 'GSC...', weight: 1, walletId: 1 },
      funded: true,
    },
    distributor: {
      id: 1,
      type: 'distributor',
      key: { id: 1, publicKey: 'GSC...', weight: 1, walletId: 1 },
      funded: true,
    },
    supply: 10000,
    assetData: undefined,
  } as Hooks.UseAssetsTypes.IAsset,
  term: 300,
  yield_rate: 5,
  deposited: 100,
  balance: 102,
  due_in: 300,
  current_yield: 103,
  min_deposit: 50,
  created_at: Date.now().toString(),
  penalty_rate: 50,
} as Hooks.UseContractsTypes.IContract

export const mockContracts = [contract1, contract2]
