import { ContractSpec } from 'soroban-client'

import { I128, U64, Address } from '../constants'

export enum Methods {
  deposit = 'deposit',
  withdraw = 'withdraw',
  getEstimatedYield = 'get_estimated_yield',
  getPosition = 'get_position',
  getEstimatedPrematureWithdraw = 'get_estimated_premature_withdraw',
  getTimeLeft = 'get_time_left',
  extendContractValidity = 'extend_contract_validity',
}

export const spec = new ContractSpec([
  'AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAABHRlcm0AAAAGAAAAAAAAAA1jb21wb3VuZF9zdGVwAAAAAAAABgAAAAAAAAAKeWllbGRfcmF0ZQAAAAAABgAAAAAAAAALbWluX2RlcG9zaXQAAAAACwAAAAAAAAAMcGVuYWx0eV9yYXRlAAAABgAAAAA=',
  'AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAA=',
  'AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAAGWFjY2VwdF9wcmVtYXR1cmVfd2l0aGRyYXcAAAAAAAABAAAAAA==',
  'AAAAAAAAAAAAAAATZ2V0X2VzdGltYXRlZF95aWVsZAAAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAACw==',
  'AAAAAAAAAAAAAAAMZ2V0X3Bvc2l0aW9uAAAAAQAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAQAAAAs=',
  'AAAAAAAAAAAAAAAgZ2V0X2VzdGltYXRlZF9wcmVtYXR1cmVfd2l0aGRyYXcAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAACw==',
  'AAAAAAAAAAAAAAANZ2V0X3RpbWVfbGVmdAAAAAAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAAG',
  'AAAAAAAAAAAAAAAYZXh0ZW5kX2NvbnRyYWN0X3ZhbGlkaXR5AAAAAAAAAAA=',
  'AAAAAQAAAAAAAAAAAAAAC0RlcG9zaXREYXRhAAAAAAIAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==',
  'AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFQXNzZXQAAAAAAAAAAAAAAAAAAAxDb21wb3VuZFN0ZXAAAAAAAAAAAAAAAARUZXJtAAAAAAAAAAAAAAAJWWllbGRSYXRlAAAAAAAAAAAAAAAAAAAKTWluRGVwb3NpdAAAAAAAAAAAAAAAAAALUGVuYWx0eVJhdGUAAAAAAQAAAAAAAAAHRGVwb3NpdAAAAAABAAAAEw==',
])

export interface IDepositData {
  amount: I128
  timestamp: U64
}

export type DataKey =
  | { tag: 'Admin'; values: void }
  | { tag: 'Asset'; values: void }
  | { tag: 'CompoundStep'; values: void }
  | { tag: 'Term'; values: void }
  | { tag: 'YieldRate'; values: void }
  | { tag: 'MinDeposit'; values: void }
  | { tag: 'PenaltyRate'; values: void }
  | { tag: 'Deposit'; values: readonly [Address] }