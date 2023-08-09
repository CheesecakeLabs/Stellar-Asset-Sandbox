/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-empty-function */

/* eslint-disable no-return-await */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/naming-convention */
import { Buffer } from 'buffer'
import * as SorobanClient from 'soroban-client'
import { xdr } from 'soroban-client'

import {
  scValStrToJs,
  scValToJs,
  addressToScVal,
  i128ToScVal,
  strToScVal,
} from './convert'
import { invoke } from './invoke'
import { ResponseTypes } from './method-options'

export * from './constants'
export * from './server'
export * from './invoke'

export type u32 = number
export type i32 = number
export type u64 = bigint
export type i64 = bigint
export type u128 = bigint
export type i128 = bigint
export type u256 = bigint
export type i256 = bigint
export type Address = string
export type Option<T> = T | undefined
export type Typepoint = bigint
export type Duration = bigint

/// Error interface containing the error message
export interface Error_ {
  message: string
}

export interface Result<T, E = Error_> {
  unwrap(): T
  unwrapErr(): E
  isOk(): boolean
  isErr(): boolean
}

export class Ok<T> implements Result<T> {
  constructor(readonly value: T) {}
  unwrapErr(): Error_ {
    throw new Error('No error')
  }
  unwrap(): T {
    return this.value
  }

  isOk(): boolean {
    return true
  }

  isErr(): boolean {
    return !this.isOk()
  }
}

export class Err<T> implements Result<T> {
  constructor(readonly error: Error_) {}
  unwrapErr(): Error_ {
    return this.error
  }
  unwrap(): never {
    throw new Error(this.error.message)
  }

  isOk(): boolean {
    return false
  }

  isErr(): boolean {
    return !this.isOk()
  }
}

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer
}

const regex = /ContractError\((\d+)\)/

export async function initialize<R extends ResponseTypes = undefined>(
  {
    admin,
    asset,
    term,
    yield_rate,
    min_deposit,
    penalty_rate,
  }: {
    admin: Address
    asset: Address
    term: u64
    yield_rate: u64
    min_deposit: i128
    penalty_rate: u64
  },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'initialize',
    args: [
      (i => addressToScVal(i))(admin),
      (i => addressToScVal(i))(asset),
      (i => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(term),
      (i => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(yield_rate),
      (i => i128ToScVal(i))(min_deposit),
      (i => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        penalty_rate
      ),
    ],
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    parseResultXdr: () => {},
  })
}

export async function adminWithdraw<R extends ResponseTypes = undefined>(
  { amount, address }: { amount: i128; address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'admin_withdraw',
    args: [(i => i128ToScVal(i))(amount), (i => addressToScVal(i))(address)],
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    parseResultXdr: () => {},
  })
}

export async function deposit<R extends ResponseTypes = undefined>(
  { amount, address }: { amount: i128; address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'deposit',
    args: [(i => i128ToScVal(i))(amount), (i => addressToScVal(i))(address)],
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    parseResultXdr: () => {},
  })
}

export async function withdraw<R extends ResponseTypes = undefined>(
  {
    address,
    accept_premature_withdraw,
  }: { address: Address; accept_premature_withdraw: boolean },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'withdraw',
    args: [
      (i => addressToScVal(i))(address),
      (i => xdr.ScVal.scvBool(i))(accept_premature_withdraw),
    ],
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    parseResultXdr: () => {},
  })
}

export async function getEstimatedYield<R extends ResponseTypes = undefined>(
  { address }: { address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'get_estimated_yield',
    args: [(i => addressToScVal(i))(address)],
    ...options,
    parseResultXdr: (xdr): i128 => {
      return scValStrToJs(xdr)
    },
  })
}

export async function getPosition<R extends ResponseTypes = undefined>(
  { address }: { address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'get_position',
    args: [(i => addressToScVal(i))(address)],
    ...options,
    parseResultXdr: (xdr): i128 => {
      return scValStrToJs(xdr)
    },
  })
}

export async function getEstimatedPrematureWithdraw<
  R extends ResponseTypes = undefined
>(
  { address }: { address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'get_estimated_premature_withdraw',
    args: [(i => addressToScVal(i))(address)],
    ...options,
    parseResultXdr: (xdr): i128 => {
      return scValStrToJs(xdr)
    },
  })
}

export async function getTimeLeft<R extends ResponseTypes = undefined>(
  { address }: { address: Address },
  options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `u64`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
  } = {}
) {
  return await invoke({
    method: 'get_time_left',
    args: [(i => addressToScVal(i))(address)],
    ...options,
    parseResultXdr: (xdr): u64 => {
      return scValStrToJs(xdr)
    },
  })
}

export interface DepositData {
  amount: i128
  timestamp: u64
}

function DepositDataToXdr(depositData?: DepositData): xdr.ScVal {
  if (!depositData) {
    return xdr.ScVal.scvVoid()
  }
  const arr = [
    new xdr.ScMapEntry({
      key: (i => xdr.ScVal.scvSymbol(i))('amount'),
      val: (i => i128ToScVal(i))(depositData['amount']),
    }),
    new xdr.ScMapEntry({
      key: (i => xdr.ScVal.scvSymbol(i))('timestamp'),
      val: (i => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(
        depositData['timestamp']
      ),
    }),
  ]
  return xdr.ScVal.scvMap(arr)
}

function DepositDataFromXdr(base64Xdr: string): DepositData {
  const scVal = strToScVal(base64Xdr)
  const obj: [string, any][] = scVal
    .map()!
    .map(e => [e.key().str() as string, e.val()])
  const map = new Map<string, any>(obj)
  if (!obj) {
    throw new Error('Invalid XDR')
  }
  return {
    amount: scValToJs(map.get('amount')) as unknown as i128,
    timestamp: scValToJs(map.get('timestamp')) as unknown as u64,
  }
}

export type DataKey =
  | { tag: 'Admin'; values: void }
  | { tag: 'Asset'; values: void }
  | { tag: 'Term'; values: void }
  | { tag: 'YieldRate'; values: void }
  | { tag: 'MinDeposit'; values: void }
  | { tag: 'PenaltyRate'; values: void }
  | { tag: 'Deposit'; values: [Address] }

function DataKeyToXdr(dataKey?: DataKey): xdr.ScVal {
  if (!dataKey) {
    return xdr.ScVal.scvVoid()
  }
  const res: xdr.ScVal[] = []
  switch (dataKey.tag) {
    case 'Admin':
      res.push((i => xdr.ScVal.scvSymbol(i))('Admin'))
      break
    case 'Asset':
      res.push((i => xdr.ScVal.scvSymbol(i))('Asset'))
      break
    case 'Term':
      res.push((i => xdr.ScVal.scvSymbol(i))('Term'))
      break
    case 'YieldRate':
      res.push((i => xdr.ScVal.scvSymbol(i))('YieldRate'))
      break
    case 'MinDeposit':
      res.push((i => xdr.ScVal.scvSymbol(i))('MinDeposit'))
      break
    case 'PenaltyRate':
      res.push((i => xdr.ScVal.scvSymbol(i))('PenaltyRate'))
      break
    case 'Deposit':
      res.push((i => xdr.ScVal.scvSymbol(i))('Deposit'))
      res.push((i => addressToScVal(i))(dataKey.values[0]))
      break
  }
  return xdr.ScVal.scvVec(res)
}

function DataKeyFromXdr(base64Xdr: string): DataKey {
  type Tag = DataKey['tag']
  type Value = DataKey['values']
  const [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [
    Tag,
    Value
  ]
  if (!tag) {
    throw new Error('Missing enum tag when decoding DataKey from XDR')
  }
  return { tag, values } as DataKey
}

const Errors = []
