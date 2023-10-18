import { ContractSpec } from "soroban-client";
import { I128, U32, U64, Address } from "../constants";
import { contractId as assetAddress } from "../regulated asset/constants";

export const contractId =
  "CDLML44R6I7H5TGQZQ3OITZVEQ3AHM7S4ERLMDHIXIPQQSEQIXRU5SLL";

export const metadata = {
  contractId,
  quotaTimeLimit: "600",
  probationPeriod: "5184000",
  inflowLimit: "70000000000",
  outflowLimit: "100000000000",
  adminAddress: "GALIALRZJ5EU2IJJSIQEA3D3ZIEHK5HPBHZJFUEPTGQU3MYEKKIUINTY",
  assetAddress,
};

export enum Methods {
  get_quota = "get_quota",
  get_quota_release_time = "get_quota_release_time",
  get_account_probation_period = "get_account_probation_period",
  get_probation_period = "get_probation_period",
  get_quota_time_limit = "get_quota_time_limit",
  get_inflow_limit = "get_inflow_limit",
  get_outflow_limit = "get_outflow_limit",
  get_asset = "get_asset",
  get_admin = "get_admin",
}

export const spec = new ContractSpec([
  "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAVhc3NldAAAAAAAABMAAAAAAAAAEHByb2JhdGlvbl9wZXJpb2QAAAAGAAAAAAAAABBxdW90YV90aW1lX2xpbWl0AAAABgAAAAAAAAAMaW5mbG93X2xpbWl0AAAACwAAAAAAAAANb3V0Zmxvd19saW1pdAAAAAAAAAsAAAAA",
  "AAAAAAAAAAAAAAAPcmV2aWV3X3RyYW5zZmVyAAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
  "AAAAAAAAAAAAAAAJZ2V0X3F1b3RhAAAAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAD6gAAAAs=",
  "AAAAAAAAAAAAAAAcZ2V0X2FjY291bnRfcHJvYmF0aW9uX3BlcmlvZAAAAAEAAAAAAAAAAmlkAAAAAAATAAAAAQAAAAY=",
  "AAAAAAAAAAAAAAAWZ2V0X3F1b3RhX3JlbGVhc2VfdGltZQAAAAAAAQAAAAAAAAACaWQAAAAAABMAAAABAAAH0AAAABdBY2NvdW50UXVvdGFSZWxlYXNlRGF0YQA=",
  "AAAAAAAAAAAAAAAUZ2V0X3Byb2JhdGlvbl9wZXJpb2QAAAAAAAAAAQAAAAY=",
  "AAAAAAAAAAAAAAAUZ2V0X3F1b3RhX3RpbWVfbGltaXQAAAAAAAAAAQAAAAY=",
  "AAAAAAAAAAAAAAAQZ2V0X2luZmxvd19saW1pdAAAAAAAAAABAAAACw==",
  "AAAAAAAAAAAAAAARZ2V0X291dGZsb3dfbGltaXQAAAAAAAAAAAAAAQAAAAs=",
  "AAAAAAAAAAAAAAAJZ2V0X2Fzc2V0AAAAAAAAAAAAAAEAAAAT",
  "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
  "AAAAAQAAAAAAAAAAAAAADkFsbG93YW5jZVZhbHVlAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABA==",
  "AAAAAQAAAAAAAAAAAAAAE0FjY291bnRBY3Rpdml0eURhdGEAAAAAAgAAAAAAAAAGaW5mbG93AAAAAAPqAAAH0AAAAAdUeEVudHJ5AAAAAAAAAAAHb3V0ZmxvdwAAAAPqAAAH0AAAAAdUeEVudHJ5AA==",
  "AAAAAQAAAAAAAAAAAAAAB1R4RW50cnkAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
  "AAAAAQAAAAAAAAAAAAAAF0FjY291bnRRdW90YVJlbGVhc2VEYXRhAAAAAAIAAAAAAAAABmluZmxvdwAAAAAD6gAAB9AAAAAOVHhSZWxlYXNlRW50cnkAAAAAAAAAAAAHb3V0ZmxvdwAAAAPqAAAH0AAAAA5UeFJlbGVhc2VFbnRyeQAA",
  "AAAAAQAAAAAAAAAAAAAADlR4UmVsZWFzZUVudHJ5AAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACXRpbWVfbGVmdAAAAAAAAAY=",
  "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFQXNzZXQAAAAAAAABAAAAAAAAAA9BY2NvdW50QWN0aXZpdHkAAAAAAQAAABMAAAAAAAAAAAAAAAxPdXRmbG93TGltaXQAAAAAAAAAAAAAAAtJbmZsb3dMaW1pdAAAAAAAAAAAAAAAAA5RdW90YVRpbWVMaW1pdAAAAAAAAAAAAAAAAAAPUHJvYmF0aW9uUGVyaW9kAAAAAAEAAAAAAAAAFUFjY291bnRQcm9iYXRpb25TdGFydAAAAAAAAAEAAAAT",
]);

export interface IAllowanceValue {
  amount: I128;
  expiration_ledger: U32;
}

export interface IAccountActivityData {
  inflow: ITxEntry[];
  outflow: ITxEntry[];
}

export interface ITxEntry {
  amount: I128;
  timestamp: U64;
}

export interface IAccountQuotaReleaseData {
  inflow: ITxReleaseEntry[];
  outflow: ITxReleaseEntry[];
}

export interface ITxReleaseEntry {
  amount: I128;
  time_left: U64;
}

export type DataKey =
  | { tag: "Admin"; values: void }
  | { tag: "Asset"; values: void }
  | { tag: "AccountActivity"; values: readonly [Address] }
  | { tag: "OutflowLimit"; values: void }
  | { tag: "InflowLimit"; values: void }
  | { tag: "QuotaTimeLimit"; values: void }
  | { tag: "ProbationPeriod"; values: void }
  | { tag: "AccountProbationStart"; values: readonly [Address] };

// RA CDKQVKEBC3EE5YPIOSECF3YLIW5KOMLF6JMZESNCHXUO5KGIBNHJ4M4H
