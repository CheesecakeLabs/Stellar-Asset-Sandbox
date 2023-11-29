declare namespace Hooks {
  namespace UseContractsTypes {
    interface IContract {
      id: number
      asset: Hooks.UseAssetsTypes.IAsset
      term: number
      yield_rate: number
      deposited: number
      balance: number
      due_in: number
      current_yield: number
      min_deposit: number
      created_at: string
      penalty_rate: number
      address: string
      compound: number
      vault: Hooks.UseVaultsTypes.IVault
    }

    interface IContractRequest {
      name: string
      asset_id: string
      vault_id: string
      address: string
      yield_rate: number
      term: number
      min_deposit: number
      penalty_rate: number
      compound: number
    }

    interface IWithdrawRequest {
      id: number
      amount: number
    }

    interface IContractData {
      position: number
      deposited: number
      yield: number
      estimatedPrematureWithdraw: number
      timeLeft: number
    }

    interface IContractsContext {
      loading: boolean
      contracts: IContract[] | undefined
      depositConfirmed: boolean
      withdrawConfirmed: boolean
      isDepositing: boolean
      isWithdrawing: boolean
      getContracts(): Promise<Hooks.UseContractsTypes.IContract[] | undefined>
      getContract(id: string): Promise<IContract | undefined>
      createContract(params: IContractRequest): Promise<IContract | undefined>
      deposit(
        amount: bigint,
        address: string,
        contractId: string,
        sourcePk: string
      ): Promise<boolean>
      getPosition(
        address: string,
        contractId: string
      ): Promise<bigint | undefined>
      getEstimatedPrematureWithdraw(
        address: string,
        contractId: string
      ): Promise<bigint | undefined>
      getYield(address: string, contractId: string): Promise<bigint | undefined>
      getTimeLeft(address: string, contractId: string): Promise<bigint | undefined>
      getAccount(update: React.Dispatch<React.SetStateAction<string>>): void
      withdraw(
        address: string,
        premature: boolean,
        contractId: string,
        signerSecret?: string
      ): Promise<boolean>
    }
  }
}
