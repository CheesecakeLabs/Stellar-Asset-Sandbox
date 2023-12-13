const contract1 = {
  id: 1,
  asset: {
    id: 1,
    code: 'USDK',
    name: 'USD Cheesecake',
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
  term: 10,
  yield_rate: 1.5,
  deposited: 100,
  balance: 102,
  due_in: 600,
  current_yield: 103,
  min_deposit: 100,
  created_at: Date.now().toString(),
  penalty_rate: 50,
} as Hooks.UseContractsTypes.IContract


export const mockContracts = [contract1]
