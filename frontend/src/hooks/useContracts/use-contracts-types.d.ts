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
      yield: number
      estimatedPrematureWithdraw: number
      timeLeft?: number
    }

    interface IHistory {
      id: number
      deposited_at: string
      deposit_amount: number
      withdrawn_at: string | undefined
      withdraw_amount: number | undefined
    }

    interface IHistoryRequest {
      deposit_amount: number
      contract_id: number
    }

    interface IHistoryUpdate {
      withdraw_amount: number
      contract_id: number
    }

    interface IPagedContracts {
      contracts: IContract[]
      totalPages: number
    }

    interface IInvocation {
      header: {
        source: string,
        timeout: number,
        fee: string,
      },
      signers: CustomAccountHandlerClient[],
    }

    interface ISignRequest {
      envelope: string
      wallet_pk?: string
    }

    interface ISignResponse {
      envelope: string
      hash: string
    }

    interface IContractsContext {
      loading: boolean
      contracts: IContract[] | undefined
      depositConfirmed: boolean
      withdrawConfirmed: boolean
      isDepositing: boolean
      isWithdrawing: boolean
      getContracts(): Promise<Hooks.UseContractsTypes.IContract[] | undefined>
      getPagedContracts(args: {
        page: number
        limit: number
      }): Promise<Hooks.UseContractsTypes.IPagedContracts | undefined>
      getContract(id: string): Promise<IContract | undefined>
      createContract(params: IContractRequest): Promise<IContract | undefined>
      deposit(
        amount: bigint,
        address: string,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<boolean>
      getPosition(
        address: string,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<number | undefined>
      getEstimatedPrematureWithdraw(
        address: string,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<number | undefined>
      getYield(
        address: string,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<number | undefined>
      getTimeLeft(
        address: string,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<number | undefined>
      getAccount(update: React.Dispatch<React.SetStateAction<string>>): void
      withdraw(
        address: string,
        premature: boolean,
        contractId: string,
        sourcePk: string,
        sponsorPk: string
      ): Promise<boolean>
      getHistory(
        contractId: number
      ): Promise<Hooks.UseContractsTypes.IHistory[] | undefined>
      addContractHistory(params: IHistoryRequest): Promise<IHistory | undefined>
      updateContractHistory(
        params: IHistoryUpdate
      ): Promise<IHistory | undefined>
      sign(params: ISignRequest): Promise<ISignResponse | undefined>
    }
  }
}
