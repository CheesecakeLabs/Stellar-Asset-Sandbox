import { Address, xdr, scValToBigInt, ScInt } from 'soroban-client';
import { Buffer } from "buffer";

export function strToScVal(base64Xdr: string): xdr.ScVal {
    return xdr.ScVal.fromXDR(Buffer.from(base64Xdr, 'base64'));
}

export function scValStrToJs<T>(base64Xdr: string): T {
    return scValToJs(strToScVal(base64Xdr));
}

export function scValToJs<T>(val: xdr.ScVal): T {
    switch (val?.switch()) {
        case xdr.ScValType.scvBool(): {
            return val.b() as unknown as T;
        }
        case xdr.ScValType.scvVoid():
        case undefined: {
            return 0 as unknown as T;
        }
        case xdr.ScValType.scvU32(): {
            return val.u32() as unknown as T;
        }
        case xdr.ScValType.scvI32(): {
            return val.i32() as unknown as T;
        }
        case xdr.ScValType.scvU64():
        case xdr.ScValType.scvI64():
        case xdr.ScValType.scvU128():
        case xdr.ScValType.scvI128():
        case xdr.ScValType.scvU256():
        case xdr.ScValType.scvI256(): {
            return scValToBigInt(val) as unknown as T;
        }
        case xdr.ScValType.scvAddress(): {
            return Address.fromScVal(val).toString() as unknown as T;
        }
        case xdr.ScValType.scvString(): {
            return val.str().toString() as unknown as T;
        }
        case xdr.ScValType.scvSymbol(): {
            return val.sym().toString() as unknown as T;
        }
        case xdr.ScValType.scvBytes(): {
            return val.bytes() as unknown as T;
        }
        case xdr.ScValType.scvVec(): {
            type Element = ElementType<T>;
            return val.vec()?.map(v => scValToJs<Element>(v)) as unknown as T;
        }
        case xdr.ScValType.scvMap(): {
            type Key = KeyType<T>;
            type Value = ValueType<T>;
            const res: unknown = {};
            val.map()?.forEach((e) => {
                const key = scValToJs<Key>(e.key());
                let value;
                const v: xdr.ScVal = e.val();
                // For now we assume second level maps are real maps. Not perfect but better.
                switch (v?.switch()) {
                    case xdr.ScValType.scvMap(): {
                        const inner_map = new Map() as Map<unknown, unknown>;
                        v.map()?.forEach((e) => {
                            const key = scValToJs<Key>(e.key());
                            const value = scValToJs<Value>(e.val());
                            inner_map.set(key, value);
                        });
                        value = inner_map;
                        break;
                    }
                    default: {
                        value = scValToJs<Value>(e.val());
                    }
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                res[key as Key] = value as Value;
            });
            return res as unknown as T
        }
        case xdr.ScValType.scvContractInstance():
            return val.instance() as unknown as T;
        case xdr.ScValType.scvLedgerKeyNonce():
            return val.nonceKey() as unknown as T;
        case xdr.ScValType.scvTimepoint():
            return val.timepoint() as unknown as T;
        case xdr.ScValType.scvDuration():
            return val.duration() as unknown as T;
        // TODO: Add this case when merged
        // case xdr.ScValType.scvError():
        default: {
            throw new Error(`type not implemented yet: ${val?.switch().name}`);
        }
    }
}

type ElementType<T> = T extends (infer U)[] ? U : never;
type KeyType<T> = T extends Map<infer K, unknown> ? K : never;
type ValueType<T> = T extends Map<unknown, infer V> ? V : never;

export function addressToScVal(addr: string): xdr.ScVal {
    const addrObj = Address.fromString(addr);
    return addrObj.toScVal();
}

export function i128ToScVal(i: bigint): xdr.ScVal {
    return new ScInt(i).toI128();
}

export function u128ToScVal(i: bigint): xdr.ScVal {
    return new ScInt(i).toU128();
}