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
    }

    interface IWithdrawRequest {
      id: number
      amount: number
    }

    interface IContractsContext {
      loading: boolean
      contracts: IContract[] | undefined
      contract: IContract | undefined
      depositConfirmed: boolean
      withdrawConfirmed: boolean
      isDepositing: boolean
      isWithdrawing: boolean
      getContracts(): Promise<Hooks.UseContractsTypes.IContract[] | undefined>
      getContract(id: string): Promise<void>
      createContract(params: IContractRequest): Promise<IContract | undefined>
      deposit(
        amount: bigint,
        address: string,
        updatePosition: void,
        signerSecret: string
      ): Promise<boolean>
      getPosition(
        update: React.Dispatch<React.SetStateAction<bigint>>,
        address: string
      ): void
      getYield(
        update: React.Dispatch<React.SetStateAction<bigint>>,
        address: string
      ): void
      getTime(
        update: React.Dispatch<React.SetStateAction<bigint>>,
        address: string
      ): void
      getAccount(update: React.Dispatch<React.SetStateAction<string>>): void
      withdraw(
        address: string,
        premature: boolean,
        updatePosition: void,
        signerSecret: string
      ): Promise<boolean>
    }
  }
}
